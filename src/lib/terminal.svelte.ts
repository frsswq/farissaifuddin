import { commands } from "./commands";
import { DEFAULT_PROMPT } from "./const";

interface TerminalState {
	lines: string[];
	inputHistory: string[];
	currentInput: string;
	historyIndex: number;
	isProcessing: boolean;
	processInput: (input: string) => void;
}

export class Terminal implements TerminalState {
	lines = $state<string[]>([]);
	inputHistory = $state<string[]>([]);
	currentInput = $state<string>("");
	historyIndex = $state<number>(0);
	isProcessing = $state<boolean>(false);

	static readonly PROMPT = DEFAULT_PROMPT;

	processInput = async (input: string) => {
		this.isProcessing = true;

		if (input && input !== this.inputHistory.at(-1)) {
			this.inputHistory.push(input);
		}

		this.historyIndex = this.inputHistory.length;
		this.currentInput = "";

		this.lines.push(`${Terminal.PROMPT}${input}`);

		const trimmedInput = input.trim();

		if (trimmedInput === "") {
			await this.executeCommand("", []);
		} else {
			const [cmd, ...args] = trimmedInput.split(" ");
			await this.executeCommand(cmd, args);
		}

		this.isProcessing = false;
	};

	private executeCommand = async (cmd: string, args: string[]) => {
		if (cmd === "") {
			this.lines.push("");
			return;
		}

		const command = commands.get(cmd);
		let output: string[];

		if (command) {
			output = await Promise.resolve(command.execute(args, this));
		} else {
			output = [`${cmd}: command not found`];
		}

		if (output.length > 0) {
			this.lines.push(...output, "");
		} else {
			this.lines.push("");
		}
	};
}
