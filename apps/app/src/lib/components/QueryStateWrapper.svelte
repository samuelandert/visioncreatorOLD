<script lang="ts">
	import { onMount } from 'svelte';

	export let me;
	export let ChildComponent;

	let DynamicComponent;

	onMount(async () => {
		const components = import.meta.glob('/src/lib/components/*.svelte');
		DynamicComponent = (await components[`/src/lib/components/${ChildComponent}.svelte`]()).default;
	});

	$: query = $me.query;
</script>

{#if query && $query.isLoading}
	<div class="p-4 card variant-ghost-surface animate-pulse min-h-24">
		<p class="w-full h-20 placeholder" />
	</div>
{:else if query && $query.error}
	<div class="p-4 card variant-filled-error">
		<pre class="whitespace-pre-wrap">{JSON.stringify($query.error, null, 2)}</pre>
	</div>
{:else if DynamicComponent}
	<svelte:component this={DynamicComponent} {me} />
{:else}
	<div class="p-4 card variant-ghost-surface">
		<p>No data found.</p>
	</div>
{/if}
