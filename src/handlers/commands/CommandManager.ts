import Logger from "../../utils/logger.ts";
import Command from "./Command.ts";
import path from "path";
import fs from "fs";

import { CommandInteraction } from "discord.js";
import { client } from "../../index.ts";
import { AbstractInstanceType } from "../../utils/types.ts";

class CommandManager {
    // Class instances of commands mapped by their name
    private instances = new Map<string, Command<CommandInteraction>>;

    // Create instances of all commands and store them in a map
    async register(): Promise<void> {
        const dirpath = path.resolve(__dirname, "../../commands");
        const filenames = fs.readdirSync(dirpath);

        for (const filename of filenames) {
            const filepath = path.resolve(dirpath, filename);

            const commandModule = await import(filepath);
            const commandClass = commandModule.default;
            const command: AbstractInstanceType<typeof Command<CommandInteraction>> = new commandClass();

            this.instances.set(command.data.name, command);
        }

        Logger.info(`Registered ${this.instances.size} commands`)
    }

    async publish(): Promise<void> {
        const commands = Array.from(this.instances.values())
            .map(command => command.data);

        const publishedCommands = await client.application?.commands.set(commands);

        if (!publishedCommands) {
            throw new Error("Failed to publish commands");
        }

        Logger.info(`Published ${publishedCommands.size} commands`);
    }

    async handle(interaction: CommandInteraction): Promise<void> {
        const command = this.instances.get(interaction.commandName);

        if (!command) {
            throw new Error(`Command "${interaction.commandName}" not found`);
        }

        await command.execute(interaction);
    }
}

export const commands = new CommandManager();