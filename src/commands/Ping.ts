import { ChatInputCommandInteraction } from "discord.js";
import Command from "../handlers/commands/Command.ts";

export default class Ping extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "ping",
            description: "Replies with pong!",
        });
    }

    async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("🏓 Pong!");
    }
}