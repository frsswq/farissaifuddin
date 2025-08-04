<script lang="ts">
	import { ControlFrom, controls, draggable, events, position } from "@neodrag/svelte";
	import { onMount } from "svelte";
	import { innerHeight, innerWidth } from "svelte/reactivity/window";
	import CloseIcon from "../assets/icons/pixelarticons:close.svelte";

	import { MediaQuery } from "svelte/reactivity";
	import { highestZIndex } from "../lib/shared-state.svelte";
	import { cn } from "../lib/utils";

	const isMobile = new MediaQuery("max-width: 640px");

	let {
		headerText = "",
		contentText = "",
		children = undefined,
		posX = 0,
		posY = 0,
		sizeX = 0,
		sizeY = 0
	} = $props();
	let currentZIndex = $state(10);

	let showWindow: boolean = $state(true);
	let isLoading = $state(true);

	let windowElement = $state<HTMLDivElement | null>(null);
	let windowPosition = $state({ x: posX, y: posY });

	onMount(() => {
		if (windowElement && innerWidth.current && innerHeight.current && (posX === 0 || posY === 0)) {
			const rect = windowElement.getBoundingClientRect();
			windowPosition = {
				x: Math.max(0, (innerWidth.current - rect.width) / 2),
				y: Math.max(0, (innerHeight.current - rect.height) / 2)
			};
		}

		isLoading = false;
	});
</script>

{#if showWindow && !isLoading}
	<div
		bind:this={windowElement}
		{@attach draggable([
			controls({
				allow: ControlFrom.selector(isMobile.current || children ? "#window" : "#window-header")
			}),
			events({
				onDragStart: () => {
					currentZIndex = ++highestZIndex.index;
				}
			}),
			position({ default: windowPosition })
		])}
		id="window"
		style={`z-index: ${currentZIndex}; width: ${sizeX !== 0 ? sizeX : 200}px; height: ${sizeY !== 0 ? sizeY : 150}px`}
		class={cn(
			`absolute border-2 border-black bg-white text-sm leading-none`,
			isMobile.current ? "select-none" : ""
		)}
	>
		<div class="relative flex h-full flex-col hover:cursor-grab sm:hover:cursor-default">
			<span
				id="inset-border"
				class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-black"
			></span>

			<div
				id="window-header"
				class="	sticky top-0 z-1 flex h-4 w-full justify-between bg-black text-white select-none sm:hover:cursor-grab"
			>
				<p class="absolute -top-0.5 w-fit whitespace-nowrap">
					{headerText !== "" ? headerText : "Untitled 1.0"}
				</p>
				<button
					class="absolute -top-0.5 -right-0.5 inline-flex size-4.5 hover:cursor-pointer"
					onclick={() => (showWindow = false)}
				>
					<CloseIcon className="size-4.5 shrink absolute -top-0.5 -right-0.5" />
				</button>
			</div>
			{#if children}
				{@render children()}
			{:else}
				<div
					class={"mx-[3px] flex-1 overflow-auto focus:outline-none sm:hover:cursor-text"}
					contenteditable={isMobile.current ? "false" : "plaintext-only"}
				>
					<textarea class="h-full w-full resize-none">{contentText}</textarea>
				</div>
			{/if}
		</div>
	</div>
{/if}
