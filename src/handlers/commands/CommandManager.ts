import { AutocompleteInteraction, Collection, CommandInteraction, Snowflake } from "discord.js";
import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { pluralize } from "@/utils";
import { client } from "@/index";

import Logger, { AnsiColor } from "@/utils/logger";
import Command from "./Command";
import path from "path";
import fs from "fs";
import * as assert from "node:assert";

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
            Logger.info("Skipping command caching, path src/commands not found");
            return;
        }

        Logger.info("Caching commands...");
        const filenames = fs.readdirSync(dirpath);

        let globalCommandCount = 0;
        let guildCommandCount = 0;

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the command
                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command = new commandClass();

                // Ensure the command is an instance of the Command class
                assert.ok(command instanceof Command, `Expected default export of Command in ${filepath}`);
                const logMessage = `Cached command "${command.data.name}"`;

                // Publish the command globally if guildIds is not defined
                // Otherwise, publish the command to the specified guilds
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

                    guildCommandCount++;
                } else {
                    CommandManager._globalCommands.set(command.data.name, command);

                    Logger.log("GLOBAL", logMessage, {
                        color: AnsiColor.Purple
                    });

                    globalCommandCount++;
                }
            }
        } catch (_error: unknown) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache commands", {
                name: ErrorType.CommandCachingError,
                cause
            });
        }

        Logger.info(`Cached ${globalCommandCount} ${pluralize(globalCommandCount, "command")} (${globalCommandCount} global, ${guildCommandCount} guild)`);
    }

    /** Publish all cached global commands to Discord. */
    static async publishGlobalCommands(): Promise<void> {
        Logger.info("Publishing global commands...");

        // Retrieve all cached global commands and build them
        const globalCommands = CommandManager._globalCommands.map(command => command.build());

        // No commands to publish
        if (!globalCommands.length) return;

        const publishedCommands = await client.application.commands.set(globalCommands);

        Logger.log("GLOBAL", `Published ${publishedCommands.size} ${pluralize(publishedCommands.size, "command")}`, {
            color: AnsiColor.Purple
        });
    }

    /** Publish all cached guild commands to Discord. */
    static async publishGuildCommands(): Promise<void> {
        for (const [guildId, guildCommands] of CommandManager._guildCommands) {
            // All guilds are cached when the Guilds intent is passed to the client
            const guild = client.guilds.cache.get(guildId);

            if (!guild) {
                throw new BaseError(`Failed to publish commands to guild, unknown guild ID: ${guildId}`, {
                    name: ErrorType.CommandPublishError
                });
            }

            // Retrieve all cached guild commands and build them
            const commands = guildCommands.map(command => command.build());
            const publishedCommands = await guild.commands.set(commands);

            Logger.log(`GUILD: ${guildId}`, `Published ${publishedCommands.size} ${pluralize(publishedCommands.size, "command")}`, {
                color: AnsiColor.Purple
            });
        }
    }

    /** Handles a command interaction. */
    static async handleCommand(interaction: CommandInteraction): Promise<void> {
        const command = CommandManager._get(
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
        const command = CommandManager._get(
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
    private static _get(
        commandId: Snowflake,
        commandName: string,
        guildId: Snowflake | null
    ): Command<CommandInteraction> | undefined {
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