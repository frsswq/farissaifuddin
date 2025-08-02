<script lang="ts">
	import { bounds, BoundsFrom, ControlFrom, controls, draggable, events } from "@neodrag/svelte";
	import { highestZIndex } from "../lib/shared-state.svelte";

	let { headerText, contentText } = $props();
	let currentZIndex = $state(10);
</script>

<div
	{@attach draggable([
		controls({ allow: ControlFrom.selector("#window-header") }),
		bounds(BoundsFrom.viewport()),
		events({
			onDragStart: () => {
				if (currentZIndex <= highestZIndex.index) {
					currentZIndex += highestZIndex.index + 1;
					highestZIndex.index += currentZIndex;
				}
			}
		})
	])}
	style={`z-index: ${currentZIndex}`}
	class={`absolute aspect-4/3 h-[200px] border-2 border-black bg-white text-xs leading-none md:text-sm`}
>
	<div class="relative flex h-full flex-col">
		<span
			id="inset-border"
			class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-black"
		></span>

		<div
			id="window-header"
			class="	sticky top-0 z-1 h-4 w-full bg-black text-white hover:cursor-grab md:h-[18px]"
		>
			<p
				class="w-fit overflow-hidden whitespace-nowrap hover:cursor-text"
				contenteditable="plaintext-only"
			>
				{headerText ?? "Untitled 1.0"}
			</p>
		</div>
		<div class="mx-[3px] flex-1 overflow-auto focus:outline-none" contenteditable="plaintext-only">
			<p>{contentText ?? "NO TEXT"}</p>
		</div>
	</div>
</div>
