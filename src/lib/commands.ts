import type { Terminal } from "./terminal.svelte";
import type { Command } from "./types";

export const commands = new Map<string, Command>();

commands.set("help", {
	description: "lists all available commands.",
	execute: async (): Promise<string[]> => {
		const commandList = Array.from(commands.entries()).map(
			([name, command]) => ` ${name.padEnd(7)} - ${command.description}`
		);
		return ["available commands:", ...commandList];
	}
});

commands.set("clear", {
	description: "clears the terminal screen.",
	execute: (args: string[], terminal: Terminal): string[] => {
		terminal.lines = [];
		return [];
	}
});

commands.set("date", {
	description: "displays the current date and time",
	execute: async (): Promise<string[]> => {
		return [new Date().toString()];
	}
});

commands.set("whoami", {
	description: "displays the current user.",
	execute: async (): Promise<string[]> => {
		return ["frsswq"];
	}
});
