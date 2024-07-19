<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher();

	let currentVCs = 377;
	let nextGoal = 610;
	let fundingPool = (currentVCs * 33).toLocaleString('de-DE');
	let spotsLeft = nextGoal - currentVCs;

	const steps = [
		{
			icon: 'mdi:video-wireless',
			title: '1. Build Your Lifes Brand',
			description: '1 min daily content:\n Contribute to startup challenges and inspire others'
		},
		{
			icon: 'mdi:trending-up',
			title: '2. Accelerate Personal Growth',
			description: '1 new habit monthly:\nSupercharge your skills, confidence, and character.'
		},
		{
			icon: 'mdi:cash-multiple',
			title: '3. Unlock Financial Freedom',
			description: '1 new income stream quarterly:\nDiversify earnings, build lasting wealth.'
		}
	];
</script>

<div class="flex flex-col h-full">
	<div class="flex-grow pb-2 overflow-y-auto lg:pb-8">
		<div class="p-3 mb-2 text-center bg-opacity-50 rounded-lg lg:p-10 bg-surface-800">
			<h1 class="mb-2 text-lg font-bold text-white sm:text-xl md:text-3xl lg:text-4xl">
				Our Mission: 1.3M Visionaries Funding €44M every quarter
			</h1>
			<p class="text-sm text-white md:text-lg lg:text-xl">
				Join us to transform society through collectively owned grand startup visions
			</p>
			<p class="mt-2 text-sm font-semibold text-warning-400 md:text-lg lg:text-xl">
				🚀 Next milestone: {nextGoal} VC's funding {fundingPool}€ in 100 days |
				<span class="text-error-400">Only {spotsLeft} spots left!</span>
			</p>
			<p class="mt-2 text-xs text-warning-300 md:text-sm lg:text-base">
				Act now! Join to participate in upcoming visions - don't miss out on future opportunities!
			</p>
		</div>

		<div class="p-2 mb-2 text-center bg-opacity-50 rounded-lg bg-surface-800 lg:p-5">
			<p class="text-sm font-bold text-white md:text-lg lg:text-xl">
				Your 3-Step Path from Discovering you Potential to Achieve True Freedom
			</p>
		</div>

		<div class="grid grid-cols-1 gap-2 mb-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
			{#each steps as step}
				<div
					class="p-2 transition-transform rounded-lg bg-surface-800 bg-opacity-70 hover:scale-105 lg:p-6"
				>
					<div class="flex justify-center mb-1 lg:mb-3">
						<Icon icon={step.icon} class="w-6 h-6 text-primary-500 lg:w-10 lg:h-10" />
					</div>
					<h2 class="mb-1 text-sm font-bold text-center text-white md:text-lg lg:text-xl">
						{step.title}
					</h2>
					<p class="text-xs text-center text-gray-300 whitespace-pre-line lg:text-base">
						{step.description}
					</p>
				</div>
			{/each}
		</div>

		<div class="p-2 mb-2 text-center bg-opacity-50 rounded-lg bg-surface-800 lg:p-6">
			<p class="text-xs text-white lg:text-base">
				Transform yourself and society with daily impact, monthly growth, and world-changing
				startups.
			</p>
			<p class="mt-1 text-xs font-bold text-primary-300 lg:text-base">
				Start now with just 1€ and 1 minute per day - be part of shaping our collective future!
			</p>
		</div>
	</div>

	<div class="flex flex-col justify-center px-2 pb-2 lg:px-8 lg:pb-8">
		<button
			type="button"
			class="text-sm btn bg-gradient-to-br variant-gradient-secondary-primary btn-lg md:text-lg lg:text-xl"
			on:click={() => dispatch('next')}
		>
			Join Now - Shape the Future of Society!
		</button>
		<p class="mt-2 text-xs text-center text-warning-400 md:text-sm">
			⏳ Be a pioneer: Early Visioncreators have the greatest return!
		</p>
	</div>
</div>
