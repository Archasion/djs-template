import Component from "@/handlers/components/Component.ts";

import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";

// noinspection JSUnusedGlobalSymbols
export default class TestModal extends Component {
    constructor() {
        super("test-modal");
    }

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        // Get value from input field
        const phrase = interaction.components[0].components[0].value;

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