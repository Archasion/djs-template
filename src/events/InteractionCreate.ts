import type { Interaction } from "discord.js";
import { Events } from "discord.js";
import { ensureError, InteractionExecuteError } from "@/utils/errors";
import ComponentManager from "@/handlers/components/ComponentManager";
import CommandManager from "@/handlers/commands/CommandManager";
import EventListener from "@/handlers/events/EventListener";

// Noinspection JSUnusedGlobalSymbols
export default class InteractionCreate extends EventListener {
	constructor() {
		super(Events.InteractionCreate);
	}

	async execute(interaction: Interaction): Promise<void> {
		try {
			if (interaction.isCommand()) {
				await CommandManager.handleCommand(interaction);
				return;
			}

			if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
				await ComponentManager.handle(interaction);
				return;
			}

			if (interaction.isAutocomplete()) {
				await CommandManager.handleAutocomplete(interaction);
			}
		} catch (_error: unknown) {
			const cause = ensureError(_error);

			if (interaction.isRepliable()) {
				await interaction.reply({
					content: "An error occurred while trying to execute this command.",
					ephemeral: true
				});
			}

			throw new InteractionExecuteError(interaction, cause);
		}
	}
}