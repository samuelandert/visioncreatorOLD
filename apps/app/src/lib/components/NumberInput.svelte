<script lang="ts">
	import { onMount } from 'svelte';

	let inputElement;

	export let childInput;

	const { form, errors, field, constraints } = childInput;

	onMount(() => {
		inputElement.focus();
	});
	function increment(event) {
		event.preventDefault();
		form.update((values) => {
			values[field.name] = values[field.name] ? Number(values[field.name]) + 1 : 1;
			return values;
		});
	}

	function decrement(event) {
		event.preventDefault();
		form.update((values) => {
			values[field.name] = values[field.name] ? Number(values[field.name]) - 1 : 0;
			return values;
		});
	}
</script>

<div class="input-group input-group-divider grid grid-cols-[auto,1fr,auto]">
	<button type="button" class="variant-number text-white bg-secondary-400" on:click={decrement}
		>-</button
	>
	<input
		name={field.name}
		bind:this={inputElement}
		type="number"
		class="bg-white-custom w-full h-16 md:h-24 px-3 py-2 text-secondary-500 text-4xl md:text-6xl ring-white focus:outline-none focus:ring-2 focus:ring-primary-500 {$errors[
			field.name
		]
			? 'input-warning'
			: ''}"
		bind:value={$form[field.name]}
		aria-invalid={$errors[field.name] ? 'true' : undefined}
		{...constraints[field.name]}
	/>
	<button type="button" class="variant-number text-white bg-secondary-400" on:click={increment}
		>+</button
	>
</div>

<style>
	/* Hide the default arrows */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.variant-number {
		border: none;
		padding: 15px;
		font-size: 30px;
		cursor: pointer;
	}
	.bg-white-custom {
		background-color: #ffffff;
	}
</style>
