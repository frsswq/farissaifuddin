<script lang="ts">
	import { draggable, events } from "@neodrag/svelte";
	import { highestZIndex } from "../lib/shared-state.svelte";

	let { headerText, contentText } = $props();
	let currentZIndex = $state(10);
</script>

<div
	{@attach draggable([
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
	class={`relative flex aspect-4/3 h-[200px] flex-col border-2 border-t-0 border-black bg-white text-xs leading-none outline-2 outline-offset-[-2px] outline-black`}
>
	<span
		id="inset-border"
		class="pointer-events-none absolute top-[0.5px] right-[0.5px] bottom-[0.5px] left-[0.5px] border-2 border-t-0 border-black"
	></span>

	<div id="header" class="sticky top-0 z-1 h-4 w-full bg-black text-white">
		<p class="w-fit overflow-x-scroll whitespace-nowrap" contenteditable="true">
			{headerText ?? "About"}
		</p>
	</div>
	<div class="overflow-scroll px-[3px]" contenteditable="plaintext-only">
		<p>{contentText ?? "NO TEXT"}</p>
	</div>
</div>
