<script lang="ts">
	import { onMount } from 'svelte';

	let inputElement;

	export let childInput;

	const { form, errors, field, constraints } = childInput;

	onMount(() => {
		inputElement.focus();
	});
</script>

<select
	name={field.name}
	bind:this={inputElement}
	class="text-3xl select"
	size="5"
	bind:value={$form[field.name]}
	aria-invalid={$errors[field.name] ? 'true' : undefined}
	{...constraints[field.name]}
>
	{#each field.options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
