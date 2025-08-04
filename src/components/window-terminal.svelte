<script lang="ts">
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import { innerHeight, innerWidth } from "svelte/reactivity/window";
	import { executeCommands } from "../lib/terminal-commands";
	import Window from "./window.svelte";

	let isProcessing = $state(false);
	const isMobile = new MediaQuery("max-width: 640px");

	let terminalEl = $state<HTMLDivElement | null>();
	let inputEl = $state<HTMLTextAreaElement | null>();
	let inputVal = $state("");
	let terminalLines = $state<string[]>([]);
	let sizeX = $state(0);
	let sizeY = $state(0);
	let posY = $state(105);

	const DESKTOP_WIDTH = 400;
	const DESKTOP_HEIGHT = (DESKTOP_WIDTH * 3) / 4;

	function runCommand() {
		const command = inputVal.trim();
		isProcessing = true;

		terminalLines.push(`frsswq% ${inputVal}`);

		const result = executeCommands(command);

		if (command === "clear") {
			terminalLines = [];
		} else if (command) {
			terminalLines.push(...result, "");
		} else {
			terminalLines.push("");
		}

		inputVal = "";

		setTimeout(() => {
			if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
		}, 0);

		isProcessing = false;
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			runCommand();
		}

		// @TODO: Add up and down key for accessing commands
	};

	onMount(() => {
		if (!innerWidth.current || !innerHeight.current) return;

		const MOBILE_WIDTH = innerWidth.current - 30;
		const MOBILE_HEIGHT = MOBILE_WIDTH * (3 / 4);

		sizeX = isMobile.current ? MOBILE_WIDTH : DESKTOP_WIDTH;
		sizeY = isMobile.current ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

		terminalLines.push("frsswq% help", ...executeCommands("help"), "");
		terminalLines.push("frsswq% about", ...executeCommands("about"), "");

		setTimeout(() => {
			if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
		}, 0);
	});
</script>

<Window headerText="cmdtool 1.0" posX={15} {posY} {sizeX} {sizeY}>
	<div
		bind:this={terminalEl}
		class=" terminal-scrollbar flex h-full w-full flex-col overflow-y-scroll px-[3px] select-text hover:cursor-text"
		onclick={() => inputEl?.focus()}
		style="scrollbar-arrow-color: transparent;"
		tabindex="-1"
		aria-hidden="true"
	>
		{#each terminalLines as line}
			<div class="text-left wrap-anywhere whitespace-pre-wrap">{line}<br /></div>
		{/each}

		<div class="flex min-w-0 flex-1">
			<span class="h-fit">frsswq%&nbsp;</span>
			<div class="relative h-full w-full">
				<!-- svelte-ignore a11y_autofocus-->
				<textarea
					class="command-scrollbar w-full resize-none bg-none text-transparent caret-transparent outline-none"
					rows="2"
					onkeydown={handleKeyDown}
					bind:this={inputEl}
					bind:value={inputVal}
					disabled={isProcessing}
					spellcheck="false"
					autofocus
					style="wi"
				></textarea>
				<div
					class="pointer-events-none absolute top-0 left-0 w-full min-w-0 text-left wrap-anywhere whitespace-pre-wrap"
				>
					{inputVal}<span class="animate-blink">█</span>
				</div>
			</div>
		</div>
	</div>
</Window>
