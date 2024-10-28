import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder
} from "discord.js";

import { suggestions } from "@data/examples/autocomplete.json";
import { options } from "@data/examples/select-menu.json";
import Command from "@/handlers/commands/Command";

// Noinspection JSUnusedGlobalSymbols
export default class ExampleCommand extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "example",
			description: "Test all interactions",
			options: [{
				name: "autocomplete",
				description: "Test the autocomplete interaction",
				type: ApplicationCommandOptionType.String,
				autocomplete: true
			}]
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

	override async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
		// Get the input as it is being typed
		const query = interaction.options.getFocused();
		const filteredSuggestions: string[] = suggestions.filter((suggestion: string) => {
			return suggestion.startsWith(query);
		});

		const mappedSuggestions = filteredSuggestions.map(suggestion => {
			const id = suggestion
				.split(" ")
				.join("-")
				.toLowerCase();

			return { name: suggestion, value: id };
		});

		await interaction.respond(mappedSuggestions);
	}
}