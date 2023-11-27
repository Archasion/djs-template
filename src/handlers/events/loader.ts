import EventListener from "./EventListener.ts";
import path from "path";
import fs from "fs";

import { client } from "../../index.ts";
import { AbstractInstanceType } from "../../utils/types.ts";

export async function loadListeners(): Promise<void> {
    const dirpath = path.resolve(__dirname, "../../events");
    const filenames = fs.readdirSync(dirpath);

    for (const filename of filenames) {
        const filepath = path.resolve(dirpath, filename);

        const listenerModule = await import(filepath);
        const listenerClass = listenerModule.default;
        const listener: AbstractInstanceType<typeof EventListener> = new listenerClass();

        // Handle the event once per session
        if (listener.options?.once) {
            client.once(listener.event, (...args) => listener.execute(...args));
            continue;
        }

        // Handle the event every time it is emitted
        client.on(listener.event, (...args) => listener.execute(...args));
    }
}