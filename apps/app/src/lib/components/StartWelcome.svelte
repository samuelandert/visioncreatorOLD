<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let labels: {
		title: string;
		subtitle: string;
		description: string;
		buttonText: string;
	};

	const dispatch = createEventDispatcher();
</script>

<div class="w-32 @3xl:w-48 opacity-70">
	<img src="logo.png" alt="visioncreator" />
</div>
<h1 class="h1 text-xl @md:text-2xl @4xl:text-3xl @5xl:text-4xl @6xl:text-5xl @7xl:text-6xl">
	{labels.title}
</h1>
<div class="text-sm @md:text-lg @4xl:text-xl @5xl:text-2xl">
	{labels.subtitle}
</div>
<div class="text-lg @4xl:text-xl @5xl:text-2xl @6xl:text-3xl font-normal mb-4">
	{labels.description}
</div>
<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}>{labels.buttonText}</button
>
