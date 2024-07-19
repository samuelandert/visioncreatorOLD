<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let callToActionPrefix: string;
	export let callToActionSuffix: string;
	export let callToActionOptions: string[];
	export let buttonText: string;

	const dispatch = createEventDispatcher();

	let currentCallToActionIndex = 0;
	let currentCallToAction = highlightImportantWords(callToActionOptions[0]);

	function highlightImportantWords(sentence: string) {
		const words = sentence.split(' ');
		const importantWords = [
			['prosperity', 'family'],
			['passionful', 'life'],
			['multiple', 'income'],
			['society-shaping', 'startups'],
			['master', 'craft'],
			['lifes', 'abundance']
		];

		const highlightedWords = importantWords[currentCallToActionIndex];
		return words
			.map((word) =>
				highlightedWords.includes(word.toLowerCase())
					? `<span class="text-primary-500">${word}</span>`
					: `<span class="text-tertiary-300">${word}</span>`
			)
			.join(' ');
	}

	onMount(() => {
		const interval = setInterval(() => {
			currentCallToActionIndex = (currentCallToActionIndex + 1) % callToActionOptions.length;
			currentCallToAction = highlightImportantWords(callToActionOptions[currentCallToActionIndex]);
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<div class="w-20 @3xl:w-32 opacity-70 mt-12">
	<img src="logo.png" alt="visioncreator" />
</div>

<h1
	class="h1 text-3xl @md:text-2xl @4xl:text-3xl @5xl:text-4xl @6xl:text-5xl @7xl:text-6xl tracking-wide text-center mb-6"
>
	{callToActionPrefix}
</h1>
<div class="p-4 mb-6 bg-opacity-25 bg-surface-800 rounded-xl">
	<p class="text-xl @md:text-3xl @4xl:text-4xl @5xl:text-5xl text-center font-bold">
		{@html currentCallToAction}
	</p>
</div>

<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}
>
	{buttonText}
</button>
