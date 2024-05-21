import { ApplicationCommandOptionType, Interaction, Snowflake } from "discord.js";

export enum ErrorType {
    /** Represents an unknown or unsupported error. */
    UnknownError = "UnknownError",
    /** Represents an error that occurred while trying to publish commands using {@link CommandManager#publishGlobalCommands}. */
    CommandPublishError = "CommandPublishError",
    /** Represents an error that occurred while trying to cache commands using {@link CommandManager#cache}. */
    CommandCachingError = "CommandCachingError",
    /** Represents an error that occurred while trying to cache events using {@link EventListenerManager#mount}. */
    EventListenerMountError = "EventListenerMountError",
    /** Represents an error that occurred while trying to cache components using {@link ComponentManager#cache}. */
    ComponentCachingError = "ComponentCachingError",
    /** Represents an error that occurred while trying to execute an interaction. */
    InteractionExecutionError = "InteractionExecutionError"
}

/** Represents a base error that other errors can extend. */
export class BaseError extends Error {
    constructor(message: string, options?: BaseErrorProps) {
        super(message);

        this.name = options?.name ?? ErrorType.UnknownError;
        this.cause = options?.cause;
    }
}

/** Represents an error that occurred while trying to execute an interaction. */
export class InteractionExecuteError extends BaseError {
    constructor(interaction: Interaction, cause: Error) {
        let interactionOptions: InteractionTraceOptions[] = [];
        let interactionName: string;

        if (interaction.isCommand() || interaction.isAutocomplete()) {
            interactionName = interaction.commandName;
            interactionOptions = interaction.options.data
                .map(option => ({
                    name: option.name,
                    type: ApplicationCommandOptionType[option.type],
                    value: option.value
                }));
        } else {
            interactionName = interaction.customId;
        }

        const trace: InteractionTrace = {
            executorId: interaction.user.id,
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            interaction: {
                name: interactionName,
                options: interactionOptions
            }
        };

        const stringifiedTrace = JSON.stringify(trace, null, 2);

        super(`Failed to execute interaction "${interactionName}"\n\n${stringifiedTrace}`, {
            name: ErrorType.InteractionExecutionError,
            cause
        });
    }
}

/**
 * Ensures that the provided value is an instance of `Error`.
 * If it is not, it will be converted to one.
 *
 * @param error The value to ensure is an `Error`.
 */
export function ensureError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    let parsedError: string;

    if (typeof error === "object") {
        parsedError = JSON.stringify(error, null, 2);
    } else if (error !== undefined) {
        parsedError = error.toString();
    } else {
        parsedError = "An unknown error occurred - cannot parse error as it is undefined.";
    }

    return new Error(parsedError);
}

interface BaseErrorProps {
    cause?: Error;
    name?: ErrorType;
}

/** Represents an interaction trace for debugging purposes.*/
interface InteractionTrace {
    /** The ID of the user who executed the interaction. */
    executorId: Snowflake;
    /** The ID of the channel where the interaction was executed. */
    channelId: Snowflake | null;
    /** The ID of the guild where the interaction was executed. */
    guildId: Snowflake | null;
    /** The interaction's name and options. */
    interaction: {
        /** The name or custom ID of the interaction. */
        name: string;
        /** The options provided with the interaction. */
        options: InteractionTraceOptions[];
    };
}

/** Represents the options provided with an interaction. */
interface InteractionTraceOptions {
    /** The name of the option. */
    name: string;
    /** The type of the option in the format: `[EnumValue] EnumLabel`. */
    type: string;
    /** The value of the option provided by the executor. */
    value: string | number | boolean | undefined;
}