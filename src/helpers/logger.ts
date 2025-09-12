export const log = new Proxy(
	{},
	{
		get:
			(_, level: "info" | "warn" | "error" | "debug") =>
			(...args: unknown[]) => {
				if (import.meta.env.MODE === "development") {
					// Color styles for different log levels - applied only to the level text
					const box =
						"padding: 2px 5px; border-radius: 3px; font-weight: bold;";
					const styles = {
						info: `background: blue; color: white; ${box}`,
						warn: `background: yellow; color: black; ${box}`,
						error: `background: red; color: white; ${box}`,
						debug: `background: green; color: white; ${box}`,
					};

					// Get current timestamp in the format [HH:MM:SS.mmm]
					const now = new Date();
					const timestamp = [
						now.getHours().toString().padStart(2, "0"),
						now.getMinutes().toString().padStart(2, "0"),
						now.getSeconds().toString().padStart(2, "0"),
					].join(":");

					// Create timestamp and styled level
					const prefix = `%c[${timestamp}][${level.toUpperCase()}]`;

					// biome-ignore lint/suspicious/noConsole: covered by development mode check
					console[level](prefix, styles[level], ...args);
				}
			},
	},
) as Record<keyof Console, (...args: unknown[]) => void>;
