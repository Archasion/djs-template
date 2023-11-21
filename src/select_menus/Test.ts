import { StringSelectMenuInteraction } from "discord.js";
import { SelectMenu } from "../handlers/select_menus/SelectMenu.ts";

export default class Test extends SelectMenu {
    constructor() {
        super("test-select-menu");
    }

    async handle(interaction: StringSelectMenuInteraction): Promise<void> {
        const [selected] = interaction.values;
        await interaction.reply(selected);
    }
}