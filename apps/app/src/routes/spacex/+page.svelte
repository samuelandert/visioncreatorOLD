<script lang="ts">
	import { createQuery } from '$lib/wundergraph';

	const spacexQuery = createQuery({
		operationName: 'SpaceX'
		// input: {
		// 	filter: { code: { eq: 'DE' } }
		// }
	});
</script>

<div class="results">
	{#if $spacexQuery.isLoading}
		<p>Loading...</p>
	{:else if $spacexQuery.error}
		<pre>Error: {JSON.stringify($spacexQuery.error, null, 2)}</pre>
	{:else}
		<pre>{JSON.stringify($spacexQuery.data, null, 2)}</pre>
	{/if}
</div>
