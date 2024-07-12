<script lang="ts">
	import { log, type LogEntry, type LogType } from '$lib/stores';
	import { afterUpdate } from 'svelte';

	let logContainer: HTMLElement;
	let filter: LogType | 'all' = 'all';
	let expandedLogs: Set<number> = new Set();

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

	function toggleExpand(index: number) {
		if (expandedLogs.has(index)) {
			expandedLogs.delete(index);
		} else {
			expandedLogs.add(index);
		}
		expandedLogs = expandedLogs;
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
		<div class="pb-12 space-y-1">
			{#each filteredLogs as entry, index}
				<div
					class="p-1 rounded cursor-pointer card variant-soft"
					on:click={() => entry.json && toggleExpand(index)}
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center flex-grow">
							<span
								class="mr-1 font-semibold"
								class:text-success-500={entry.type === 'success'}
								class:text-error-500={entry.type === 'error'}
								class:text-surface-600-300-token={entry.type === 'info'}
							>
								{entry.type.toUpperCase()}:
							</span>
							<span>{entry.message}</span>
						</div>
						{#if entry.json}
							<span
								class="ml-2 text-xl"
								class:text-success-500={!expandedLogs.has(index)}
								class:text-error-500={expandedLogs.has(index)}
							>
								{expandedLogs.has(index) ? '×' : '+'}
							</span>
						{/if}
					</div>
					<div class="mt-0.5 text-2xs text-surface-600-300-token">
						<span>{entry.file}</span>
						<span class="ml-1">{new Date(entry.date).toLocaleString()}</span>
					</div>
					{#if entry.json && expandedLogs.has(index)}
						<pre class="p-1 mt-1 overflow-x-auto rounded bg-surface-700 text-2xs">
                            {JSON.stringify(entry.json, null, 2).trim()}
                        </pre>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
