<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let heading: string;
	export let description: string;
	export let targetAudiences: string[];
	export let subline: string;
	export let buttonText: string;

	const dispatch = createEventDispatcher();

	let targetAudience = targetAudiences[0];

	onMount(() => {
		let currentIndex = 0;
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % targetAudiences.length;
			targetAudience = targetAudiences[currentIndex];
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="w-20 @3xl:w-32 opacity-70 mt-12">
	<img src="logo.png" alt="visioncreator" />
</div>
<h1
	class="h1 text-3xl @md:text-2xl @4xl:text-3xl @5xl:text-4xl @6xl:text-5xl @7xl:text-6xl tracking-wide text-center"
>
	{heading} <span class="font-bold text-primary-500">{targetAudience}</span>
</h1>
<p class="text-xl @md:text-3xl @4xl:text-4xl @5xl:text-5xl mb-6 text-center">
	{description}
</p>
<p class="text-md @md:text-lg @4xl:text-xl mb-8 text-center text-tertiary-300">
	{subline}
</p>

<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}
>
	{buttonText}
</button>
