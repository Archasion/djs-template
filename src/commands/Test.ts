import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    StringSelectMenuBuilder
} from "discord.js";

import Command from "../handlers/commands/Command.ts";
import { options } from "../../data/examples/select-menu.json";

export default class Test extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "test",
            description: "Test all interactions",
        });
    }

    async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const button = new ButtonBuilder()
            .setCustomId("test-button")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Open Modal");

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("test-select-menu")
            .setPlaceholder("Select option...")
            .setOptions(options);

        const selectMenuActionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .setComponents(selectMenu);

        const buttonActionRow = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(button);

        await interaction.reply({
            content: "Interact with the components below to test them!",
            components: [selectMenuActionRow, buttonActionRow]
        });
    }
}