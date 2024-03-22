import { ApplicationCommandData, AutocompleteInteraction, CommandInteraction } from "discord.js";
import { DEFAULT_COMMAND_PERMISSIONS, DEFAULT_DM_PERMISSION } from "@/utils/constants.ts";

/** The base class for all commands. */
export default abstract class Command<T extends CommandInteraction> {
    /**
     * @param data The data for the command.
     * @protected
     */
    protected constructor(public data: ApplicationCommandData) {}

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
            dmPermission: DEFAULT_DM_PERMISSION,
            ...this.data
        };
    }
}