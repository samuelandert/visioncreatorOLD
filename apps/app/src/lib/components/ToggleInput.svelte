<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let childInput;

	const { form, field, constraints } = childInput;
</script>

<SlideToggle name={field.name} bind:checked={$form[field.name]} {...constraints[field.name]} />
