import type { Terminal } from "./terminal.svelte";

export interface Command {
	description: string;
	execute: (args: string[], terminal: Terminal) => Promise<string[]> | string[];
}
