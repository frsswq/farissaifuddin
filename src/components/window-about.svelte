<script lang="ts">
	import { onMount } from "svelte";
	import Window from "./window.svelte";

	let isLoading = $state(true);
	let isProcessing = $state(false);

	let inputEl = $state<HTMLInputElement | null>();
	let inputVal = $state("");
	let inputWidth = $derived(inputEl?.scrollWidth || 1);

	let terminalLines = $state(["frsswq% cat ~/about/*"]);
	let posX, posY;

	onMount(() => {
		isLoading = false;
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const input = inputVal.trim();
		}
	};
</script>

{#if !isLoading}
	<Window posX={100} posY={100}>
		<div class="mx-[3px] mt-0.75 flex select-text">
			<div class="flex items-start">
				<span>frsswq%&nbsp;</span>
				<div class="relative flex items-start">
					<input
						bind:this={inputEl}
						bind:value={inputVal}
						onkeydown={handleKeyDown}
						class="w-auto min-w-[1ch] border-none bg-transparent caret-transparent outline-none"
					/>
					<span
						class="pointer-events-none absolute top-0 left-0 animate-pulse text-black"
						style="transform: translateX({inputVal.length}ch);">█</span
					>
				</div>
			</div>
		</div>
	</Window>
{/if}
