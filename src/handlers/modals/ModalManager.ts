import Logger from "../../utils/logger.ts";
import Modal from "./Modal.ts";
import path from "path";
import fs from "fs";

import { ModalSubmitInteraction } from "discord.js";

class ModalManager {
    // Class instances of modals mapped by their customId
    private instances = new Map<string, Modal>;

    // Create instances of all modals and store them in a map
    async register(): Promise<void> {
        const dirpath = path.resolve(__dirname, "../../modals");
        const filenames = fs.readdirSync(dirpath);

        for (const filename of filenames) {
            const filepath = path.resolve(dirpath, filename);

            const modalModule = await import(filepath);
            const modalClass = modalModule.default;
            const modal = new modalClass();

            this.instances.set(modal.customId, modal);
        }

        Logger.info(`Registered ${this.instances.size} modals`)
    }

    async handle(interaction: ModalSubmitInteraction): Promise<void> {
        const modal = this.instances.get(interaction.customId);

        if (!modal) {
            throw new Error(`Modal "${interaction.customId}" not found`);
        }

        await modal.handle(interaction);
    }
}

export const modals = new ModalManager();