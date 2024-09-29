import { InteractionContextType, PermissionFlagsBits } from "discord.js";

/** The default permissions required to use commands. */
export const DEFAULT_COMMAND_PERMISSIONS: readonly bigint[] = [PermissionFlagsBits.ManageGuild];

/** The default contexts in which the commands can be used. */
export const DEFAULT_COMMAND_CONTEXTS: readonly InteractionContextType[] = [
    InteractionContextType.Guild
];