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

<div class="flex flex-col h-full">
	<div class="flex items-center justify-between mb-4">
		<h1 class="text-2xl font-bold">Custom Logger</h1>
		<div class="flex space-x-2">
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
			<button class="btn btn-sm variant-ghost-warning" on:click={clearLogs}>Clear Logs</button>
		</div>
	</div>
	<div bind:this={logContainer} class="flex-grow overflow-y-auto">
		<div class="space-y-2">
			{#each filteredLogs as entry}
				<div class="p-2 rounded card variant-soft">
					<span
						class="font-bold"
						class:text-success-500={entry.type === 'success'}
						class:text-error-500={entry.type === 'error'}
						class:text-surface-600-300-token={entry.type === 'info'}
					>
						{entry.type.toUpperCase()}:
					</span>
					<span>{entry.message}</span>
					<span class="ml-2 text-sm text-surface-600-300-token">
						{new Date(entry.date).toLocaleString()}
					</span>
					<span class="ml-2 text-sm text-surface-600-300-token">{entry.file}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
