import { ClientEvents, Events } from "discord.js";

/**
 * A class that handles an event.
 */
export default abstract class EventListener {
    protected constructor(public event: Extract<Events, keyof ClientEvents>, public options?: { once: boolean }) {
    }

    /** What to do when the event is emitted. */
    abstract execute(...args: any[]): Promise<void> | void;
}