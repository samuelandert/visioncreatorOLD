<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { eventBus } from '$lib/composables/eventBus';

	export let me;
	const query = $me.query;

	async function handleUpdateMe() {
		await $query.refetch();
	}

	onMount(async () => {
		eventBus.on('updateMe', handleUpdateMe);
	});

	onDestroy(() => {
		eventBus.off('updateMe', handleUpdateMe);
	});
</script>

<div class="w-full max-w-6xl bg-surface-800 rounded-3xl">
	{#if $query.isLoading}
		<p class="text-lg text-gray-500">Loading Profile...</p>
	{:else if $query.error}
		<pre class="text-red-500">Error: {JSON.stringify($query.error, null, 2)}</pre>
	{:else}
		<div
			class="relative text-center bg-center bg-cover rounded-t-3xl"
			style="background-image: url('/sun.jpeg');"
		>
			<div class="absolute inset-0 bg-opacity-40 bg-surface-900" />

			<div class="relative z-10 flex flex-col items-center text-tertiary-300">
				<div class="px-6 py-2 font-bold text-white bg-transparent text-md rounded-t-3xl">
					{$query.data.name}
				</div>
				<div class="flex flex-col items-center p-8">
					<Avatar
						me={{
							data: { seed: $me.authID },
							design: { highlight: true },
							size: 'lg'
						}}
					/>
					<h1 class="text-2xl @3xl:text-5xl font-bold h1">
						Hey {$query.data.title}
					</h1>
					<p class="text-md @3xl:text-2xl">{$query.data.description}</p>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-evenly p-4 @3xl:p-8 space-x-4">
			{#each $query.data.stats as stat}
				<div class="text-center">
					<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">
						{stat.label === 'Streaming Potential'
							? stat.value || 0
							: stat.value || 'calculating...'}
					</p>
					<p class="text-tertiary-600 text-sm @3xl:text-lg">{stat.label}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
