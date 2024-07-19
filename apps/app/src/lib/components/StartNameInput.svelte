<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { futureMe } from '$lib/stores';

	export let labels: {
		placeholder: string;
		buttonText: string;
		persuasiveText: string;
		callToActionPrefix: string;
		callToActionOptions: string[];
	};

	let currentOptionIndex = 0;
	let currentOption = '';

	const dispatch = createEventDispatcher();

	function rotateOption() {
		currentOptionIndex = (currentOptionIndex + 1) % labels.callToActionOptions.length;
		currentOption = labels.callToActionOptions[currentOptionIndex];
	}

	onMount(() => {
		currentOption = labels.callToActionOptions[0];
		setInterval(rotateOption, 3000); // Change option every 3 seconds
	});
</script>

<div class="flex flex-col items-center w-full max-w-4xl gap-4 mx-auto">
	<h2 class="text-2xl @md:text-3xl @2xl:text-4xl text-center text-tertiary-100 font-light">
		{labels.callToActionPrefix}
	</h2>
	<div
		class="w-full min-h-[5rem] @md:min-h-[6rem] @2xl:min-h-[7rem] flex items-center justify-center px-4"
	>
		<p class="font-bold text-center text-primary-300 callout-text">
			{currentOption}
		</p>
	</div>

	<p class="text-lg @md:text-xl text-center text-tertiary-200 mb-8 w-full">
		{labels.persuasiveText}
	</p>

	<div class="w-full max-w-6xl">
		<input
			bind:value={$futureMe.name}
			placeholder={labels.placeholder}
			class="w-full px-4 py-3 @md:px-6 @md:py-4 text-lg @md:text-2xl text-white transition-all duration-300 ease-in-out bg-white border-2 rounded-full outline-none bg-opacity-20 border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
		/>
	</div>

	<button
		type="button"
		class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg mt-4"
		on:click={() => dispatch('next')}
	>
		{labels.buttonText}
	</button>
</div>

<style>
	input::placeholder {
		color: #d1d5db;
	}

	.callout-text {
		font-size: clamp(1.5rem, 4vw, 3rem);
		line-height: 1.2;
		max-width: 100%;
		word-wrap: break-word;
	}

	input:focus {
		outline: none;
		box-shadow: 0 0 0 1px theme('colors.primary.500');
	}
</style>
