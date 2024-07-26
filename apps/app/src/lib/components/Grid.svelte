<script lang="ts">
	export let me;
	const query = $me.query;
</script>

<main class="w-full max-w-full p-4 mx-auto space-y-8">
	{#if $query.isLoading}
		<div class="p-4 card variant-ghost-surface animate-pulse">
			<p class="w-full h-4 placeholder" />
		</div>
	{:else if $query.error}
		<div class="p-4 card variant-filled-error">
			<pre class="whitespace-pre-wrap">{JSON.stringify($query.error, null, 2)}</pre>
		</div>
	{:else if $query.data && $query.data.grid && Array.isArray($query.data.grid)}
		<div
			class="grid gap-4 space-y-4"
			style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));"
		>
			{#each $query.data.grid as item (item.identifier)}
				<div
					class="overflow-hidden transition-all duration-200 shadow-md bg-surface-700 rounded-2xl hover:shadow-xl"
				>
					<header class="p-2 text-white bg-surface-800">
						<h2 class="text-base font-bold truncate h4 sm:text-lg md:text-xl lg:text-2xl">
							{item.primaryText}
						</h2>
					</header>
					<section class="p-4 space-y-3">
						{#each Array(4) as _, i}
							{#if item[`label${i + 1}`] && item[`value${i + 1}`]}
								<div class="flex items-center justify-between">
									<span class="font-semibold text-tertiary-500">{item[`label${i + 1}`]}</span>
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
