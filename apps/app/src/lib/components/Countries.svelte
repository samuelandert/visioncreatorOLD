<script lang="ts">
	export let me;
	const query = $me.query;
</script>

<main class="container p-4 mx-auto space-y-8">
	{#if $query.isLoading}
		<div class="p-4 card variant-ghost-surface animate-pulse">
			<p class="w-2/3 h-4 placeholder" />
		</div>
	{:else if $query.error}
		<div class="p-4 card variant-filled-error">
			<pre class="whitespace-pre-wrap">{JSON.stringify($query.error, null, 2)}</pre>
		</div>
	{:else if $query.data && $query.data.grid && Array.isArray($query.data.grid)}
		<div class="grid grid-cols-1 gap-4 @container @6xl:grid-cols-2 @9xl:grid-cols-3 space-y-4">
			{#each $query.data.grid as item (item.identifier)}
				<div
					class="overflow-hidden transition-all duration-200 shadow-md bg-surface-700 rounded-2xl hover:shadow-xl"
				>
					<header class="p-2 text-white bg-primary-500">
						<h2 class="h3 font-bold truncate @3xl:text-2xl @7xl:text-3xl">{item.primaryText}</h2>
					</header>
					<section class="p-4 space-y-3">
						{#each Array(4) as _, i}
							{#if item[`label${i + 1}`] && item[`value${i + 1}`]}
								<div class="flex items-center justify-between">
									<span class="font-semibold text-secondary-700">{item[`label${i + 1}`]}</span>
									<span class="px-2 py-1 text-sm rounded-full bg-secondary-500 text-secondary-900">
										{Array.isArray(item[`value${i + 1}`])
											? item[`value${i + 1}`].join(', ')
											: item[`value${i + 1}`]}
									</span>
								</div>
							{/if}
						{/each}
					</section>
				</div>
			{/each}
		</div>
	{:else}
		<div class="p-4 card variant-ghost-surface">
			<p>No countries found.</p>
		</div>
	{/if}
</main>
