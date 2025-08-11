<script lang="ts">
	import { draggable, events, position } from "@neodrag/svelte";
	import { onMount } from "svelte";
	import CloseIcon from "../assets/icons/pixelarticons:close.svelte";

	import { MediaQuery } from "svelte/reactivity";
	import { highestZIndex } from "../lib/shared-state.svelte";
	import { cn } from "../lib/utils";

	const isMobile = new MediaQuery("max-width: 640px");

	let {
		headerText = "",
		headerClass = "",
		children = undefined,
		posX,
		posY,
		sizeX,
		sizeY
	} = $props();
	let currentZIndex = $state(10);

	let showWindow: boolean = $state(true);
	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

{#if showWindow}
	<div
		{@attach draggable([
			events({
				onDragStart: () => {
					currentZIndex = ++highestZIndex.index;
				}
			}),
			position({ default: { x: posX, y: posY } })
		])}
		style={`z-index: ${currentZIndex}; width: ${sizeX}px; height: ${sizeY}px`}
		class={cn(
			!isMounted && "hidden",
			` absolute border-2 border-black bg-white text-sm`,
			headerClass
		)}
	>
		<div class="relative flex h-full flex-col text-sm leading-none">
			<span
				class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-black"
			></span>

			<div class="sticky top-0 flex h-4 w-full cursor-grab justify-between bg-black text-white">
				<p class="absolute -top-0.5 w-fit leading-none whitespace-nowrap select-none">
					{headerText}
				</p>
				<button
					aria-label="close-window"
					class="absolute -top-0.5 -right-0.5 inline-flex size-4.5 hover:cursor-pointer"
					onclick={() => (showWindow = false)}
				>
					<CloseIcon className="size-4.5 shrink absolute -top-0.5 -right-0.5" />
				</button>
			</div>
			{@render children()}
		</div>
	</div>
{/if}
