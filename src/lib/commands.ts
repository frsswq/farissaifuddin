import { Terminal } from "./terminal.svelte";
import type { Command } from "./types";

export const commands = new Map<string, Command>();

commands.set("help", {
	description: "lists all available commands",
	execute: async () => {
		const commandList = Array.from(commands.entries()).map(
			([name, command]) => ` ${name.padEnd(8)} - ${command.description}`
		);
		return ["commands:", ...commandList];
	}
});

commands.set("clear", {
	description: "clears the terminal screen",
	execute: (_, terminal: Terminal) => {
		terminal.outputLines = [];
		return [];
	}
});

commands.set("date", {
	description: "displays the current date and time",
	execute: async () => [new Date().toString()]
});

commands.set("whoami", {
	description: "displays the current user",
	execute: async () => ["frsswq"]
});

commands.set("echo", {
	description: "displays the given text",
	execute: async (args) => [args.join(" ")]
});

commands.set("history", {
	description: "shows command history",
	execute: async (_, terminal: Terminal) =>
		terminal.commandHistory.length
			? terminal.commandHistory.map((cmd, i) => `${i + 1}: ${cmd}`)
			: ["no history"]
});
