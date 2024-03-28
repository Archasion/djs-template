import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { AbstractInstanceType } from "@/utils/types";
import { pluralize } from "@/utils";
import { client } from "@/index";

import EventListener from "./EventListener";
import Logger, { AnsiColor } from "@/utils/logger";
import path from "path";
import fs from "fs";

/** Utility class for handling event listeners. */
export default class EventListenerManager {
    /** Mounts all event listeners from the events directory. */
    static async mount(): Promise<void> {
        const dirpath = path.resolve("src/events");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping event mounting: events directory not found");
            return;
        }

        Logger.info("Mounting event listeners...");
        const filenames = fs.readdirSync(dirpath);

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the event listener
                const listenerModule = await import(filepath);
                const listenerClass = listenerModule.default;
                const listener: AbstractInstanceType<typeof EventListener> = new listenerClass();
                const logMessage = `Mounted event listener "${listener.event}"`;

                if (listener.options?.once) {
                    // Handle the event once per session
                    client.once(listener.event, (...args) => listener.execute(...args));

                    Logger.log("ONCE", logMessage, {
                        color: AnsiColor.Purple
                    });
                } else {
                    // Handle the event every time it is emitted
                    client.on(listener.event, (...args) => listener.execute(...args));

                    Logger.log("ON", logMessage, {
                        color: AnsiColor.Purple
                    });
                }
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to mount event listeners", {
                name: ErrorType.EventListenerMountError,
                cause
            });
        }

        Logger.info(`Mounted ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
    }
}