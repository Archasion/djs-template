import Logger from "../../utils/logger.ts";
import path from "path";
import fs from "fs";

import { AnySelectMenuInteraction } from "discord.js";
import { SelectMenu } from "./SelectMenu.ts";

class SelectMenuManager {
    // Class instances of selectMenus mapped by their customId
    private instances = new Map<string, SelectMenu>;

    // Create instances of all selectMenus and store them in a map
    async register(): Promise<void> {
        const dirpath = path.resolve(__dirname, "../../select_menus");
        const filenames = fs.readdirSync(dirpath);

        for (const filename of filenames) {
            const filepath = path.resolve(dirpath, filename);

            const selectMenuModule = await import(filepath);
            const selectMenuClass = selectMenuModule.default;
            const selectMenu = new selectMenuClass();

            this.instances.set(selectMenu.customId, selectMenu);
        }

        Logger.info(`Registered ${this.instances.size} select menus`)
    }

    async handle(interaction: AnySelectMenuInteraction): Promise<void> {
        const selectMenu = this.instances.get(interaction.customId);

        if (!selectMenu) {
            throw new Error(`Select Menu "${interaction.customId}" not found`);
        }

        await selectMenu.handle(interaction);
    }
}

export const selectMenus = new SelectMenuManager();