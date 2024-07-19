<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { futureMe } from '$lib/stores';

	export let labels: {
		placeholder: string;
		buttonText: string;
		persuasiveText: string;
	};

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col items-center w-full max-w-xl gap-6 mx-auto">
	<p class="text-lg @md:text-xl @2xl:text-2xl text-center text-tertiary-300 mb-4">
		{labels.persuasiveText}
	</p>

	<input
		bind:value={$futureMe.name}
		placeholder={labels.placeholder}
		style="background: rgba(255, 255, 255, 0.2); padding: 0.5rem 1rem; font-size: 1.6rem; color: white; border: 1px solid white; border-radius: 2rem; outline: none; width: 100%;"
	/>

	<button
		type="button"
		class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
		on:click={() => dispatch('next')}>{labels.buttonText}</button
	>
</div>

<style>
	input::placeholder {
		color: #d1d5db;
	}
</style>
