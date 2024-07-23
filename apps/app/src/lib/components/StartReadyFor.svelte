<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher();

	let nextGoal = 610;
	let currentVCs = 248;
	let spotsLeft = nextGoal - currentVCs;
	let goalVCs = 377;
	let fundingPerVC = 30;
	let totalFunding = goalVCs * fundingPerVC;
	let currentFunding = currentVCs * fundingPerVC;
	let progress = (currentVCs / goalVCs) * 100;

	const steps = [
		{
			icon: 'mdi:rocket-launch',
			title: '1. Amplify Your Voice',
			description:
				'1 min daily: Create content, share your journey, grow your audience, inspire thousands'
		},
		{
			icon: 'mdi:brain',
			title: '2. Elevate Your Potential',
			description:
				'1 new habit monthly: Take on growth challenges, enhance your skills and become your best self'
		},
		{
			icon: 'mdi:currency-usd',
			title: '3. Master Financial Freedom',
			description:
				'1 new income stream quarterly: Earn revenue shares from our visions and live life on your terms'
		}
	];
</script>

<div class="fixed top-0 w-full p-4 overflow-hidden text-center bg-opacity-50 bg-surface-800">
	<div
		class="absolute top-0 left-0 h-full transition-all duration-1000 ease-out bg-success-500 bg-opacity-30"
		style="width: {progress}%"
	/>
	<div class="relative z-10 max-w-6xl mx-auto">
		<div class="flex justify-between text-gray-300 text-md">
			<span>€{currentFunding.toLocaleString()}</span>
			<span>€{totalFunding.toLocaleString()}</span>
		</div>
		<h2 class="text-xl font-bold text-white">Next Milestone</h2>

		<div class="flex items-center justify-between">
			<span class="text-gray-300 text-md">0</span>
			<span class="text-lg font-bold text-primary-500">{currentVCs} VCs</span>
			<span class="text-gray-300 text-md">{goalVCs}</span>
		</div>
	</div>
</div>
<div class="flex flex-col h-full">
	<div class="flex-grow pb-2 overflow-y-auto lg:pb-8">
		<div class="max-w-6xl px-4 mx-auto">
			<div class="p-4 mb-4 text-center bg-opacity-50 rounded-lg lg:p-6 bg-surface-800">
				<h1
					class="mb-2 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
				>
					Transform Your Life and Society
				</h1>
				<p class="text-sm text-white md:text-base lg:text-lg xl:text-xl">
					Join our movement where 1.3M visionaries collectively launch society-shaping startups with
					€44M every quarter. <br />
				</p>
			</div>

			<!-- One Minute and 1 Euro a Day -->
			<div class="p-6 mb-8 text-center bg-opacity-50 rounded-lg bg-surface-800">
				<p class="mb-4 text-xl text-white">
					Gain true freedom - for less than the cost of a coffee or beer a day
				</p>
				<div class="flex items-center justify-center mb-4 space-x-4">
					<div class="text-4xl font-bold text-secondary-300">just 1€</div>
					<div class="text-4xl font-bold text-secondary-300">+</div>
					<div class="text-4xl font-bold text-secondary-300">1 min a day</div>
				</div>
			</div>

			<div class="flex flex-col gap-2 mb-2 lg:grid lg:grid-cols-3 lg:gap-6">
				{#each steps as step}
					<div
						class="flex items-center p-2 transition-transform bg-opacity-50 rounded-lg bg-surface-800 hover:scale-105 lg:flex-col lg:p-6"
					>
						<div class="flex justify-center mr-3 lg:mr-0 lg:mb-4">
							<Icon
								icon={step.icon}
								class="w-6 h-6 text-primary-500 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
							/>
						</div>
						<div class="flex-1 lg:text-center">
							<h2 class="text-xs font-bold text-tertiary-300 md:text-sm lg:text-xl xl:text-2xl">
								{step.title}
							</h2>
							<p class="text-xs text-gray-300 lg:text-base xl:text-lg">
								{step.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="max-w-6xl px-4 mx-auto">
		<div class="flex flex-col justify-center">
			<p
				class="p-3 mb-4 text-sm font-bold text-center rounded-2xl bg-opacity-30 text-warning-200 bg-warning-300 md:text-base lg:text-lg xl:text-xl"
			>
				✨ Last chance to earn revenue shares from the first upcoming vision! Only <span
					class="text-primary-500"
					>{spotsLeft}
				</span>spots left!
			</p>

			<button
				type="button"
				class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
				on:click={() => dispatch('next')}
			>
				Secure Your Spot Now
			</button>
		</div>
	</div>
</div>
