import { GatewayIntentBits, InteractionContextType, Partials, PermissionFlagsBits } from "discord.js";

/** The default permissions required to use commands. */
export const DEFAULT_COMMAND_PERMISSIONS: readonly bigint[] = [PermissionFlagsBits.ManageGuild];

/** The default contexts in which the commands can be used. */
export const DEFAULT_COMMAND_CONTEXTS: readonly InteractionContextType[] = [
    InteractionContextType.Guild
];

/** The default intents for the Discord client. */
export const CLIENT_INTENTS: readonly GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
];

/** The default partials for the Discord client. */
export const CLIENT_PARTIALS: Partials[] = [];