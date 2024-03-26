import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";

import Component from "@/handlers/components/Component.ts";

// noinspection JSUnusedGlobalSymbols
export default class ExampleModal extends Component {
    constructor() {
        super("example-modal");
    }

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        const phrase = interaction.fields.getTextInputValue("example-input");

        const embed = new EmbedBuilder()
            .setColor(Colors.Blurple)
            .setDescription(phrase)
            .setAuthor({
                name: `Phrase from ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed] });
    }
}