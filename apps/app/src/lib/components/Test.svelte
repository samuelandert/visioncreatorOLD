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

	function getSchemaName(schema) {
		return schema.jsonschema?.oContext?.name ?? 'Unnamed Schema';
	}

	function selectSchema(schema) {
		selectedSchema = schema;
	}

	function parseSchemaInfo(schemaString) {
		try {
			const parts = schemaString.split('/');
			if (parts.length === 3) {
				return {
					author: parts[0],
					version: parts[1],
					name: parts[2]
				};
			}
			return { author: 'Unknown', version: 'N/A', name: 'Unknown' };
		} catch (error) {
			console.error('Error parsing schema:', error);
			return { author: 'Unknown', version: 'N/A', name: 'Unknown' };
		}
	}

	function getSchemaByName(schemaName) {
		return $query.data.schemas.find((s) => getSchemaName(s) === schemaName);
	}

	function isFieldRequired(schemaName, fieldName) {
		const schema = getSchemaByName(schemaName);
		if (!schema) return false;

		const requiredFields = schema.jsonschema.required || [];
		return requiredFields.includes(fieldName);
	}

	function getFieldType(schemaName, fieldName) {
		const schema = getSchemaByName(schemaName);
		if (!schema) return 'unknown';

		const fieldType = schema.jsonschema.properties[fieldName]?.type || 'unknown';
		return fieldType;
	}

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
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
				{#each $query.data.db.sort(sortByTimestamp) as item}
					{@const schemaInfo = parseSchemaInfo(item.json.$schema)}
					{@const schema = getSchemaByName(schemaInfo.name)}
					<li class="grid grid-cols-[200px_1fr] card variant-filled-surface">
						<aside class="p-4 border-r border-surface-300-600-token">
							<span class="block text-2xs text-surface-300">Schema</span>
							<h3 class="-mt-1 text-lg font-semibold">{schemaInfo.name}</h3>
							<span class="block text-2xs text-surface-300">Version</span>
							<span class="block -mt-1 text-sm">{schemaInfo.version}</span>
							<span class="block text-2xs text-surface-300">Author</span>
							<span class="block -mt-1 text-sm">{schemaInfo.author}</span>
							{#if schema?.jsonschema?.oContext}
								<span class="block text-2xs text-surface-300">CID</span>
								<span class="block -mt-1 text-sm"
									>{schema.jsonschema.oContext.cid?.slice(0, 10)}...</span
								>
								<span class="block text-2xs text-surface-300">Prev</span>
								<span class="block -mt-1 text-sm">
									{#if schema.jsonschema.oContext.prev}
										{schema.jsonschema.oContext.prev.slice(0, 10)}...
									{:else}
										None
									{/if}
								</span>
							{/if}
						</aside>

						<div class="p-4">
							{#each Object.entries(item.json) as [key, value]}
								{#if key !== '$schema'}
									<div class="relative mb-2">
										<span class="block text-2xs text-surface-300">{key}</span>
										{#if typeof value === 'object' && value !== null}
											<div class="block px-2 -mb-1 text-sm rounded bg-surface-200-700-token">
												{#each Object.entries(value) as [subKey, subValue]}
													<div class="-py-1">
														<span class="text-2xs text-surface-300">{subKey}:</span>
														<span class="ml-1">{subValue}</span>
													</div>
												{/each}
											</div>
										{:else}
											<span class="block -mt-0.5 text-sm">{value}</span>
										{/if}
										<div class="absolute top-0 right-0 flex">
											{#if isFieldRequired(schemaInfo.name, key)}
												<span class="px-1 mr-1 text-white rounded-xl text-2xs bg-error-500"
													>Required</span
												>
											{/if}
											<span class="px-1 text-white rounded-xl text-2xs bg-surface-700">
												{getFieldType(schemaInfo.name, key)}
											</span>
										</div>
									</div>
								{/if}
							{/each}
						</div>
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
