import EventListener from "./EventListener.ts";
import Logger from "@/utils/logger.ts";
import path from "path";
import fs from "fs";

import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";
import { client } from "@/index.ts";

/** Loads all event listeners from the events directory. */
export async function loadListeners(): Promise<void> {
    const dirpath = path.resolve(__dirname, "../../events");
    const filenames = fs.readdirSync(dirpath);

    for (const filename of filenames) {
        const filepath = path.resolve(dirpath, filename);

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

    Logger.info(`Loaded ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
}