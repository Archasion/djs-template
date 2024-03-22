import { DEFAULT_CLIENT_INTENTS, DEFAULT_CLIENT_PARTIALS } from "./utils/constants.ts";
import { loadListeners } from "./handlers/events/loader.ts";
import { Client } from "discord.js";

if (!process.env.DISCORD_TOKEN) {
    throw new Error("No token provided! Configure the DISCORD_TOKEN environment variable.");
}

/** The Discord client instance. */
export const client = new Client({
    intents: DEFAULT_CLIENT_INTENTS,
    partials: DEFAULT_CLIENT_PARTIALS
});

// Load event listeners and login
(async () => {
    await loadListeners();
    await client.login(process.env.DISCORD_TOKEN);
})();