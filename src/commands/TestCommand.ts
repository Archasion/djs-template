import Command from "@/handlers/commands/Command.ts";

import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    StringSelectMenuBuilder
} from "discord.js";

import { options } from "@data/examples/select-menu.json";

// noinspection JSUnusedGlobalSymbols
export default class TestCommand extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "test",
            description: "Test all interactions",
        });
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const query = interaction.options.getFocused();
        const choices = ["hello", "world", "foo", "bar"];
        const filtered = choices.filter(choice => choice.startsWith(query));

        const options = filtered.map(choice => ({
            name: choice,
            value: choice
        }));

        await interaction.respond(options);
    }
}