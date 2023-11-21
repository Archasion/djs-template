import { ButtonInteraction } from "discord.js";

export abstract class Button {
    protected constructor(public customId: string) {}

    abstract handle(interaction: ButtonInteraction): Promise<void> | void;
}