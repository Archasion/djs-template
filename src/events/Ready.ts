import type { Client } from "discord.js";
import { Events } from "discord.js";
import EventListener from "@/handlers/events/EventListener";
import Logger, { AnsiColor } from "@/utils/logger";

// Noinspection JSUnusedGlobalSymbols
export default class Ready extends EventListener {
	constructor() {
		super(Events.ClientReady, {
			once: true
		});
	}

	execute(client: Client<true>): void {
		Logger.log("READY", `Successfully logged in as ${client.user.tag}`, {
			color: AnsiColor.Green,
			fullColor: true
		});
	}
}