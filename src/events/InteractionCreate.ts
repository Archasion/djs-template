import { Events, Interaction } from "discord.js";
import { commands } from "../handlers/commands/CommandManager.ts";

import EventListener from "../handlers/events/EventListener.ts";

export default class InteractionCreate extends EventListener {
    constructor() {
        super(Events.InteractionCreate);
    }

    async handle(interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            await commands.handle(interaction);
            return;
        }

        if (interaction.isRepliable()) {
            await interaction.reply({
                content: "This interaction type is not yet supported",
                ephemeral: true
            });
        }
    }
}