import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

export type ComponentInteraction = MessageComponentInteraction | ModalSubmitInteraction;

export default abstract class Component {
    protected constructor(public customId: string) {}

    abstract execute(interaction: ComponentInteraction): Promise<void> | void;
}