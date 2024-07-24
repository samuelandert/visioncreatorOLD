<!-- apps/app/src/lib/components/Leaderboard.svelte -->
<script lang="ts">
	import Avatar from './Avatar.svelte';
	export let me;
	const query = $me.queries.queryLeaderboard;
</script>

<div class={`w-full max-w-6xl p-2 @3xl:p-6 overflow-auto rounded-3xl bg-surface-800`}>
	{#if $query.isLoading}
		<p class="flex items-center justify-center w-full p-10 h-72">Loading leaderboard...</p>
	{:else if $query.error}
		<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
			Error: {$query.error?.message}
		</p>
	{:else}
		<ul class="space-y-2 @3xl:space-y-4">
			{#each $query.data as { name, id, suminvites }, index}
				<li
					class={`flex items-center justify-between rounded-4xl  ${
						id === $me.authID ? 'bg-surface-600' : 'bg-surface-700'
					}`}
				>
					<Avatar
						me={{
							data: { seed: id },
							design: { highlight: id === $me.authID },
							size: 'sm'
						}}
					/>

					<div class="flex-1 px-4 text-xl @3xl:text-2xl text-tertiary-400">
						{name}
					</div>

					<div class="flex justify-between px-4 @3xl:px-6 space-x-4 max-h-12">
						<div class="flex flex-col items-center text-right">
							<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
								{suminvites}
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
	{/if}
</div>
