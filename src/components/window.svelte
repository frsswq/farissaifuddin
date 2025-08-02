<script lang="ts">
	import { ControlFrom, controls, draggable, events } from "@neodrag/svelte";
	import { MediaQuery } from "svelte/reactivity";
	import CloseIcon from "../assets/icons/pixelarticons:close.svelte";

	import { highestZIndex } from "../lib/shared-state.svelte";
	import { cn } from "../lib/utils";

	const mobile = new MediaQuery("max-width: 768px");

	let { headerText, contentText } = $props();
	let currentZIndex = $state(10);
	let showWindow: boolean = $state(true);
</script>

{#if showWindow}
	<div
		{@attach draggable([
			controls({ allow: ControlFrom.selector(mobile.current ? "#window" : "#window-header") }),
			events({
				onDragStart: () => {
					if (currentZIndex <= highestZIndex.index) {
						currentZIndex += highestZIndex.index + 1;
						highestZIndex.index += currentZIndex;
					}
				}
			})
		])}
		id="window"
		style={`z-index: ${currentZIndex}`}
		class={cn(
			`absolute aspect-4/3 h-[200px] border-2 border-black bg-white text-sm leading-none`,
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
				<p class="w-fit whitespace-nowrap">
					{headerText ?? "Untitled 1.0"}
				</p>
				<button
					class="flex h-full items-start hover:cursor-pointer"
					onclick={() => (showWindow = false)}
				>
					<CloseIcon className="size-4" />
				</button>
			</div>
			<div
				class="mx-[3px] flex-1 overflow-auto focus:outline-none md:hover:cursor-text"
				contenteditable={mobile.current ? "false" : "plaintext-only"}
			>
				<p>{contentText ?? "NO TEXT"}</p>
			</div>
		</div>
	</div>
{/if}
