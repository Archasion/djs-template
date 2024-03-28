import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    StringSelectMenuBuilder
} from "discord.js";

import { suggestions } from "@data/examples/autocomplete.json";
import { options } from "@data/examples/select-menu.json";

import Command from "@/handlers/commands/Command.ts";

// noinspection JSUnusedGlobalSymbols
export default class ExampleCommand extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "example",
            description: "Test all interactions",
        }, []);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const button = new ButtonBuilder()
            .setCustomId("example-button")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Open Modal");

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("example-select-menu")
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
        // Get the input as it is being typed
        const query = interaction.options.getFocused();
        const queriedSuggestions: string[] = suggestions.filter((suggestion: string) => suggestion.startsWith(query));

        const options = queriedSuggestions.map(suggestion => {
            const id = suggestion
                .split(" ")
                .join("-")
                .toLowerCase();

            return { name: suggestion, value: id };
        });

        await interaction.respond(options);
    }
}