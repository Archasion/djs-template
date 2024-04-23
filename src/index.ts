import { DEFAULT_CLIENT_INTENTS, DEFAULT_CLIENT_PARTIALS } from "./utils/constants";
import { Database } from "bun:sqlite";
import { Client, Snowflake } from "discord.js";

import EventListenerManager from "./handlers/events/EventListenerManager";
import ComponentManager from "@/handlers/components/ComponentManager";
import CommandManager from "@/handlers/commands/CommandManager";

if (!process.env.DISCORD_TOKEN) {
    throw new Error("No token provided! Configure the DISCORD_TOKEN environment variable.");
}

export const db = new Database("whitelist.sqlite");

/** Discord client instance. */
export const client: Client<true> = new Client({
    intents: DEFAULT_CLIENT_INTENTS,
    partials: DEFAULT_CLIENT_PARTIALS
});

// Load event listeners and login
(async () => {
    await ComponentManager.cache();
    await CommandManager.cache();

    // Initiate the table
    db.run(`
        CREATE TABLE IF NOT EXISTS whitelist
        (
            alt_id TEXT PRIMARY KEY NOT NULL,
            owner_id TEXT NOT NULL
        ) WITHOUT ROWID;
    `);

    await client.login(process.env.DISCORD_TOKEN);

    await CommandManager.publish();
    await EventListenerManager.mount();

    // Emit the ready event again after mounting event listeners
    client.emit("ready", client);
})();

export interface WhitelistEntry {
    alt_id: Snowflake;
    owner_id: Snowflake;
}