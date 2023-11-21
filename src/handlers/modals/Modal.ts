import { ModalSubmitInteraction } from "discord.js";

export default abstract class Modal {
    protected constructor(public customId: string) {}

    abstract handle(interaction: ModalSubmitInteraction): Promise<void> | void;
}