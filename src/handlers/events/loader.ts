import { client } from "index.ts";

import fs from "fs";

export async function loadListeners(): Promise<void> {
    const filenames = fs.readdirSync("./src/events");

    for (const filename of filenames) {
        const listenerModule = await import(`events/${filename}`);
        const listenerClass = listenerModule.default;
        const listener = new listenerClass();

        // Handle the event once per session
        if (listener.options?.once) {
            client.once(listener.event, (...args) => listener.handle(...args));
            continue;
        }

        // Handle the event every time it is emitted
        client.on(listener.event, (...args) => listener.handle(...args));
    }
}