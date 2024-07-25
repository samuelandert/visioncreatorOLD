<script lang="ts">
	export let me;
	const query = $me.query;
</script>

<main class="container p-4 mx-auto space-y-4">
	<div class="grid grid-cols-1 gap-4 @container @6xl:grid-cols-2 @9xl:grid-cols-3">
		{#if $query.isLoading}
			<p class="p-4 col-span-full card variant-ghost-surface">Loading countries...</p>
		{:else if $query.error}
			<pre class="p-4 whitespace-pre-wrap col-span-full card variant-filled-error">{JSON.stringify(
					$query.error,
					null,
					2
				)}</pre>
		{:else if $query.data && $query.data.grid && Array.isArray($query.data.grid)}
			{#each $query.data.grid as item (item.identifier)}
				<div class="p-4 space-y-2 card variant-filled-surface @3xl:p-6 @7xl:p-8">
					<header class="flex items-center justify-between">
						<h2 class="h3 @3xl:text-2xl @7xl:text-3xl">{item.primaryText}</h2>
					</header>
					<section class="space-y-2">
						<p>
							<span class="font-bold">{item.label1}</span>
							<span>{item.value1 || 'N/A'}</span>
						</p>
						<p>
							<span class="font-bold">{item.label2}</span>
							<span>{item.value2 || 'N/A'}</span>
						</p>
						<p>
							<span class="text-sm @3xl:text-base @7xl:text-lg">{item.label3}:</span>
							<span class="badge variant-soft">{item.value3 || 'N/A'}</span>
						</p>
						<p>
							<span class=" text-sm @3xl:text-base @7xl:text-lg">{item.label4}:</span>
							<span class="badge variant-soft">{item.value4 || 'N/A'}</span>
						</p>
					</section>
				</div>
			{/each}
		{:else}
			<p class="p-4 col-span-full card variant-ghost-surface">No countries found.</p>
		{/if}
	</div>
</main>
