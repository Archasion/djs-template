import { components } from "../handlers/components/ComponentManager.ts";
import { commands } from "../handlers/commands/CommandManager.ts";
import { Client, Events } from "discord.js";

import EventListener from "../handlers/events/EventListener.ts";
import Logger from "../utils/logger.ts";

export default class Ready extends EventListener {
    constructor() {
        super(Events.ClientReady, {
            once: true
        });
    }

    async execute(client: Client<true>): Promise<void> {
        Logger.ready(`Successfully logged in as ${client.user.tag}`);

        await Promise.all([
            components.register(),
            commands.register()
        ]);

        await commands.publish();
    }
}