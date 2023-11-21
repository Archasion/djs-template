import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import Modal from "../handlers/modals/Modal.ts";

export default class Test extends Modal {
    constructor() {
        super("test-modal");
    }

    async handle(interaction: ModalSubmitInteraction): Promise<void> {
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