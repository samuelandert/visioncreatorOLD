<script lang="ts">
	export let me;
	const query = $me.queries.Countries;
</script>

<main class=" overflow-auto">
	<h1 class="text-4xl font-bold mb-4">Countries</h1>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#if $query.isLoading}
			<p class="text-lg text-gray-500">Loading...</p>
		{:else if $query.error}
			<pre class="text-red-500">Error: {JSON.stringify($query.error, null, 2)}</pre>
		{:else}
			{#each $query.data.countries_countries as country (country.code)}
				<div class="rounded overflow-hidden shadow-lg m-4 bg-secondary-700 text-white">
					<div class="px-6 py-4">
						<div class="font-bold text-xl text-primary-500 mb-2">
							{country.name} ({country.code})
						</div>
						<p class="text-gray-300 text-lg font-bold">
							{country.capital}
						</p>
						<p class="text-gray-300 text-base">
							Currency: {#each country.currencies as currency (currency)}{currency}{/each}
						</p>
						<p class="text-gray-300 text-base">
							Phone Code: {country.phone}
						</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</main>
