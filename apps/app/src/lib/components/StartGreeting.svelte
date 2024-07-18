<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { futureMe } from '$lib/stores';
	import Icon from '@iconify/svelte';

	export let labels: {
		title: string;
		description: string;
		buttonText: string;
	};

	const dispatch = createEventDispatcher();
</script>

<h2
	class="h2 mb-2 text-4xl @md:text-5xl @4xl:text-6xl @5xl:text-7xl @6xl:text-8xl @7xl:text-9xl text-white"
>
	{labels.title.replace('{name}', $futureMe.name)}
</h2>
<p class="mb-4 text-sm @md:text-lg @4xl:text-xl @5xl:text-2xl">
	{labels.description}
</p>
<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}
>
	<span>{labels.buttonText}</span>
	<span><Icon icon="icon-park-solid:play" class="w-6 h-6 @3xl:w-7 @3xl:h-7" /></span>
</button>
