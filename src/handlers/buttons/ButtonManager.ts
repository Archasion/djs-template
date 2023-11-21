import Logger from "../../utils/logger.ts";
import path from "path";
import fs from "fs";

import { ButtonInteraction } from "discord.js";
import { Button } from "./Button.ts";

class ButtonManager {
    // Class instances of buttons mapped by their customId
    private instances = new Map<string, Button>;

    // Create instances of all buttons and store them in a map
    async register(): Promise<void> {
        const dirpath = path.resolve(__dirname, "../../buttons");
        const filenames = fs.readdirSync(dirpath);

        for (const filename of filenames) {
            const filepath = path.resolve(dirpath, filename);

            const buttonModule = await import(filepath);
            const buttonClass = buttonModule.default;
            const button = new buttonClass();

            this.instances.set(button.customId, button);
        }

        Logger.info(`Registered ${this.instances.size} buttons`)
    }

    async handle(interaction: ButtonInteraction): Promise<void> {
        const button = this.instances.get(interaction.customId);

        if (!button) {
            throw new Error(`Button "${interaction.customId}" not found`);
        }

        await button.handle(interaction);
    }
}

export const buttons = new ButtonManager();