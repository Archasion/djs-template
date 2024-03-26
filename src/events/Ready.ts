import { Client, Events } from "discord.js";

import ComponentManager from "@/handlers/components/ComponentManager.ts";
import CommandManager from "@/handlers/commands/CommandManager.ts";
import EventListener from "@/handlers/events/EventListener.ts";
import Logger, { AnsiColor } from "@/utils/logger.ts";

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
            ComponentManager.cache(),
            CommandManager.cache()
        ]);

        await CommandManager.publish();
    }
}