<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

	export let me;
	const query = $me.query;

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	async function handleInsert() {
		try {
			const result = await $insertDBMutation.mutateAsync({});
			console.log('Inserted data:', result.insertedData);
		} catch (error) {
			console.error('Error inserting data:', error);
		}
	}
</script>

<div class="grid grid-cols-[300px_1fr] h-screen overflow-hidden">
	<aside class="p-4 overflow-hidden bg-surface-200-700-token">
		<h1 class="mb-4 text-xl font-bold">Test Component</h1>
		<button class="btn variant-filled-primary" on:click={handleInsert}> Insert Random JSON </button>
	</aside>
	<main class="p-4 overflow-y-auto bg-surface-100-800-token">
		<ul class="space-y-4">
			{#each [...$query.data.db].reverse() as item}
				<li class="p-4 card variant-filled-surface">
					<pre class="whitespace-pre-wrap">{JSON.stringify(item.json, null, 2)}</pre>
				</li>
			{/each}
		</ul>
	</main>
</div>
