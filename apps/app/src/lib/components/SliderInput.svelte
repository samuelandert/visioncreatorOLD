<script lang="ts">
	import { writable } from 'svelte/store';
	import { RangeSlider } from '@skeletonlabs/skeleton';

	export let childInput;

	const { form, field, constraints } = childInput;

	const state = writable(0);
</script>

<RangeSlider
	name={field.name}
	bind:value={$form[field.name]}
	min={0}
	max={100}
	step={1}
	ticked
	{...constraints[field.name]}
>
	<div class="flex items-center justify-between">
		<div class="text-xs">{$form[field.name]} / 100</div>
	</div>
</RangeSlider>
