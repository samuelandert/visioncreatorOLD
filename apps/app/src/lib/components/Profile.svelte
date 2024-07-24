<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { eventBus } from '$lib/composables/eventBus';

	export let me;
	const queryMe = $me.queries.queryMe;
	const queryLeaderboard = $me.queries.queryLeaderboard;

	$: userRank = $queryLeaderboard.data
		? $queryLeaderboard.data.findIndex((entry) => entry.id === $me.authID) + 1 || 'rechnet...'
		: 'rechnet...';
	$: streamPotential = $queryLeaderboard.data
		? ($queryLeaderboard.data.find((entry) => entry.id === $me.authID)?.suminvites || 0) * 5
		: 0;

	async function handleUpdateMe() {
		console.log('PROFILE: Received updateMe event, refetching queries');
		await $queryMe.refetch();
		await $queryLeaderboard.refetch();
	}

	onMount(async () => {
		eventBus.on('updateMe', handleUpdateMe);
	});

	onDestroy(() => {
		eventBus.off('updateMe', handleUpdateMe);
	});
</script>

<main class="overflow-auto">
	<div class="w-full max-w-6xl bg-surface-800 rounded-3xl">
		{#if $queryMe.isLoading || $queryLeaderboard.isLoading}
			<p class="text-lg text-gray-500">Loading Profile...</p>
		{:else if $queryMe.error || $queryLeaderboard.error}
			<pre class="text-red-500">Error: {JSON.stringify(
					$queryMe.error || $queryLeaderboard.error,
					null,
					2
				)}</pre>
		{:else}
			<div
				class="relative text-center bg-center bg-cover rounded-t-3xl"
				style="background-image: url('/sun.jpeg');"
			>
				<div class="absolute inset-0 bg-opacity-40 bg-surface-900" />

				<div class="relative z-10 flex flex-col items-center text-tertiary-300">
					<div class="px-6 py-2 font-bold text-white bg-transparent text-md rounded-t-3xl">
						Profile
					</div>
					<div class="flex flex-col items-center p-8">
						<Avatar
							me={{
								data: { seed: $queryMe.data?.id },
								design: { highlight: true },
								size: 'lg'
							}}
						/>
						<h1 class="text-2xl @3xl:text-5xl font-bold h1">
							Hey {$queryMe.data?.full_name}
						</h1>
						<p class="text-md @3xl:text-2xl">wonderful to have you around</p>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-evenly p-4 @3xl:p-8 space-x-4">
				<div class="text-center">
					<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">{userRank}</p>
					<p class="text-tertiary-600 text-sm @3xl:text-lg">Waiting Position</p>
				</div>
				<div class="text-center">
					<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">
						{streamPotential} $/m
					</p>
					<p class="text-tertiary-600 text-sm @3xl:text-lg">Streaming Potential</p>
				</div>
			</div>
		{/if}
	</div>
</main>
