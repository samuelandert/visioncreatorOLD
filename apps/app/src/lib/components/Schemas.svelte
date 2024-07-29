<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import { onMount } from 'svelte';

	export let me;
	const query = $me.query;

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	onMount(async () => {
		await $query.refetch();
	});

	let alertMessage = '';
	let alertType: 'error' | 'success' | '' = '';
	let selectedSchema = null;

	async function handleInsert() {
		try {
			const result = await $insertDBMutation.mutateAsync({});
			if (result.success) {
				alertMessage = 'Data inserted successfully!';
				alertType = 'success';
				console.log('Inserted data:', result.insertedData);
				await $query.refetch();
			} else {
				alertMessage = `Error: ${result.error}. Details: ${result.details}`;
				alertType = 'error';
			}
		} catch (error) {
			alertMessage = `Unexpected error: ${error.message}`;
			alertType = 'error';
			console.error('Error inserting data:', error);
		}
	}

	function selectSchema(schema) {
		selectedSchema = schema;
	}

	function getSchemaName(schema) {
		return schema.json?.oContext?.name ?? 'Unnamed Schema';
	}

	function getSchemaVersion(schema) {
		return schema.json?.oContext?.version ?? 'Unknown';
	}

	function getSchemaAuthor(schema) {
		return schema.json?.oContext?.author ?? 'Unknown';
	}
</script>

<div class="flex h-screen overflow-hidden">
	<aside class="w-1/3 p-4 overflow-y-auto bg-surface-200-700-token">
		<button class="w-full mb-4 btn variant-filled-primary" on:click={handleInsert}>
			Insert Random JSON
		</button>

		{#if alertMessage}
			<div
				class="mb-4 alert {alertType === 'error'
					? 'variant-filled-error'
					: 'variant-filled-success'}"
			>
				<div class="alert-message">
					<p>{alertMessage}</p>
				</div>
			</div>
		{/if}

		<ul class="space-y-2">
			{#each $query.data.schemas as item}
				<li>
					<button
						class="w-full p-2 text-left card variant-filled-surface hover:variant-filled-primary"
						on:click={() => selectSchema(item)}
					>
						<h3 class="font-medium">{getSchemaName(item)}</h3>
						<div class="text-xs text-surface-300">
							<span>v{getSchemaVersion(item)}</span>
							<span class="ml-2">by {getSchemaAuthor(item)}</span>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</aside>
	<main class="w-2/3 p-4 overflow-y-auto">
		<h2 class="mb-4 text-2xl font-bold">Selected Schema</h2>
		{#if selectedSchema}
			<div class="p-4 card variant-filled-surface">
				<h3 class="mb-2 text-xl font-semibold">{getSchemaName(selectedSchema)}</h3>
				<pre class="whitespace-pre-wrap">{JSON.stringify(selectedSchema.json, null, 2)}</pre>
			</div>
		{:else}
			<p class="p-4 card variant-filled-surface">No schema selected</p>
		{/if}
	</main>
</div>
