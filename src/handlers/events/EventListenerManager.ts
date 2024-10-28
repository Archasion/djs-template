import { BaseError, ensureError, ErrorType } from "@/utils/errors";
import { pluralize } from "@/utils";
import { client } from "@/index";
import EventListener from "./EventListener";
import Logger, { AnsiColor } from "@/utils/logger";
import path from "path";
import fs from "fs";
import * as assert from "node:assert";

/** Utility class for handling event listeners. */
export default class EventListenerManager {
	/** Mounts all event listeners from the src/events path. */
	static async mount(): Promise<void> {
		const dirpath = path.resolve("src/events");

		if (!fs.existsSync(dirpath)) {
			Logger.warn("Skipping event mounting, path 'src/events' not found");
			return;
		}

		Logger.info("Mounting event listeners...");
		const filenames = fs.readdirSync(dirpath);

		try {
			for (const filename of filenames) {
				const filepath = path.resolve(dirpath, filename);

				// Import and initiate the event listener
				const listenerModule = await import(filepath);
				const listenerClass = listenerModule.default;
				const listener = new listenerClass();

				// Ensure the listener is an instance of the EventListener class
				assert.ok(listener instanceof EventListener, `Expected default export of EventListener in ${filepath}`);

				const logMessage = `Mounted event listener "${listener.event}"`;

				if (listener.options?.once) {
					// Handle the event once per session
					client.once(listener.event, (...args) => listener.execute(...args));

					Logger.log("ONCE", logMessage, {
						color: AnsiColor.Purple
					});
				} else {
					// Handle the event every time it is emitted
					client.on(listener.event, (...args) => listener.execute(...args));

					Logger.log("ON", logMessage, {
						color: AnsiColor.Purple
					});
				}
			}
		} catch (_error: unknown) {
			const cause = ensureError(_error);

			throw new BaseError("Failed to mount event listeners", {
				name: ErrorType.EventListenerMountError,
				cause
			});
		}

		Logger.info(`Mounted ${filenames.length} ${pluralize(filenames.length, "event listener")}`);
	}
}