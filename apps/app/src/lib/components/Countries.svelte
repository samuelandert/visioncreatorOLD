<script lang="ts">
	export let me;
	const query = $me.query;
</script>

<main class="overflow-auto @container">
	<h1 class="mb-3 text-2xl font-bold @4xl:text-3xl @9xl:text-4xl @9xl:mb-4">Countries</h1>

	<div class="grid grid-cols-1 gap-2 @4xl:grid-cols-2 @4xl:gap-3 @9xl:grid-cols-3 @9xl:gap-4">
		{#if $query.isLoading}
			<p class="text-base text-gray-500 @4xl:text-lg">Loading...</p>
		{:else if $query.error}
			<pre class="text-sm text-red-500 @4xl:text-base">Error: {JSON.stringify(
					$query.error,
					null,
					2
				)}</pre>
		{:else if $query.data && $query.data.grid && Array.isArray($query.data.grid)}
			{#each $query.data.grid as item (item.identifier)}
				<div
					class="m-2 overflow-hidden text-white rounded shadow-lg bg-secondary-700 @4xl:m-3 @9xl:m-4"
				>
					<div class="px-3 py-2 @4xl:px-4 @4xl:py-3 @9xl:px-6 @9xl:py-4">
						<div
							class="mb-1 text-base font-bold text-primary-500 @4xl:text-lg @4xl:mb-2 @9xl:text-xl"
						>
							{item.primaryText} ({item.identifier})
						</div>
						<p class="text-sm font-bold text-gray-300 @4xl:text-base @9xl:text-lg">
							{item.secondaryText || 'N/A'}
						</p>
						<p class="text-xs text-gray-300 @4xl:text-sm @9xl:text-base">
							{item.tertiaryText}: {#each item.arrayField as value}{value}{/each}
						</p>
						<p class="text-xs text-gray-300 @4xl:text-sm @9xl:text-base">
							{item.quaternaryText}: {item.numericValue}
						</p>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-base text-gray-500 @4xl:text-lg">No countries found.</p>
		{/if}
	</div>
</main>
