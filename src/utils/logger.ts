/** Options for the logger. */
interface ColorOptions {
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
	Red = "\x1b[31m",
	Purple = "\x1b[35m",
	Orange = "\x1b[33m"
}

/** Utility class for logging messages. */
export default class Logger {
	/**
	 * Logs a message to the console.
	 *
	 * - **Output format**: `[timestamp] [level] {message}`
	 * - **Example**: `[1970-01-01T00:00:00.000Z] [INFO] Hello, world!`
	 *
	 * @param level The level for the log.
	 * @param message The message to log.
	 * @param options The options for the logger.
	 */
	static log(level: string, message: string, options?: ColorOptions): void {
		const timestamp = new Date().toISOString();
		const formattedTimestamp = Logger._color(`[${timestamp}]`, AnsiColor.Grey);

		// Default output if no color is specified.
		if (!options?.color) {
			console.log(`\x1b[32m${formattedTimestamp}${AnsiColor.Reset} [${level}] ${message}`);
			return;
		}

		if (options.fullColor) {
			message = Logger._color(`[${level}] ${message}`, options.color);
		} else {
			const coloredLevel = Logger._color(`[${level}]`, options.color);
			message = `${coloredLevel} ${message}`;
		}

		console.log(`${formattedTimestamp} ${message}`);
	}

	/** Uses {@link Logger#log} with a cyan `[INFO]` tag */
	static info(message: string): void {
		Logger.log("INFO", message, {
			color: AnsiColor.Cyan
		});
	}

	/** Uses {@link Logger#log} with an orange `[WARN]` tag */
	static warn(message: string): void {
		Logger.log("WARN", message, {
			color: AnsiColor.Orange
		});
	}

	/** Uses {@link Logger#log} with a red `[ERROR]` tag */
	static error(message: string): void {
		Logger.log("ERROR", message, {
			color: AnsiColor.Red
		});
	}

	/**
	 * Applies color to a message.
	 *
	 * @param message The message to color.
	 * @param color The color to apply.
	 * @returns The colored message.
	 * @private
	 */
	private static _color(message: string, color: AnsiColor): string {
		return `${color}${message}${AnsiColor.Reset}`;
	}
}