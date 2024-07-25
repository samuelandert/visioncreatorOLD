<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { eventBus } from '$lib/composables/eventBus';

	export let me;
	const query = $me.query;

	async function handleUpdateMe() {
		await $query.refetch();
	}

	onMount(() => {
		eventBus.on('updateMe', handleUpdateMe);
	});

	onDestroy(() => {
		eventBus.off('updateMe', handleUpdateMe);
	});
</script>

{#if $query.isLoading}
	<p class="flex items-center justify-center w-full p-10 h-72">Loading leaderboard...</p>
{:else if $query.error}
	<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
		Error: {$query.error?.message}
	</p>
{:else if $query.data && $query.data.list}
	<ul class="space-y-2 @3xl:space-y-4">
		{#each $query.data.list as { primaryText, identifier, numericValue }, index}
			<li
				class={`flex items-center justify-between rounded-4xl  ${
					identifier === $me.authID ? 'bg-surface-600' : 'bg-surface-700'
				}`}
			>
				<Avatar
					me={{
						data: { seed: identifier },
						design: { highlight: identifier === $me.authID },
						size: 'sm'
					}}
				/>

				<div class="flex-1 px-4 text-xl @3xl:text-2xl text-tertiary-400">
					{primaryText}
				</div>

				<div class="flex justify-between px-4 @3xl:px-6 space-x-4 max-h-12">
					<div class="flex flex-col items-center text-right">
						<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
							{numericValue}
						</p>
						<p class="text-xxs @3xl:text-xs leading-none text-tertiary-700">invites</p>
					</div>

					<div class="flex flex-col items-center text-right">
						<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
							{index + 1}
						</p>
						<p class="text-xxs @3xl:text-xs leading-none text-tertiary-700">rank</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p class="flex items-center justify-center w-full p-10 h-72">No leaderboard data available</p>
{/if}
