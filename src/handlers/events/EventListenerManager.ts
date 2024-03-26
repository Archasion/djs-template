import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";
import { client } from "@/index.ts";

import EventListener from "./EventListener.ts";
import Logger from "@/utils/logger.ts";
import path from "path";
import fs from "fs";

/** Utility class for handling event listeners. */
export default class EventListenerManager {
    /** Mounts all event listeners from the events directory. */
    static async mount(): Promise<void> {
        // Resolve the path to the events directory [src/events]
        const dirpath = path.resolve(__dirname, "../../events");
        const filenames = fs.readdirSync(dirpath);

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the event listener
                const listenerModule = await import(filepath);
                const listenerClass = listenerModule.default;
                const listener: AbstractInstanceType<typeof EventListener> = new listenerClass();

                if (listener.options?.once) {
                    // Handle the event once per session
                    client.once(listener.event, (...args) => listener.execute(...args));
                } else {
                    // Handle the event every time it is emitted
                    client.on(listener.event, (...args) => listener.execute(...args));
                }
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to mount event listeners", {
                name: ErrorType.EventListenerMountError,
                cause
            });
        }

        Logger.info(`Loaded ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
    }
}