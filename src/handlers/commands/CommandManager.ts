import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";
import { client } from "@/index.ts";

import Logger from "@/utils/logger.ts";
import Command from "./Command.ts";
import path from "path";
import fs from "fs";

/** Utility class for handling command interactions. */
export default class CommandManager {
    /** Cached commands mapped by their names. */
    private static _cache = new Map<string, Command<CommandInteraction>>;

    /** Caches all commands from the commands directory. */
    static async cache(): Promise<void> {
        // Resolve the path to the commands directory [src/commands]
        const dirpath = path.resolve(__dirname, "../../commands");
        const filenames = fs.readdirSync(dirpath);

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the command
                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command: AbstractInstanceType<typeof Command<CommandInteraction>> = new commandClass();

                // Cache the command
                CommandManager._cache.set(command.data.name, command);
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache commands", {
                name: ErrorType.CommandCachingError,
                cause
            });
        }

        const cacheSize = CommandManager._cache.size;
        Logger.info(`Cached ${cacheSize} ${pluralize(cacheSize, "command")}`);
    }

    /** Publish all cached commands to Discord (globally). */
    static async publish(): Promise<void> {
        // Retrieve all cached commands and build them
        const commands = Array
            .from(CommandManager._cache.values())
            .map(command => command.build());

        // No commands to publish
        if (!commands.length) return;

        const publishedCommands = await client.application?.commands.set(commands);

        if (!publishedCommands) {
            throw new BaseError("Failed to publish global commands", {
                name: ErrorType.CommandPublishError
            });
        }

        Logger.info(`Published ${publishedCommands.size} ${pluralize(publishedCommands.size, "command")}`);
    }

    /** Handles a command interaction. */
    static async handle(interaction: CommandInteraction): Promise<void> {
        // Retrieve the command's instance from cache by its name
        const command = CommandManager._cache.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        await command.execute(interaction);
    }

    static async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        // Retrieve the command's instance from cache by its name
        const command = CommandManager._cache.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        // Ensure the command has an autocomplete() method
        if (!command.autocomplete) {
            throw new Error(`Command "${interaction.commandName}" does not have an autocomplete() method`);
        }

        await command.autocomplete(interaction);
    }
}