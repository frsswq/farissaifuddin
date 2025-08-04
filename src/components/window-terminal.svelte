<script lang="ts">
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import Window from "./window.svelte";

	let isProcessing = $state(false);
	const isMobile = new MediaQuery("max-width: 768px");

	let terminalEl = $state<HTMLButtonElement | null>();
	let inputEl = $state<HTMLTextAreaElement | null>();
	let inputVal = $state("");
	let terminalLines = $state(["frsswq% cat ~/about/*", ""]);
	let posX, posY;
	let sizeX = $state(0);
	let sizeY = $state(0);

	const DESKTOP_WIDTH = 400;
	const DESKTOP_HEIGHT = (DESKTOP_WIDTH * 3) / 4;
	const MOBILE_WIDTH = 300;
	const MOBILE_HEIGHT = (MOBILE_WIDTH * 3) / 4;

	$effect(() => {
		sizeX = isMobile.current ? MOBILE_WIDTH : DESKTOP_WIDTH;
		sizeY = isMobile.current ? MOBILE_HEIGHT : DESKTOP_HEIGHT;
	});

	const runCommand = () => {
		if (!inputVal.trim()) return;
		isProcessing = true;

		const [cmd, ...args] = inputVal.trim().split(" ");

		if (cmd !== "clear") {
			terminalLines.push(`frsswq% ${inputVal}`);
		}

		if (cmd === "clear") {
			terminalLines = [];
		}

		if (cmd === "date") {
			terminalLines.push(`${new Date().toString()}`);
		}

		if (cmd === "whoami") {
			terminalLines.push(`frsswq (Faris Saifuddin)`);
		}

		if (cmd !== "clear") {
			terminalLines.push("");
		}

		inputVal = "";

		setTimeout(() => {
			if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
		}, 0);

		isProcessing = false;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			runCommand();
		}
	};

	onMount(() => {
		setTimeout(() => {
			if (terminalEl) terminalEl.scrollTop = terminalEl.scrollHeight;
		}, 0);
	});
</script>

<Window headerText="cmdtool 1.0" posX={15} posY={105} {sizeX} {sizeY}>
	<button
		bind:this={terminalEl}
		type="button"
		class="mx-[3px] mt-0.75 flex h-full w-full flex-col select-text hover:cursor-text"
		onclick={() => inputEl?.focus()}
	>
		{#each terminalLines as line}
			<div class="text-left wrap-anywhere whitespace-pre-wrap">{line}<br /></div>
		{/each}

		<div class="flex min-w-0 flex-1">
			<span class="h-fit">frsswq%&nbsp;</span>
			<div class="relative h-full w-full">
				<!-- svelte-ignore a11y_autofocus-->
				<textarea
					class="w-full resize-none bg-none text-transparent caret-transparent outline-none"
					rows="2"
					onkeydown={handleKeyDown}
					bind:this={inputEl}
					bind:value={inputVal}
					disabled={isProcessing}
					spellcheck="false"
					autofocus
				></textarea>
				<div
					class="pointer-events-none absolute top-0 left-0 w-full min-w-0 text-left wrap-anywhere whitespace-pre-wrap"
				>
					{inputVal}<span class="animate-blink">█</span>
				</div>
			</div>
		</div>
	</button>
</Window>

<style>
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	.animate-blink {
		animation: blink 1.5s step-end infinite;
	}
</style>
