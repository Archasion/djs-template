import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import Component from "@/handlers/components/Component";

// noinspection JSUnusedGlobalSymbols
export default class ExampleButton extends Component {
    constructor() {
        super("example-button");
    }

    async execute(interaction: ButtonInteraction): Promise<void> {
        const modalInputField = new TextInputBuilder()
            .setCustomId("example-input")
            .setLabel("Phrase")
            .setPlaceholder("Enter phrase...")
            .setRequired(true)
            .setMaxLength(256)
            .setStyle(TextInputStyle.Paragraph);

        const modalActionRow = new ActionRowBuilder<TextInputBuilder>()
            .setComponents(modalInputField);

        const modal = new ModalBuilder()
            .setCustomId("example-modal")
            .setTitle("Example")
            .setComponents(modalActionRow);

        await interaction.showModal(modal);
    }
}