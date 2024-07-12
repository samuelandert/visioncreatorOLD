<script lang="ts">
	import { log, type LogEntry, type LogType } from '$lib/stores';
	import { afterUpdate } from 'svelte';

	let logContainer: HTMLElement;
	let filter: LogType | 'all' = 'all';

	afterUpdate(() => {
		if (logContainer) {
			logContainer.scrollTo({
				top: logContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});

	$: filteredLogs = filter === 'all' ? $log : $log.filter((entry) => entry.type === filter);

	function clearLogs() {
		log.clear();
	}
</script>

<div class="flex flex-col h-full text-xs">
	<div class="flex items-center justify-between mb-2">
		<h1 class="text-xl font-bold">Logs</h1>
		<div class="flex space-x-1">
			<button
				class="btn btn-sm variant-ghost-secondary"
				class:variant-filled-secondary={filter === 'all'}
				on:click={() => (filter = 'all')}>All</button
			>
			<button
				class="btn btn-sm variant-ghost-secondary"
				class:variant-filled-secondary={filter === 'success'}
				on:click={() => (filter = 'success')}>Success</button
			>
			<button
				class="btn btn-sm variant-ghost-secondary"
				class:variant-filled-secondary={filter === 'info'}
				on:click={() => (filter = 'info')}>Info</button
			>
			<button
				class="btn btn-sm variant-ghost-secondary"
				class:variant-filled-secondary={filter === 'error'}
				on:click={() => (filter = 'error')}>Error</button
			>
			<button class="btn btn-sm variant-ghost-warning" on:click={clearLogs}>Clear</button>
		</div>
	</div>
	<div bind:this={logContainer} class="flex-grow overflow-y-auto">
		<div class="space-y-1">
			{#each filteredLogs as entry}
				<div class="p-1 rounded card variant-soft">
					<div class="flex items-center">
						<span
							class="mr-1 font-semibold"
							class:text-success-500={entry.type === 'success'}
							class:text-error-500={entry.type === 'error'}
							class:text-surface-600-300-token={entry.type === 'info'}
						>
							{entry.type.toUpperCase()}:
						</span>
						<span class="flex-grow">{entry.message}</span>
					</div>
					<div class="mt-0.5 text-2xs text-surface-600-300-token">
						<span>{entry.file}</span>
						<span class="ml-1">{new Date(entry.date).toLocaleString()}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
