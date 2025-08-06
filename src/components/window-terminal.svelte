<script lang="ts">
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import { innerHeight, innerWidth } from "svelte/reactivity/window";
	import { DEFAULT_PROMPT } from "../lib/const";
	import { Terminal } from "../lib/terminal.svelte";
	import Window from "./window.svelte";

	const terminal = new Terminal();

	let isProcessing = $state(false);
	const isMobile = new MediaQuery("max-width: 640px");

	let terminalEl: HTMLDivElement | null;
	let commandEl: HTMLTextAreaElement | null;

	const TERMINAL_POS_Y = 106;

	let isCommandFocused = $state(false);

	let sizeX = $state(0);
	let sizeY = $state(0);
	let posY = $state(TERMINAL_POS_Y);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			terminal.processInput(terminal.currentInput);
			setTimeout(() => {
				if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
			}, 0);
		}

		// @TODO: Add up and down key for accessing commands

		// if (e.key === "ArrowUp") {
		// 	e.preventDefault();
		// 	if (commandHistory.length > 0 && commandHistoryIndex !== null && commandHistoryIndex > 0) {
		// 		commandHistoryIndex -= 1;
		// 		commandVal = commandHistory[commandHistoryIndex];
		// 	}
		// }

		// if (e.key === "ArrowDown") {
		// 	e.preventDefault();
		// 	if (commandHistory.length > 0 && commandHistoryIndex !== null) {
		// 		if (commandHistoryIndex < commandHistory.length - 1) {
		// 			commandHistoryIndex += 1;
		// 			commandVal = commandHistory[commandHistoryIndex];
		// 		} else {
		// 			commandHistoryIndex = commandHistory.length;
		// 			commandVal = "";
		// 		}
		// 	}
		// }

		if (e.key === "Escape") {
			e.preventDefault();
			commandEl?.blur();
		}
	};

	onMount(async () => {
		if (!innerWidth.current || !innerHeight.current) return;

		const DESKTOP_WIDTH = 400;
		const DESKTOP_HEIGHT = (DESKTOP_WIDTH * 3) / 4;
		const MOBILE_WIDTH = innerWidth.current - 30;
		const MOBILE_HEIGHT = MOBILE_WIDTH * (3 / 4);

		sizeX = isMobile.current ? MOBILE_WIDTH : DESKTOP_WIDTH;
		sizeY = isMobile.current ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

		await terminal.processInput("help");
		await terminal.processInput("about");

		setTimeout(() => {
			if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
		}, 0);
	});
</script>

<Window headerText="Shell Tool 1.0" posX={16} {posY} {sizeX} {sizeY}>
	<div
		bind:this={terminalEl}
		class=" terminal-scrollbar flex h-full w-full flex-col overflow-y-scroll px-[3px] select-text hover:cursor-text"
		onclick={() => commandEl?.focus()}
		style="scrollbar-arrow-color: transparent;"
		tabindex="-1"
		aria-hidden="true"
	>
		{#each terminal.lines as line}
			<span class="text-left wrap-anywhere whitespace-pre-wrap"
				>{line === "" ? "\u00A0" : line}</span
			>
		{/each}

		<div class="flex min-w-0 flex-1">
			<div class="relative h-full w-full">
				<!-- svelte-ignore a11y_autofocus-->
				<textarea
					class="command-scrollbar w-full resize-none bg-none text-transparent caret-transparent outline-none"
					rows="2"
					onkeydown={handleKeyDown}
					oninput={() => (terminal.currentInput = terminal.currentInput.toLowerCase())}
					bind:this={commandEl}
					bind:value={terminal.currentInput}
					onfocus={() => (isCommandFocused = true)}
					onblur={() => (isCommandFocused = false)}
					disabled={isProcessing}
					spellcheck="false"
					autofocus
					style="wi"
				></textarea>
				<span
					class="pointer-events-none absolute top-0 left-0 w-full min-w-0 text-left wrap-anywhere whitespace-pre-wrap"
				>
					{DEFAULT_PROMPT}{terminal.currentInput}<span
						class={isCommandFocused ? "animate-blink" : "text-transparent"}>█</span
					>
				</span>
			</div>
		</div>
	</div>
</Window>
