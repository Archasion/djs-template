import { ApplicationCommandData, CommandInteraction } from "discord.js";

export default abstract class Command<T extends CommandInteraction> {
    protected constructor(public data: ApplicationCommandData) {}

    abstract handle(interaction: T): Promise<void> | void;
}