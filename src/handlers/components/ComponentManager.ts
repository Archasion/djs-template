import { BaseError, ensureError, ErrorType } from "@/utils/errors.ts";
import { AbstractInstanceType } from "@/utils/types.ts";
import { pluralize } from "@/utils";

import Component, { ComponentInteraction, CustomID } from "./Component.ts";
import Logger, { AnsiColor } from "@/utils/logger.ts";
import path from "path";
import fs from "fs";

/** Utility class for handling component interactions. */
export default class ComponentManager {
    /** Cached components mapped by their custom IDs. */
    private static _cache = new Map<CustomID, Component>;

    /** Caches all components from the components directory. */
    static async cache(): Promise<void> {
        const dirpath = path.resolve("src/components");

        if (!fs.existsSync(dirpath)) {
            Logger.info("Skipping component caching: components directory not found");
            return;
        }

        Logger.info("Caching components...");
        const filenames = fs.readdirSync(dirpath);

        try {
            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                // Import and initiate the component
                const componentModule = await import(filepath);
                const componentClass = componentModule.default;
                const component: AbstractInstanceType<typeof Component> = new componentClass();

                // Cache the component
                ComponentManager._cache.set(component.customId, component);

                Logger.log("GLOBAL", `Cached component "${component.customId}"`, {
                    color: AnsiColor.Purple
                });
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to cache components", {
                name: ErrorType.ComponentCachingError,
                cause
            });
        }

        const cacheSize = ComponentManager._cache.size;
        Logger.info(`Cached ${cacheSize} ${pluralize(cacheSize, "component")}`);
    }

    static async handle(interaction: ComponentInteraction): Promise<void> {
        // Retrieve the component's instance from cache by its custom ID
        const component = ComponentManager._cache.get(interaction.customId);

        if (!component) {
            throw new Error(`Component "${interaction.customId}" not found`);
        }

        await component.execute(interaction);
    }
}