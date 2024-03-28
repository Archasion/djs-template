import { DEFAULT_CLIENT_INTENTS, DEFAULT_CLIENT_PARTIALS } from "./utils/constants";
import { Client } from "discord.js";

import EventListenerManager from "./handlers/events/EventListenerManager";
import ComponentManager from "@/handlers/components/ComponentManager";
import CommandManager from "@/handlers/commands/CommandManager";

if (!process.env.DISCORD_TOKEN) {
    throw new Error("No token provided! Configure the DISCORD_TOKEN environment variable.");
}

/** Discord client instance. */
export const client: Client<true> = new Client({
    intents: DEFAULT_CLIENT_INTENTS,
    partials: DEFAULT_CLIENT_PARTIALS
});

// Load event listeners and login
(async () => {
    await ComponentManager.cache();
    await CommandManager.cache();

    await client.login(process.env.DISCORD_TOKEN);

    await CommandManager.publish();
    await EventListenerManager.mount();

    // Emit the ready event again after mounting event listeners
    client.emit("ready", client);
})();