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
		<svg class="h-full w-full" viewBox="-50 -50 100 100">
			<circle class="fill-white stroke-black stroke-[0.75px]" r="45" />
			{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
				<line
					class="stroke-slate-700 stroke-[0.75px]"
					y1="40"
					y2="42"
					transform="rotate({30 * minute})"
				/>

				<!-- {#if minute % 15 === 0}
					<text
						x="0"
						y="0"
						text-anchor="middle"
						dominant-baseline="middle"
						transform="rotate({30 * minute}) translate(0, -36) rotate({-30 * minute})"
						class="text-[8px] leading-none font-bold">{minute === 0 ? 12 : minute / 5}</text
					>
				{:else}
					<circle class="fill-slate-700" transform="rotate({30 * minute}) translate(0, 35)" r="1" />
				{/if} -->
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
				class="stroke-black stroke-[1px]"
				y1="8"
				y2="-35"
				transform="rotate({6 * minutes + seconds / 10})"
			/>
			<circle class="fill-none stroke-black stroke-1" r="2" />
		</svg>
	</div>
</Window>
