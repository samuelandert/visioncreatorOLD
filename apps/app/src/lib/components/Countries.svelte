<script lang="ts">
	export let me;
	const query = $me.query;
</script>

<main class="overflow-auto">
	<h1 class="mb-4 text-4xl font-bold">Countries</h1>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#if $query.isLoading}
			<p class="text-lg text-gray-500">Loading...</p>
		{:else if $query.error}
			<pre class="text-red-500">Error: {JSON.stringify($query.error, null, 2)}</pre>
		{:else if $query.data && $query.data.grid && Array.isArray($query.data.grid)}
			{#each $query.data.grid as item (item.code)}
				<div class="m-4 overflow-hidden text-white rounded shadow-lg bg-secondary-700">
					<div class="px-6 py-4">
						<div class="mb-2 text-xl font-bold text-primary-500">
							{item.name} ({item.code})
						</div>
						<p class="text-lg font-bold text-gray-300">
							{item.capital || 'N/A'}
						</p>
						<p class="text-base text-gray-300">
							Currency: {#each item.currencies as currency}{currency}{/each}
						</p>
						<p class="text-base text-gray-300">
							Phone Code: {item.phone}
						</p>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-lg text-gray-500">No countries found.</p>
		{/if}
	</div>
</main>
