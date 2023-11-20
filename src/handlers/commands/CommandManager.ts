import fs from "fs";
import Command from "./Command.ts";
import Logger from "../../utils/logger.ts";

import { CommandInteraction } from "discord.js";
import { client } from "../../index.ts";

class CommandManager {
    private instances = new Map<string, Command<CommandInteraction>>;

    // Create instances of all commands and store them in a map
    async register(): Promise<void> {
        const filenames = fs.readdirSync("./src/commands");

        for (const filename of filenames) {
            const commandModule = await import(`commands/${filename}`);
            const commandClass = commandModule.default;
            const command = new commandClass();

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

        await command.handle(interaction);
    }
}

export const commands = new CommandManager();