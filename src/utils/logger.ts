interface LoggerOptions {
    // ANSI color code
    color?: AnsiColor;
    // Whether to color the full log or just the level
    fullColor?: boolean;
}

export enum AnsiColor {
    Reset = "\x1b[0m",
    Green = "\x1b[32m",
    Cyan = "\x1b[36m",
    Grey = "\x1b[90m",
    Purple = "\x1b[35m",
}

export default class Logger {
    static log(level: string, message: string, options?: LoggerOptions): void {
        const timestamp = new Date().toISOString();
        const timestampString = `${AnsiColor.Grey}[${timestamp}]${AnsiColor.Reset}`;

        if (options?.color && !options.fullColor) {
            console.log(`${timestampString} ${options.color}[${level}]${AnsiColor.Reset} ${message}`);
        } else if (options?.color && options.fullColor) {
            console.log(`${timestampString} ${options.color}[${level}] ${message}`);
        } else {
            console.log(`\x1b[32m${timestampString}${AnsiColor.Reset} [${level}] ${message}`);
        }
    }

    static info(message: string): void {
        Logger.log("INFO", message, {
            color: AnsiColor.Cyan
        });
    }

    static trace(message: string): void {
        Logger.log("TRACE", message, {
            color: AnsiColor.Purple
        });
    }
}