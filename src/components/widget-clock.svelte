<script lang="ts">
	import { draggable, events, position } from "@neodrag/svelte";
	import { onMount } from "svelte";
	import { highestZIndex } from "../lib/shared-state.svelte";

	let time = $state(new Date());
	let currentZIndex = $state(10);
	let isLoading = $state(true);

	let hours = $derived(time.getHours());
	let minutes = $derived(time.getMinutes());
	let seconds = $derived(time.getSeconds());

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		isLoading = false;

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if !isLoading}
	<div
		{@attach draggable([
			events({
				onDragStart: () => {
					currentZIndex = ++highestZIndex.index;
				}
			}),
			position({ default: { x: 15, y: 15 } })
		])}
		class="absolute size-20 items-center justify-center bg-black hover:cursor-grab"
		style="z-index: {currentZIndex};"
	>
		<svg class="h-full w-full" viewBox="-50 -50 100 100">
			<circle class="fill-white stroke-black stroke-[1.5px]" r="45" />
			{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
				<line
					class="stroke-slate-700 stroke-[0.75px]"
					y1="40"
					y2="42"
					transform="rotate({30 * minute})"
				/>

				{#each [1, 2, 3, 4] as offset}
					<line
						class="stroke-slate-700 stroke-[0.5px]"
						y1="40.5"
						y2="41.5"
						transform="rotate({6 * (minute + offset)})"
					/>
				{/each}
			{/each}

			<line
				class="stroke-black stroke-[1px]"
				y1="4"
				y2="-20"
				transform="rotate({30 * hours + minutes / 2})"
			/>
			<line
				class="stroke-slate-700 stroke-[1px]"
				y1="8"
				y2="-30"
				transform="rotate({6 * minutes + seconds / 10})"
			/>
			<line
				class="stroke-slate-500 stroke-[0.75px]"
				y1="10"
				y2="-35"
				transform="rotate({6 * seconds})"
			/>
			<circle class="fill-none stroke-slate-500 stroke-1" r="2" />
		</svg>
	</div>
{/if}
