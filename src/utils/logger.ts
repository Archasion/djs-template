/** Options for the logger. */
interface LoggerOptions {
    /** The color to use for the log. */
    color?: AnsiColor;
    /** Whether to use full color formatting. */
    fullColor?: boolean;
}

/** ANSI color codes for terminal output. */
export enum AnsiColor {
    Reset = "\x1b[0m",
    Green = "\x1b[32m",
    Cyan = "\x1b[36m",
    Grey = "\x1b[90m",
    Red = "\x1b[31m"
}

/** Utility class for logging messages. */
export default class Logger {
    /**
     * Logs a message to the console.
     * @param level The log level.
     * @param message The message to log.
     * @param options The options for the logger.
     */
    static log(level: string, message: string, options?: LoggerOptions): void {
        const timestamp = new Date().toISOString();
        const timestampString = `${AnsiColor.Grey}[${timestamp}]${AnsiColor.Reset}`;

        if (options?.color && !options.fullColor) {
            console.log(`${timestampString} ${options.color}[${level}]${AnsiColor.Reset} ${message}`);
        } else if (options?.color && options.fullColor) {
            console.log(`${timestampString} ${options.color}[${level}] ${message}${AnsiColor.Reset}`);
        } else {
            console.log(`\x1b[32m${timestampString}${AnsiColor.Reset} [${level}] ${message}`);
        }
    }

    /** Logs an info message to the console. */
    static info(message: string): void {
        Logger.log("INFO", message, {
            color: AnsiColor.Cyan
        });
    }

    /** Logs an error message to the console. */
    static error(message: string): void {
        Logger.log("ERROR", message, {
            color: AnsiColor.Red
        });
    }
}