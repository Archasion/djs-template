import { AutocompleteInteraction, Collection, CommandInteraction, Snowflake } from "discord.js";
import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";
import { client } from "@/index.ts";

import Logger, { AnsiColor } from "@/utils/logger.ts";
import Command from "./Command.ts";
import path from "path";
import fs from "fs";

/** Utility class for handling command interactions. */
export default class CommandManager {
    /** Cached global commands mapped by their names. */
    private static _globalCommands = new Collection<string, Command<CommandInteraction>>();
    /** Cached guild commands mapped by their guild's ID. */
    private static _guildCommands = new Collection<Snowflake, Collection<string, Command<CommandInteraction>>>();

    /** Caches all commands from the commands directory. */
    static async cache(): Promise<void> {
        const dirpath = path.resolve("src/commands");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping command caching: commands directory not found");
            return;
        }

        Logger.info("Caching commands...");
        const filenames = fs.readdirSync(dirpath);

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the command
                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command: AbstractInstanceType<typeof Command<CommandInteraction>> = new commandClass();
                const logMessage = `Cached command "${command.data.name}"`;

                if (command.guildIds?.length) {
                    for (const guildId of command.guildIds) {
                        let guildCommands = CommandManager._guildCommands.get(guildId);

                        // Initialize the guild's command collection if it doesn't exist
                        if (!guildCommands) {
                            guildCommands = new Collection<string, Command<CommandInteraction>>();
                            CommandManager._guildCommands.set(guildId, guildCommands);
                        }

                        // Append the command to the guild's command collection
                        guildCommands.set(command.data.name, command);

                        Logger.log(`GUILD: ${guildId}`, logMessage, {
                            color: AnsiColor.Purple
                        });
                    }
                } else {
                    CommandManager._globalCommands.set(command.data.name, command);

                    Logger.log("GLOBAL", logMessage, {
                        color: AnsiColor.Purple
                    });
                }
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache commands", {
                name: ErrorType.CommandCachingError,
                cause
            });
        }

        const commandCount = filenames.length;
        Logger.info(`Cached ${commandCount} ${pluralize(commandCount, "command")}`);
    }

    /** Publish all cached commands to Discord. */
    static async publish(): Promise<void> {
        Logger.info("Publishing commands...");

        const logMessage = (commandCount: number) => `Published ${commandCount} ${pluralize(commandCount, "command")}`;

        // Publish guild commands
        for (const [guildId, guildCommands] of CommandManager._guildCommands) {
            const guild = await client.guilds.fetch(guildId).catch(cause => {
                throw new BaseError(`Failed to fetch guild while publishing commands [ID: ${guildId}]`, {
                    name: ErrorType.CommandPublishError,
                    cause
                });
            });

            // Retrieve all cached guild commands and build them
            const commands = guildCommands.map(command => command.build());
            const publishedCommands = await guild.commands.set(commands);

            if (!publishedCommands) {
                throw new BaseError(`Failed to publish guild commands [ID: ${guildId}]`, {
                    name: ErrorType.CommandPublishError
                });
            }

            Logger.log(`GUILD: ${guildId}`, logMessage(publishedCommands.size), {
                color: AnsiColor.Purple
            });
        }

        // Publish global commands
        // Retrieve all cached global commands and build them
        const globalCommands = CommandManager._globalCommands.map(command => command.build());

        // No commands to publish
        if (!globalCommands.length) return;

        const publishedCommands = await client.application.commands.set(globalCommands);

        if (!publishedCommands) {
            throw new BaseError("Failed to publish global commands", {
                name: ErrorType.CommandPublishError
            });
        }

        Logger.log("GLOBAL", logMessage(publishedCommands.size), {
            color: AnsiColor.Purple
        });

        Logger.info("Finished publishing commands");
    }

    /** Handles a command interaction. */
    static async handleCommand(interaction: CommandInteraction): Promise<void> {
        const command = await CommandManager._get(
            interaction.commandId,
            interaction.commandName,
            interaction.guildId
        );

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        await command.execute(interaction);
    }

    /** Handles an autocomplete interaction. */
    static async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const command = await CommandManager._get(
            interaction.commandId,
            interaction.commandName,
            interaction.guildId
        );

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        // Ensure the command has an autocomplete() method
        if (!command.autocomplete) {
            throw new Error(`Command "${interaction.commandName}" does not have an autocomplete() method`);
        }

        await command.autocomplete(interaction);
    }

    /**
     * Retrieves a command by its name.
     *
     * @param commandId The command's ID.
     * @param commandName The command's name.
     * @param guildId The source guild's ID.
     * @private
     */
    private static async _get(
        commandId: Snowflake,
        commandName: string,
        guildId: Snowflake | null
    ): Promise<Command<CommandInteraction> | undefined> {
        // application.commands only contains global commands
        const isGlobalCommand = client.application.commands.cache.has(commandId);

        if (isGlobalCommand) {
            return CommandManager._globalCommands.get(commandName);
        }

        if (!guildId) return;

        const guildCommands = CommandManager._guildCommands.get(guildId);
        return guildCommands?.get(commandName);
    }
}