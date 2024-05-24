<script lang="ts">
	import { onMount } from 'svelte';

	let inputElement;

	export let childInput;

	const { form, errors, field, constraints } = childInput;

	onMount(() => {
		inputElement.focus();
	});
</script>

<textarea
	name={field.name}
	bind:this={inputElement}
	class="w-full px-3 py-2 text-3xl bg-transparent border-gray-100 rounded-md textarea border-1 ring-0 ring-white focus:outline-none focus:ring-2 focus:ring-blue-500 {$errors[
		field.name
	]
		? 'input-warning'
		: ''}"
	bind:value={$form[field.name]}
	aria-invalid={$errors[field.name] ? 'true' : undefined}
	{...constraints[field.name]}
/>
