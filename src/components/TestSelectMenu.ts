import { StringSelectMenuInteraction } from "discord.js";
import Component from "../handlers/components/Component.ts";

export default class TestSelectMenu extends Component {
    constructor() {
        super("test-select-menu");
    }

    async execute(interaction: StringSelectMenuInteraction): Promise<void> {
        const [selected] = interaction.values;
        await interaction.reply(selected);
    }
}