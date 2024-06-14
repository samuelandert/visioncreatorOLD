<script lang="ts">
	import { createQuery } from '$lib/wundergraph';

	const countriesQuery = createQuery({
		operationName: 'Countries',
		input: {
			filter: { code: { eq: 'DE' } }
		}
	});
</script>

<div class="results">
	{#if $countriesQuery.isLoading}
		<p>Loading...</p>
	{:else if $countriesQuery.error}
		<pre>Error: {JSON.stringify($countriesQuery.error, null, 2)}</pre>
	{:else}
		<pre>{JSON.stringify($countriesQuery.data, null, 2)}</pre>
	{/if}
</div>
