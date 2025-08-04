<script lang="ts">
	import { onMount, tick } from "svelte";
	import Window from "./window.svelte";

	let isProcessing = $state(false);
	let containerEl = $state<HTMLButtonElement | null>();
	let terminalEl = $state<HTMLDivElement | null>();
	let inputEl = $state<HTMLInputElement | null>();
	let inputVal = $state("");
	let terminalLines = $state<string[]>([
		"Welcome to Terminal v1.0",
		"Type 'help' for available commands",
		""
	]);
	let commandHistory = $state<string[]>([]);
	let historyIndex = $state(-1);
	let currentPath = $state("~");

	// Available commands
	const commands = {
		help: () => [
			"Available commands:",
			"  help     - Show this help message",
			"  clear    - Clear the terminal",
			"  echo     - Echo text back",
			"  ls       - List directory contents",
			"  pwd      - Print working directory",
			"  cd       - Change directory",
			"  cat      - Display file contents",
			"  whoami   - Display current user",
			"  date     - Show current date and time",
			"  history  - Show command history"
		],
		clear: () => {
			terminalLines.length = 0;
			return [];
		},
		echo: (args: string[]) => [args.join(" ")],
		ls: () => ["Documents", "Downloads", "Pictures", "about.txt", "projects/"],
		pwd: () => [currentPath],
		cd: (args: string[]) => {
			if (args.length === 0) {
				currentPath = "~";
				return [];
			}
			const dir = args[0];
			if (dir === "..") {
				if (currentPath !== "~") {
					currentPath = currentPath.split("/").slice(0, -1).join("/") || "~";
				}
			} else if (dir === "~") {
				currentPath = "~";
			} else {
				currentPath = currentPath === "~" ? dir : `${currentPath}/${dir}`;
			}
			return [];
		},
		cat: (args: string[]) => {
			if (args.length === 0) return ["cat: missing file operand"];
			const file = args[0];
			if (file === "about.txt" || file === "~/about.txt") {
				return [
					"Hi! I'm a software developer passionate about creating",
					"interactive experiences and building useful tools.",
					"",
					"Skills: JavaScript, TypeScript, Svelte, React, Node.js",
					"Contact: developer@example.com"
				];
			}
			return [`cat: ${file}: No such file or directory`];
		},
		whoami: () => ["frsswq"],
		date: () => [new Date().toString()],
		history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`)
	};

	const executeCommand = async (input: string) => {
		const trimmed = input.trim();
		if (!trimmed) return;

		// Add command to history
		commandHistory.push(trimmed);
		historyIndex = -1;

		// Add command line to terminal
		terminalLines.push(`frsswq:${currentPath}$ ${trimmed}`);

		// Parse command and arguments
		const parts = trimmed.split(" ");
		const command = parts[0];
		const args = parts.slice(1);

		// Execute command
		if (command in commands) {
			isProcessing = true;
			await tick();

			// Simulate processing delay for realism
			await new Promise((resolve) => setTimeout(resolve, 100));

			const output = commands[command as keyof typeof commands](args);
			terminalLines.push(...output);
			isProcessing = false;
		} else {
			terminalLines.push(`bash: ${command}: command not found`);
		}

		// Add empty line for spacing
		terminalLines.push("");

		// Auto-scroll to bottom
		await tick();
		scrollToBottom();
	};

	const scrollToBottom = () => {
		if (terminalEl) {
			terminalEl.scrollTop = terminalEl.scrollHeight;
		}
	};

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (isProcessing) {
			e.preventDefault();
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			await executeCommand(inputVal);
			inputVal = "";
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (commandHistory.length > 0) {
				if (historyIndex === -1) {
					historyIndex = commandHistory.length - 1;
				} else if (historyIndex > 0) {
					historyIndex--;
				}
				inputVal = commandHistory[historyIndex] || "";
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex !== -1) {
				if (historyIndex < commandHistory.length - 1) {
					historyIndex++;
					inputVal = commandHistory[historyIndex] || "";
				} else {
					historyIndex = -1;
					inputVal = "";
				}
			}
		} else if (e.key === "Tab") {
			e.preventDefault();
			// Simple tab completion for commands
			const availableCommands = Object.keys(commands);
			const matches = availableCommands.filter((cmd) => cmd.startsWith(inputVal));
			if (matches.length === 1) {
				inputVal = matches[0];
			}
		} else if (e.ctrlKey && e.key === "c") {
			e.preventDefault();
			terminalLines.push(`frsswq:${currentPath}$ ${inputVal}^C`);
			terminalLines.push("");
			inputVal = "";
			await tick();
			scrollToBottom();
		} else if (e.ctrlKey && e.key === "l") {
			e.preventDefault();
			commands.clear();
		}
	};

	const focusInput = () => {
		if (!isProcessing) {
			inputEl?.focus();
		}
	};

	onMount(() => {
		inputEl?.focus();
		scrollToBottom();
	});
</script>

<Window headerText="Terminal v1.0" posX={15} posY={105} sizeX={600} sizeY={400}>
	<button
		type="button"
		bind:this={containerEl}
		class="flex h-full w-full flex-col bg-black font-mono text-sm text-green-400"
		onclick={focusInput}
	>
		<div
			bind:this={terminalEl}
			class="flex-1 cursor-text overflow-y-auto p-2"
			style="scrollbar-width: thin; scrollbar-color: #4a5568 #1a202c;"
		>
			{#each terminalLines as line, i}
				<div class="leading-relaxed break-words whitespace-pre-wrap">
					{line}
				</div>
			{/each}

			{#if !isProcessing}
				<div class="flex items-center">
					<span class="text-green-400">frsswq:{currentPath}$&nbsp;</span>
					<div class="relative flex-1">
						<input
							bind:this={inputEl}
							bind:value={inputVal}
							onkeydown={handleKeyDown}
							type="text"
							class="w-full border-none bg-transparent text-green-400 caret-transparent outline-none"
							autocomplete="off"
							spellcheck="false"
						/>
						<span
							class="pointer-events-none absolute top-0 animate-pulse text-green-400"
							style="left: {inputVal.length * 0.6}em;"
						>
							█
						</span>
					</div>
				</div>
			{:else}
				<div class="flex items-center">
					<span class="text-green-400">Processing...</span>
					<span class="ml-2 animate-pulse">█</span>
				</div>
			{/if}
		</div>
	</button>
</Window>

<style>
	/* Custom scrollbar for webkit browsers */
	:global(.terminal-scroll::-webkit-scrollbar) {
		width: 8px;
	}

	:global(.terminal-scroll::-webkit-scrollbar-track) {
		background: #1a202c;
	}

	:global(.terminal-scroll::-webkit-scrollbar-thumb) {
		background: #4a5568;
		border-radius: 4px;
	}

	:global(.terminal-scroll::-webkit-scrollbar-thumb:hover) {
		background: #718096;
	}
</style>
