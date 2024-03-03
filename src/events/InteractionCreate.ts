import { InteractionExecuteError, ensureError } from "../utils/errors.ts";
import { components } from "../handlers/components/ComponentManager.ts";
import { commands } from "../handlers/commands/CommandManager.ts";
import { Events, Interaction } from "discord.js";

import EventListener from "../handlers/events/EventListener.ts";

export default class InteractionCreate extends EventListener {
    constructor() {
        super(Events.InteractionCreate);
    }

    async execute(interaction: Interaction): Promise<void> {
        try {
            if (interaction.isCommand()) {
                await commands.handle(interaction);
                return;
            }

            if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
                await components.handle(interaction);
                return;
            }

            if (interaction.isAutocomplete()) {
                await commands.handleAutocomplete(interaction);
                return;
            }
        } catch (_error) {
            const cause = ensureError(_error);
            throw new InteractionExecuteError(interaction, cause);
        }
    }
}