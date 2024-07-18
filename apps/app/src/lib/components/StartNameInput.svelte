<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { futureMe } from '$lib/stores';

	export let labels: {
		placeholder: string;
		buttonText: string;
	};

	const dispatch = createEventDispatcher();
</script>

<input
	bind:value={$futureMe.name}
	placeholder={labels.placeholder}
	style="background: rgba(255, 255, 255, 0.2); padding: 0.5rem 1rem; font-size: 1.6rem; color: white; border: 1px solid white; border-radius: 2rem; outline: none;"
/>
<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}>{labels.buttonText}</button
>

<style>
	input::placeholder {
		color: #d1d5db;
	}
</style>
