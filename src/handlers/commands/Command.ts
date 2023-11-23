import { ApplicationCommandData, CommandInteraction } from "discord.js";

export default abstract class Command<T extends CommandInteraction> {
    protected constructor(public data: ApplicationCommandData) {}

    abstract execute(interaction: T): Promise<void> | void;
}