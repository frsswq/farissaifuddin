export function executeCommands(input: string): string[] {
	const [cmd, ...args] = input.trim().split(" ");

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
}
