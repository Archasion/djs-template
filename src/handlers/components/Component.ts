import type { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

/** The base class for all component interactions. */
export default abstract class Component {
	/**
	 * @param customId The custom ID of the component.
	 * @protected
	 */
	protected constructor(public customId: CustomID) {
	}

	/**
	 * Handles the component interaction.
	 * @param interaction The interaction to handle.
	 */
	abstract execute(interaction: ComponentInteraction): Promise<void> | void;
}

export type ComponentInteraction = MessageComponentInteraction | ModalSubmitInteraction;
export type CustomID = string;