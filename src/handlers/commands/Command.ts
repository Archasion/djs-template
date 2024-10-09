import { ApplicationCommandData, AutocompleteInteraction, CommandInteraction, Snowflake } from "discord.js";
import { DEFAULT_COMMAND_PERMISSIONS, DEFAULT_COMMAND_CONTEXTS, DEFAULT_INTEGRATION_TYPES } from "@/utils/constants";

/** The base class for all commands. */
export default abstract class Command<T extends CommandInteraction> {
    /**
     * @param data The data for the command.
     * @param guildIds The IDs of the guilds to publish the command in. Leave empty to publish the command globally.
     * @protected
     */
    protected constructor(public data: ApplicationCommandData, public guildIds?: Snowflake[]) {}

    /**
     * Handles the command interaction.
     * @param interaction The interaction to handle.
     */
    abstract execute(interaction: T): Promise<void> | void;

    /**
     * Handles the associated autocomplete interaction.
     * @param interaction The interaction to handle.
     */
    autocomplete?(interaction: AutocompleteInteraction): Promise<void> | void;

    build(): ApplicationCommandData {
        return {
            defaultMemberPermissions: DEFAULT_COMMAND_PERMISSIONS,
            contexts: DEFAULT_COMMAND_CONTEXTS,
            integrationTypes: DEFAULT_INTEGRATION_TYPES,
            ...this.data
        };
    }
}