import { commands } from "./commands";
import { DEFAULT_PROMPT } from "./const";

interface TerminalState {
	outputLines: string[];
	commandHistory: string[];
	currentCommand: string;
	historyIndex: number;
	isExecuting: boolean;
	executeCommand: (command: string) => void;
	navigateHistory: (direction: "up" | "down") => void;
}

export class Terminal implements TerminalState {
	outputLines = $state<string[]>([]);
	commandHistory = $state<string[]>([]);
	currentCommand = $state<string>("");
	historyIndex = $state<number>(0);
	isExecuting = $state<boolean>(false);
	private tempCommand = $state<string>("");

	static readonly PROMPT = DEFAULT_PROMPT;

	executeCommand = async (command: string) => {
		this.isExecuting = true;

		if (command && command !== this.commandHistory.at(-1)) {
			this.commandHistory.push(command);
		}

		this.historyIndex = this.commandHistory.length;
		this.currentCommand = "";

		this.outputLines.push(`${Terminal.PROMPT}${command}`);

		const trimmedCommand = command.trim();

		if (trimmedCommand === "") {
			await this.runCommand("", []);
		} else {
			const [cmd, ...args] = trimmedCommand.split(" ");
			await this.runCommand(cmd, args);
		}

		this.isExecuting = false;
	};

	navigateHistory = async (direction: "up" | "down") => {
		if (this.commandHistory.length === 0) return;
		if (direction === "up") {
			if (this.historyIndex === this.commandHistory.length) {
				this.tempCommand = this.currentCommand;
			}

			if (this.historyIndex > 0) {
				this.historyIndex--;
				this.currentCommand = this.commandHistory[this.historyIndex];
			}
		} else if (direction === "down") {
			if (this.historyIndex < this.commandHistory.length - 1) {
				this.historyIndex++;
				this.currentCommand = this.commandHistory[this.historyIndex];
			} else if (this.historyIndex === this.commandHistory.length - 1) {
				this.historyIndex = this.commandHistory.length;
				this.currentCommand = this.tempCommand;
			}
		}
	};

	private runCommand = async (cmd: string, args: string[]) => {
		if (cmd === "") {
			this.outputLines.push("");
			return;
		}

		const command = commands.get(cmd);
		let output: string[];

		if (command) {
			output = await Promise.resolve(command.execute(args, this));
		} else {
			output = [`${cmd}: command not found`];
		}

		if (cmd !== "clear") {
			if (output.length > 0) {
				this.outputLines.push(...output, "");
			} else {
				this.outputLines.push("");
			}
		}
	};
}
