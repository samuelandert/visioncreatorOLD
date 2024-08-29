<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { eventBus } from '$lib/composables/eventBus';

	export let me;
	const query = $me.query;

	let selfEntry;
	let otherEntries = [];
	let peopleAhead = 0;

	$: if ($query.data && $query.data.list) {
		selfEntry = $query.data.list.find((entry) => entry.identifier === $me.authID);
		otherEntries = $query.data.list.filter((entry) => entry.identifier !== $me.authID);
		peopleAhead = otherEntries.filter(
			(entry) => entry.numericValue > selfEntry.numericValue
		).length;
	}

	function getLevel(invites) {
		if (invites >= 3) return 3;
		if (invites >= 2) return 2;
		if (invites >= 1) return 1;
		return 0;
	}

	function getLevelStatus(level, currentInvites) {
		if (currentInvites >= level) return 'completed';
		if (currentInvites === level - 1) return 'in-progress';
		return 'open';
	}

	function getProgressPercentage(currentInvites, level) {
		if (currentInvites >= level) return 100;
		if (currentInvites < level - 1) return 0;
		return ((currentInvites - (level - 1)) / 1) * 100;
	}

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
	<div class="space-y-6">
		{#if selfEntry}
			<div class="p-4 space-y-4 sm:p-8 sm:space-y-8 bg-surface-800 rounded-3xl">
				{#if getLevel(selfEntry.numericValue) >= 3}
					<div class="text-center">
						<p class="text-lg font-semibold sm:text-xl lg:text-2xl text-success-500">
							Congratulations, you are up next!
						</p>
						<p class="text-sm sm:text-md lg:text-lg">Schedule your onboarding call now.</p>
						<a
							href="/schedule-call"
							class="mt-2 text-sm btn variant-filled-primary sm:text-base lg:text-lg"
							>Schedule Call</a
						>
					</div>
				{:else}
					<div class="space-y-1 text-center">
						<p class="text-lg font-semibold sm:text-xl lg:text-2xl">
							Challenge 1 - Form your tribe
						</p>
						<p class="text-sm sm:text-md lg:text-lg">
							Inspire 3+ of your dearest fellows to join the movement to receive your personal
							onboarding call.
						</p>
						<p class="text-xs sm:text-sm lg:text-base text-tertiary-600">
							*The further up on the waiting list, the faster you get in.
						</p>
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-2 mt-4 sm:grid-cols-3 sm:gap-4">
					{#each [1, 2, 3] as level}
						{@const status = getLevelStatus(level, selfEntry.numericValue)}
						<div
							class="flex flex-col justify-between items-center p-2 sm:p-4 bg-surface-700 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[100px] sm:min-h-[140px] rounded-xl"
						>
							{#if status === 'in-progress'}
								<div
									class="absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out rounded-lg bg-success-500/30 animate-pulse"
									style="width: {getProgressPercentage(selfEntry.numericValue, level)}%"
								/>
							{/if}
							<div class="z-10 flex flex-col items-center mt-2 sm:mt-4">
								<Icon
									icon={status === 'completed' ? 'mdi:check-circle' : 'mdi:lock'}
									class="text-2xl sm:text-4xl mb-1 sm:mb-2 {status === 'completed'
										? 'text-success-500'
										: 'text-surface-400'}"
								/>
								<span
									class="text-lg sm:text-2xl font-bold {status === 'completed'
										? 'text-surface-50'
										: 'text-surface-400'}"
								>
									Level {level}
								</span>
								<p
									class="text-xs sm:text-sm mt-1 sm:mt-2 text-center {status !== 'completed'
										? 'text-surface-400'
										: 'text-surface-50'}"
								>
									{#if level === 1}
										1 inspiration
									{:else if level === 2}
										2 inspirations
									{:else if level === 3}
										3 inspirations
									{/if}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<ul class="space-y-2 @3xl:space-y-4">
			{#each $query.data.list as { primaryText, identifier, numericValue }, index}
				<li
					class={`flex items-center justify-between rounded-4xl  ${
						identifier === $me.authID ? 'bg-surface-700' : 'bg-surface-800'
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
						{#each $query.data.stats as stat}
							<div class="flex flex-col items-center text-right">
								<p class="text-tertiary-400 text-lg @3xl:text-2xl font-semibold leading-tight">
									{stat.label === 'Rank' ? index + 1 : numericValue}
								</p>
								<p class="text-2xs @3xl:text-xs leading-none text-tertiary-700">{stat.label}</p>
							</div>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<p class="flex items-center justify-center w-full p-10 h-72">No leaderboard data available</p>
{/if}
