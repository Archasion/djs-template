import { components } from "../handlers/components/ComponentManager.ts";
import { commands } from "../handlers/commands/CommandManager.ts";
import { Events, Interaction } from "discord.js";

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

        if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
            await components.handle(interaction);
            return;
        }

        throw new Error(`Interactions of type ${interaction.type} are not supported`);
    }
}