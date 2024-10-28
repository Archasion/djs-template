import type { StringSelectMenuInteraction } from "discord.js";
import Component from "@/handlers/components/Component";

// Noinspection JSUnusedGlobalSymbols
export default class ExampleSelectMenu extends Component {
	constructor() {
		super("example-select-menu");
	}

	async execute(interaction: StringSelectMenuInteraction): Promise<void> {
		const [selected] = interaction.values;
		await interaction.reply(selected);
	}
}