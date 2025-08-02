<script lang="ts">
	import { ControlFrom, controls, draggable, events, position } from "@neodrag/svelte";
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import { innerHeight, innerWidth } from "svelte/reactivity/window";
	import CloseIcon from "../assets/icons/pixelarticons:close.svelte";

	import { highestZIndex } from "../lib/shared-state.svelte";
	import { cn } from "../lib/utils";

	const mobile = new MediaQuery("max-width: 768px");

	let { headerText = "", contentText = "" } = $props();
	let currentZIndex = $state(10);

	let showWindow: boolean = $state(true);

	let windowElement = $state<HTMLDivElement | null>(null);
	let windowPosition = $state({ x: 0, y: 0 });

	onMount(() => {
		if (windowElement && innerWidth.current && innerHeight.current) {
			const rect = windowElement.getBoundingClientRect();
			windowPosition = {
				x: Math.max(0, (innerWidth.current - rect.width) / 2),
				y: Math.max(0, (innerHeight.current - rect.height) / 2)
			};
		}
	});
</script>

{#if showWindow}
	<div
		bind:this={windowElement}
		{@attach draggable([
			controls({ allow: ControlFrom.selector(mobile.current ? "#window" : "#window-header") }),
			events({
				onDragStart: () => {
					currentZIndex = ++highestZIndex.index;
				}
			}),
			position({ default: windowPosition })
		])}
		id="window"
		style={`z-index: ${currentZIndex}`}
		class={cn(
			`absolute aspect-4/3 h-[200px] border-2 border-black bg-white text-[15px] leading-none`,
			mobile.current ? "select-none" : ""
		)}
	>
		<div class="relative flex h-full flex-col hover:cursor-grab md:hover:cursor-default">
			<span
				id="inset-border"
				class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-black"
			></span>

			<div
				id="window-header"
				class="	sticky top-0 z-1 flex h-[18px] w-full justify-between bg-black text-white select-none md:hover:cursor-grab"
			>
				<p class="absolute -top-0.5 w-fit whitespace-nowrap">
					{headerText !== "" ? headerText : "Untitled 1.0"}
				</p>
				<button
					class="absolute -top-1 -right-1 inline-flex hover:cursor-pointer"
					onclick={() => (showWindow = false)}
				>
					<CloseIcon className="size-4.75 block" />
				</button>
			</div>
			<div
				class="mx-[3px] flex-1 overflow-auto focus:outline-none md:hover:cursor-text"
				contenteditable={mobile.current ? "false" : "plaintext-only"}
			>
				<p>{contentText !== "" ? contentText : "NO TEXT"}</p>
			</div>
		</div>
	</div>
{/if}
