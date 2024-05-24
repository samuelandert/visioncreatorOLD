<script lang="ts">
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	let inputElement;
	let selectedOption = null;

	export let childInput;

	const { form, errors, field, constraints } = childInput;

	$: selectedOption = $form[field.name];

	function selectOption(option) {
		selectedOption = option;
		$form[field.name] = option;
	}

	onMount(() => {
		inputElement.focus();
	});
</script>

<div
	class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 overflow-y-auto max-h-72 lg:max-h-128"
>
	{#each field.options as option (option.value)}
		<div
			class:selected={selectedOption === option.value}
			on:click={() => selectOption(option.value)}
		>
			<Card
				name={option.label}
				description={option.description}
				image={option.image}
				selected={selectedOption === option.value}
				squareImage={option.squareImage}
			/>
		</div>
	{/each}
</div>

<select
	name={field.name}
	bind:this={inputElement}
	style="display: none;"
	bind:value={$form[field.name]}
	aria-invalid={$errors[field.name] ? 'true' : undefined}
	{...constraints[field.name]}
>
	{#each field.options as option (option.value)}
		<option value={option.value} />
	{/each}
</select>
