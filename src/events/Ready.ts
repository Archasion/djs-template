import type { Client } from "discord.js";
import { Events } from "discord.js";
import EventListener from "@/handlers/events/EventListener";
import Logger, { AnsiColor } from "@/utils/logger";

// noinspection JSUnusedGlobalSymbols
export default class Ready extends EventListener {
	constructor() {
		super(Events.ClientReady, {
			once: true
		});
	}

	async execute(client: Client<true>): Promise<void> {
		Logger.log("READY", `Successfully logged in as ${client.user.tag}`, {
			color: AnsiColor.Green,
			fullColor: true
		});
	}
}