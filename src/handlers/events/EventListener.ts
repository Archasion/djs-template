import { Events } from "discord.js";

/**
 * A class that handles an event.
 */
export default abstract class EventListener {
    protected constructor(public event: Events, public options?: { once: boolean }) {
    }

    /** What to do when the event is emitted. */
    abstract handle(...args: any[]): Promise<void> | void;
}