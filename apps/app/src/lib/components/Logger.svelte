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
	function getTypeColor(type: LogType | undefined) {
		switch (type) {
			case 'success':
				return 'text-success-500';
			case 'error':
				return 'text-error-500';
			case 'info':
			default:
				return 'text-surface-600-300-token';
		}
	}
</script>

<div class="flex flex-col h-full overflow-hidden bg-surface-700 rounded-xl">
	<div class="flex-shrink-0 p-4 rounded-b-3xl">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold">Logs</h1>
			<div class="flex flex-wrap gap-1">
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
	</div>
	<div class="flex-grow p-4 overflow-hidden">
		<div bind:this={logContainer} class="h-full overflow-y-auto">
			<div class="space-y-1">
				{#each filteredLogs as entry, index}
					<div
						class="p-1 overflow-hidden rounded cursor-pointer card variant-soft"
						on:click={() => entry.json && toggleExpand(index)}
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center flex-grow overflow-hidden">
								<span class="flex-shrink-0 mr-1 font-semibold {getTypeColor(entry.type)}">
									{entry.type ? entry.type.toUpperCase() : 'UNKNOWN'}:
								</span>
								<span class="truncate">{entry.message}</span>
							</div>
							{#if entry.json}
								<span
									class="flex-shrink-0 ml-2 text-xl"
									class:text-success-500={!expandedLogs.has(index)}
									class:text-error-500={expandedLogs.has(index)}
								>
									{expandedLogs.has(index) ? '×' : '+'}
								</span>
							{/if}
						</div>
						<div class="mt-0.5 text-2xs text-surface-600-300-token overflow-hidden">
							<span class="truncate">{entry.file}</span>
							<span class="flex-shrink-0 ml-1">{new Date(entry.date).toLocaleString()}</span>
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
</div>
