import Component, { ComponentInteraction, CustomID } from "./Component.ts";
import Logger from "@/utils/logger.ts";
import path from "path";
import fs from "fs";

import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";

/** Utility class for handling component interactions. */
class ComponentManager {
    /** Cached components mapped by their custom IDs. */
    private _cache = new Map<CustomID, Component>;

    /** Caches all components from the components directory. */
    async cache(): Promise<void> {
        try {
            const dirpath = path.resolve(__dirname, "../../components");
            const filenames = fs.readdirSync(dirpath);

            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const componentModule = await import(filepath);
                const componentClass = componentModule.default;
                const component: AbstractInstanceType<typeof Component> = new componentClass();

                this._cache.set(component.customId, component);
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache components", {
                name: ErrorType.ComponentCachingError,
                cause
            });
        }

        Logger.info(`Cached ${this._cache.size} ${pluralize(this._cache.size, "component")}`);
    }

    async handle(interaction: ComponentInteraction): Promise<void> {
        const component = this._cache.get(interaction.customId);

        if (!component) {
            throw new Error(`Component "${interaction.customId}" not found`);
        }

        await component.execute(interaction);
    }
}

/** The global component manager. */
export const components = new ComponentManager();