import { AutocompleteInteraction, Interaction } from "discord.js";

export enum ErrorType {
    UnknownError = "UnknownError",
    CommandPublishError = "CommandPublishError",
    CommandRegisterError = "CommandRegisterError",
    ComponentRegisterError = "ComponentRegisterError",
    InteractionExecutionError = "InteractionExecutionError"
}

interface BaseErrorProps {
    cause?: Error;
    name?: ErrorType;
}

export class BaseError extends Error {
    constructor(message: string, options?: BaseErrorProps) {
        super(message);

        this.name = options?.name ?? ErrorType.UnknownError;
        this.cause = options?.cause;
    }
}

export class InteractionExecuteError extends BaseError {
    constructor(interaction: Exclude<Interaction, AutocompleteInteraction>, cause: Error) {
        const interactionName = interaction.isCommand()
            ? interaction.commandName
            : interaction.customId;

        const debugInfo = JSON.stringify({
            authorId: interaction.user.id,
            channelId: interaction.channelId,
            guildId: interaction.guildId,
        }, null, 2);

        super(`Failed to execute interaction "${interactionName}"\n\n${debugInfo}`, {
            name: ErrorType.InteractionExecutionError,
            cause
        });
    }
}


export function ensureError(error: any): Error {
    if (error instanceof Error) {
        return error;
    }

    let stringifiedError: string;

    if (typeof error === "object") {
        stringifiedError = JSON.stringify(error);
    } else {
        stringifiedError = error.toString();
    }

    return new Error(stringifiedError);
}