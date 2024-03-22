import EventListener from "@/handlers/events/EventListener.ts";
import Logger, { AnsiColor } from "@/utils/logger.ts";

import { components } from "@/handlers/components/ComponentManager.ts";
import { commands } from "@/handlers/commands/CommandManager.ts";
import { Client, Events } from "discord.js";

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

        await Promise.all([
            components.cache(),
            commands.cache()
        ]);

        await commands.publish();
    }
}