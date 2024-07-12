<script lang="ts">
	import { log } from '$lib/stores';
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center justify-between mb-4">
		<h1 class="text-2xl font-bold">Custom Logger</h1>
		<button class="btn variant-filled-primary" on:click={() => log.clear()}>Clear Logs</button>
	</div>
	<div class="flex-grow overflow-y-auto">
		<div class="space-y-2">
			{#each $log as entry}
				<div class="p-2 rounded card variant-soft">
					<span
						class="font-bold"
						class:text-success-500={entry.type === 'success'}
						class:text-error-500={entry.type === 'error'}
						class:text-surface-600-300-token={entry.type === 'default'}
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
