import Logger from "@/utils/logger.ts";
import Command from "./Command.ts";
import path from "path";
import fs from "fs";

import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";
import { client } from "@/index.ts";

/** Utility class for handling command interactions. */
class CommandManager {
    /** Cached commands mapped by their names. */
    private _cache = new Map<string, Command<CommandInteraction>>;

    /** Caches all commands from the commands directory. */
    async cache(): Promise<void> {
        try {
            const dirpath = path.resolve(__dirname, "../../commands");
            const filenames = fs.readdirSync(dirpath);

            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command: AbstractInstanceType<typeof Command<CommandInteraction>> = new commandClass();

                this._cache.set(command.data.name, command);
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache commands", {
                name: ErrorType.CommandCachingError,
                cause
            });
        }

        Logger.info(`Cached ${this._cache.size} ${pluralize(this._cache.size, "command")}`);
    }

    /** Publishes all cached commands to Discord (globally). */
    async publish(): Promise<void> {
        const commands = Array
            .from(this._cache.values())
            .map(command => command.build());

        // No commands to publish
        if (!commands.length) return;

        const publishedCommands = await client.application?.commands.set(commands);

        if (!publishedCommands) {
            throw new BaseError("Failed to publish commands", {
                name: ErrorType.CommandPublishError
            });
        }

        Logger.info(`Published ${publishedCommands.size} ${pluralize(publishedCommands.size, "command")}`);
    }

    /** Handles a command interaction. */
    async handle(interaction: CommandInteraction): Promise<void> {
        const command = this._cache.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        Logger.info(`Executing command "${interaction.commandName}"`);
        await command.execute(interaction);
        Logger.info(`Successfully executed command "${interaction.commandName}"`);
    }

    async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const command = this._cache.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        if (!command.autocomplete) {
            throw new Error(`Command "${interaction.commandName}" does not have an autocomplete() method`);
        }

        Logger.info(`Executing autocomplete for "${interaction.commandName}"`);
        await command.autocomplete(interaction);
        Logger.info(`Successfully executed autocomplete for "${interaction.commandName}"`);
    }
}

/** The global command manager. */
export const commands = new CommandManager();