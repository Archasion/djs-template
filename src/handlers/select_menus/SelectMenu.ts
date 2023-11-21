import { AnySelectMenuInteraction } from "discord.js";

export abstract class SelectMenu {
    protected constructor(public customId: string) {}

    abstract handle(interaction: AnySelectMenuInteraction): Promise<void> | void;
}