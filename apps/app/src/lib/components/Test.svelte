<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

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

	function getSchemaName(schema) {
		return schema.jsonschema?.['x-schema-metadata']?.name ?? 'Unnamed Schema';
	}

	function selectSchema(schema) {
		selectedSchema = schema;
	}
</script>

<div class="grid grid-cols-[300px_1fr] h-screen overflow-hidden">
	<aside class="p-4 overflow-hidden bg-surface-200-700-token">
		<h1 class="mb-4 text-xl font-bold">Test Component</h1>
		<button class="btn variant-filled-primary" on:click={handleInsert}> Insert Random JSON </button>

		{#if alertMessage}
			<div
				class="mt-4 alert {alertType === 'error'
					? 'variant-filled-error'
					: 'variant-filled-success'}"
			>
				<div class="alert-message">
					<p>{alertMessage}</p>
				</div>
			</div>
		{/if}

		<ul class="mt-4 space-y-2">
			{#each $query.data.schemas as item}
				<li>
					<button
						class="w-full p-2 text-left card variant-filled-surface hover:variant-filled-primary"
						on:click={() => selectSchema(item)}
					>
						<h3 class="font-medium">{getSchemaName(item)}</h3>
					</button>
				</li>
			{/each}
		</ul>
	</aside>
	<main class="grid grid-cols-[2fr_1fr] gap-4 p-4 overflow-hidden bg-surface-100-800-token">
		<div class="pr-4 overflow-y-auto">
			<h2 class="mb-4 text-2xl font-bold">Database Entries</h2>
			<ul class="space-y-4">
				{#each [...$query.data.db].reverse() as item}
					<li class="p-4 card variant-filled-surface">
						<pre class="whitespace-pre-wrap">{JSON.stringify(item.json, null, 2)}</pre>
					</li>
				{/each}
			</ul>
		</div>
		<div class="overflow-y-auto">
			<h2 class="mb-4 text-2xl font-bold">Selected Schema</h2>
			{#if selectedSchema}
				<div class="p-4 card variant-filled-surface">
					<h3 class="mb-2 text-xl font-semibold">{getSchemaName(selectedSchema)}</h3>
					<pre class="whitespace-pre-wrap">{JSON.stringify(
							selectedSchema.jsonschema,
							null,
							2
						)}</pre>
				</div>
			{:else}
				<p class="p-4 card variant-filled-surface">No schema selected</p>
			{/if}
		</div>
	</main>
</div>
