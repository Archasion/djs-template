import { GatewayIntentBits, Partials, PermissionFlagsBits } from "discord.js";

/** The default permission required to use commands. */
export const DEFAULT_COMMAND_PERMISSIONS: bigint[] = [PermissionFlagsBits.ManageGuild];

/** The default state of whether commands should be allowed in DMs. */
export const DEFAULT_DM_PERMISSION: boolean = false;

/** The default intents for the client. */
export const DEFAULT_CLIENT_INTENTS: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
];

/** The default partials for the client. */
export const DEFAULT_CLIENT_PARTIALS: Partials[] = [];