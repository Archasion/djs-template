import { Client, GatewayIntentBits } from "discord.js";

import EventListenerManager from "./handlers/events/EventListenerManager";
import ComponentManager from "@/handlers/components/ComponentManager";
import CommandManager from "@/handlers/commands/CommandManager";
import Logger from "@/utils/logger";

/** Discord client instance. */
export const client: Client<true> = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: []
});

// Load event listeners and login
async function main(): Promise<void> {
    if (!process.env.DISCORD_TOKEN) {
        Logger.error("DISCORD_TOKEN environment variable is not set.");
        process.exit(1);
    }

    await Promise.all([
        ComponentManager.cache(),
        CommandManager.cache()
    ]);

    await client.login(process.env.DISCORD_TOKEN);

    // The client must be logged in for the subsequent operations to work
    await Promise.all([
        CommandManager.publishGlobalCommands(),
        CommandManager.publishGuildCommands(),
        EventListenerManager.mount()
    ]);

    // Emit the ready event again after mounting event listeners
    client.emit("ready", client);
}

if (process.env.NODE_ENV !== "test") {
    main()
        .catch(error => {
            Logger.error(`An error occurred during startup: ${error}`);
            process.exit(1);
        });
}