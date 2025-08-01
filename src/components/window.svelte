<script lang="ts">
	import { ControlFrom, controls, draggable, events } from "@neodrag/svelte";
	import { highestZIndex } from "../lib/shared-state.svelte";

	let { headerText, contentText, zIndex = 10 } = $props();
	let currentZIndex = $state(zIndex);

	const WIDTH = 400;
	const HEIGHT = (WIDTH * 3) / 4;
</script>

<div
	{@attach draggable([
		controls({ allow: ControlFrom.selector("#window-header") }),
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
	class={`relative flex aspect-4/3 h-[200px] flex-col border-2 border-t-0 border-black bg-white text-xs leading-none`}
>
	<span
		id="inset-border"
		class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-t-0 border-black"
	></span>

	<div id="window-header" class="sticky top-0 z-1 h-4 w-full bg-black text-white hover:cursor-grab">
		<p class="w-fit overflow-x-scroll whitespace-nowrap hover:cursor-text" contenteditable="true">
			{headerText ?? "About"}
		</p>
	</div>
	<div class="overflow-scroll px-[3px]" contenteditable="plaintext-only">
		<p>{contentText ?? "NO TEXT"}</p>
	</div>
</div>
