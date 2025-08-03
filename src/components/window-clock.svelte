<script lang="ts">
	import { onMount } from "svelte";
	import Window from "./window.svelte";

	let time = $state(new Date());

	let hours = $derived(time.getHours());
	let minutes = $derived(time.getMinutes());
	let seconds = $derived(time.getSeconds());

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<Window headerText="Clock" posX={20} posY={20} sizeX={150} sizeY={165}>
	<div class="flex items-center justify-center">
		<svg viewBox="-50 -50 100 100">
			<circle class="fill-white stroke-black stroke-[0.75px]" r="45" />
			{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
				{#if minute % 15 === 0}
					<text
						x="0"
						y="0"
						text-anchor="middle"
						dominant-baseline="middle"
						transform="rotate({30 * minute}) translate(0, -35) rotate({-30 * minute})"
						class="text-[10px] leading-none font-bold">{minute === 0 ? 12 : minute / 5}</text
					>
				{:else}
					<line
						class="stroke-slate-700 stroke-[0.75px]"
						y1="34"
						y2="36"
						transform="rotate({30 * minute})"
					/>
					<!-- <circle class="fill-slate-700" transform="rotate({30 * minute}) translate(0, 35)" r="1" /> -->
				{/if}
			{/each}
		</svg>
	</div>
</Window>
