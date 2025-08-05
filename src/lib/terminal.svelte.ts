interface TerminalState {
	lines: string[];
	inputHistory: string[];
	currentInput: string;
	historyIndex: number;
	isProcessing: boolean;
	DEFAULT_TITLE: string;
	processInput: (input: string) => void;
	executeCommand: (cmd: string, ...args: string[]) => string[];
}

export class Terminal implements TerminalState {
	lines = $state<string[]>([]);
	inputHistory = $state<string[]>([]);
	currentInput = $state<string>("");
	historyIndex = $state<number>(0);
	isProcessing = $state<boolean>(false);

	DEFAULT_TITLE = "frsswq% ";

	processInput = (input: string) => {
		this.isProcessing = true;

		if (
			input &&
			(this.inputHistory.length === 0 || this.inputHistory[this.inputHistory.length - 1] !== input)
		) {
			this.inputHistory.push(input);
		}

		const [cmd, ...args] = input.trim().split(" ");

		if (cmd === "clear") {
			this.lines = [];
			this.currentInput = "";
			this.historyIndex = this.inputHistory.length;
			this.isProcessing = false;
			return;
		}

		this.lines.push(`${this.DEFAULT_TITLE}${input}`);

		const output = this.executeCommand(cmd, ...args);

		if (output.length > 0 && !(output.length === 1 && output[0] === "")) {
			this.lines.push(...output, "");
		} else {
			this.lines.push("");
		}

		this.currentInput = "";
		this.historyIndex = this.inputHistory.length;
		this.isProcessing = false;
	};

	executeCommand = (cmd: string, ...args: string[]): string[] => {
		switch (cmd) {
			case "help":
				return ["available commands:", "- clear", "- date", "- ls", "- whoami"];

			case "date":
				return [`${new Date().toString()}`];

			case "whoami":
				return [`frsswq`];

			case "":
				return [""];

			default:
				return [`${cmd}: command not found`];
		}
	};
}
