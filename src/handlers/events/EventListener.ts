import { ClientEvents, Events } from "discord.js";

/** The base class for all event listeners. */
export default abstract class EventListener {
    /**
     * @param event The event to handle.
     * @param options The options for the event.
     * @param options.once Whether the event should only be handled once.
     * @protected
     */
    protected constructor(public event: Extract<Events, keyof ClientEvents>, public options?: { once: boolean }) {
    }

    /**
     * Handles the event.
     * @param args The arguments to pass to the event listener.
     */
    abstract execute(...args: unknown[]): Promise<void> | void;
}