import { commands } from "../handlers/commands/CommandManager.ts";
import { selectMenus } from "../handlers/select_menus/SelectMenuManager.ts";
import { buttons } from "../handlers/buttons/ButtonManager.ts";
import { modals } from "../handlers/modals/ModalManager.ts";
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

        if (interaction.isButton()) {
            await buttons.handle(interaction);
            return;
        }

        if (interaction.isAnySelectMenu()) {
            await selectMenus.handle(interaction);
            return;
        }

        if (interaction.isModalSubmit()) {
            await modals.handle(interaction);
            return;
        }

        throw new Error(`Interactions of type ${interaction.type} are not supported`);
    }
}