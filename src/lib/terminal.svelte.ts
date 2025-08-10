import { commands } from "./commands";
import { DEFAULT_PROMPT } from "./const";

interface TerminalState {
	outputLines: string[];
	commandHistory: string[];
	commandHistoryIndex: number;
	currentCommand: string;
	isExecuting: boolean;
	executeCommand: (command: string) => void;
	navigateHistory: (direction: "up" | "down") => void;
}

export class Terminal implements TerminalState {
	outputLines = $state<string[]>([]);
	commandHistory = $state<string[]>([]);
	commandHistoryIndex = $state<number>(0);
	currentCommand = $state<string>("");
	isExecuting = $state<boolean>(false);

	private tempCommand = $state<string>("");
	static readonly PROMPT = DEFAULT_PROMPT;

	executeCommand = async (command: string): Promise<void> => {
		if (this.isExecuting) return;

		this.isExecuting = true;

		if (command && command !== this.commandHistory.at(-1)) {
			this.commandHistory.push(command);
		}

		this.commandHistoryIndex = this.commandHistory.length;
		this.currentCommand = "";
		this.outputLines.push(`${Terminal.PROMPT}${command}`);

		const trimmedCommand = command.trim();

		if (trimmedCommand) {
			const [cmd, ...args] = trimmedCommand.split(/\s+/);
			const commandObj = commands.get(cmd);
			const output = commandObj
				? await commandObj.execute(args, this)
				: [`${cmd}: command not found`];

			if (cmd !== "clear") {
				if (output.length) this.outputLines.push(...output, "");
				else this.outputLines.push("");
			}
		} else {
			this.outputLines.push("");
		}

		this.isExecuting = false;
	};

	navigateHistory = async (direction: "up" | "down") => {
		if (this.commandHistory.length === 0) return;
		if (direction === "up") {
			if (this.commandHistoryIndex === this.commandHistory.length) {
				this.tempCommand = this.currentCommand;
			}

			if (this.commandHistoryIndex > 0) {
				this.commandHistoryIndex--;
				this.currentCommand = this.commandHistory[this.commandHistoryIndex];
			}
		} else if (direction === "down") {
			if (this.commandHistoryIndex < this.commandHistory.length - 1) {
				this.commandHistoryIndex++;
				this.currentCommand = this.commandHistory[this.commandHistoryIndex];
			} else if (this.commandHistoryIndex === this.commandHistory.length - 1) {
				this.commandHistoryIndex = this.commandHistory.length;
				this.currentCommand = this.tempCommand;
			}
		}
	};
}
