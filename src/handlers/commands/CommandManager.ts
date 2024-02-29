import Logger from "../../utils/logger.ts";
import Command from "./Command.ts";
import path from "path";
import fs from "fs";

import { CommandInteraction } from "discord.js";
import { client } from "../../index.ts";
import { AbstractInstanceType } from "../../utils/types.ts";
import { pluralize } from "../../utils";
import { BaseError, ensureError, ErrorType } from "../../utils/errors.ts";

class CommandManager {
    // Class instances of commands mapped by their name
    private instances = new Map<string, Command<CommandInteraction>>;

    // Create instances of all commands and store them in a map
    async register(): Promise<void> {
        try {
            const dirpath = path.resolve(__dirname, "../../commands");
            const filenames = fs.readdirSync(dirpath);

            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const commandModule = await import(filepath);
                const commandClass = commandModule.default;
                const command: AbstractInstanceType<typeof Command<CommandInteraction>> = new commandClass();

                this.instances.set(command.data.name, command);
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to register commands", {
                name: ErrorType.CommandRegisterError,
                cause
            });
        }

        Logger.info(`Registered ${this.instances.size} ${pluralize(this.instances.size, "command")}`);
    }

    async publish(): Promise<void> {
        const commands = Array.from(this.instances.values())
            .map(command => command.data);

        if (!commands.length) return;

        const publishedCommands = await client.application?.commands.set(commands);

        if (!publishedCommands) {
            throw new BaseError("Failed to publish commands", {
                name: ErrorType.CommandPublishError
            });
        }

        Logger.info(`Published ${publishedCommands.size} ${pluralize(publishedCommands.size, "command")}`);
    }

    async handle(interaction: CommandInteraction): Promise<void> {
        const command = this.instances.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        Logger.info(`Executing command ${interaction.commandName}`);
        await command.execute(interaction);
        Logger.info(`Successfully executed command ${interaction.commandName}`);
    }
}

export const commands = new CommandManager();