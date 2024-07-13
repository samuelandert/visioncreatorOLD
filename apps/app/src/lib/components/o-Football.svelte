<script lang="ts">
	import { onMount } from 'svelte';

	let players: { x: number; y: number; color: string; isGoalkeeper: boolean }[] = [];

	function randomPosition(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	onMount(() => {
		// Team 1 (Red)
		players.push({ x: 5, y: 50, color: '#ff0000', isGoalkeeper: true }); // Goalkeeper
		for (let i = 0; i < 3; i++) {
			players.push({
				x: randomPosition(5, 45),
				y: randomPosition(5, 95),
				color: '#ff0000',
				isGoalkeeper: false
			});
		}

		// Team 2 (Blue)
		players.push({ x: 95, y: 50, color: '#0000ff', isGoalkeeper: true }); // Goalkeeper
		for (let i = 0; i < 3; i++) {
			players.push({
				x: randomPosition(55, 95),
				y: randomPosition(5, 95),
				color: '#0000ff',
				isGoalkeeper: false
			});
		}
	});
</script>

<div class="flex items-center justify-center w-full h-screen bg-navy-900">
	<div class="w-4/5 aspect-[16/9] bg-green-600 relative border-4 border-white">
		<!-- Field elements (as before) -->
		<div class="absolute top-0 bottom-0 w-0 border-l-2 border-white left-1/2" />
		<div
			class="absolute w-1/4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full top-1/2 left-1/2 h-1/4"
		/>
		<div class="absolute top-[16.5%] h-[67%] w-[16.5%] left-0 border-2 border-white" />
		<div class="absolute top-[16.5%] h-[67%] w-[16.5%] right-0 border-2 border-white" />
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
		/>
		<div class="absolute top-[35%] h-[30%] w-[5.5%] left-0 border-2 border-white" />
		<div class="absolute top-[35%] h-[30%] w-[5.5%] right-0 border-2 border-white" />

		<!-- Players -->
		{#each players as player}
			<div
				class="absolute rounded-full"
				style="left: {player.x}%; top: {player.y}%; background-color: {player.color}; width: {player.isGoalkeeper
					? '16px'
					: '12px'}; height: {player.isGoalkeeper ? '16px' : '12px'};"
			/>
		{/each}
	</div>
</div>

<style>
	/* Corner arcs style (as before) */
	.bg-green-600::before,
	.bg-green-600::after {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		border: 2px solid white;
		border-radius: 0 0 20px 0;
	}

	.bg-green-600::before {
		top: -2px;
		left: -2px;
		transform: rotate(90deg);
	}

	.bg-green-600::after {
		bottom: -2px;
		right: -2px;
		transform: rotate(-90deg);
	}
</style>
