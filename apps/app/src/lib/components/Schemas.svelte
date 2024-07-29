<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import { onMount } from 'svelte';

	export let me;
	const query = $me.query;

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	const createSchemaMutation = createMutation({
		operationName: 'createSchema'
	});

	onMount(async () => {
		await $query.refetch();
	});

	let alertMessage = '';
	let alertType: 'error' | 'success' | '' = '';
	let selectedSchemaGroup = null;
	let selectedVersion = null;

	async function handleInsert() {
		try {
			const result = await $insertDBMutation.mutateAsync({
				schema: selectedVersion.json,
				cid: selectedVersion.cid
			});
			if (result.success) {
				alertMessage = 'Object added successfully!';
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

	function selectSchemaGroup(group) {
		selectedSchemaGroup = group;
		selectedVersion = group.versions[group.versions.length - 1];
	}

	function selectVersion(version) {
		selectedVersion = version;
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

	function groupSchemas(schemas) {
		const groups = {};
		schemas.forEach((schema) => {
			const name = getSchemaName(schema);
			if (!groups[name]) {
				groups[name] = { name, versions: [] };
			}
			groups[name].versions.push(schema);
		});
		return Object.values(groups);
	}

	function truncateCID(cid, maxLength = 10) {
		if (cid && cid.length > maxLength) {
			return cid.substring(0, maxLength) + '...';
		}
		return cid;
	}

	function getSystemProps(schema) {
		const props = schema.json?.oContext || {};
		if (props.prev) {
			const parts = props.prev.split('/');
			if (parts.length === 4) {
				props.prev = `${parts[0]}/${parts[1]}/${parts[2]}/${truncateCID(parts[3])}`;
			}
		}
		return props;
	}

	let isContextExpanded = false;

	function toggleContext() {
		isContextExpanded = !isContextExpanded;
	}

	async function handleUpdateSchema() {
		if (!selectedVersion) return;

		const clonedSchema = JSON.parse(JSON.stringify(selectedVersion.json));
		const properties = Object.keys(clonedSchema.properties).filter((prop) => prop !== 'oContext');

		if (properties.length > 0) {
			const randomProp = properties[Math.floor(Math.random() * properties.length)];
			delete clonedSchema.properties[randomProp];

			// Update oContext
			const newVersion = parseInt(clonedSchema.oContext.version) + 1;
			clonedSchema.oContext = {
				...clonedSchema.oContext,
				version: newVersion.toString(),
				prev: `${clonedSchema.oContext.name}/${clonedSchema.oContext.version}/${selectedVersion.cid}`
			};

			try {
				const result = await $createSchemaMutation.mutateAsync({
					schema: clonedSchema
				});

				if (result.success) {
					alertMessage = 'Schema updated successfully!';
					alertType = 'success';
					console.log('Updated schema:', result.insertedData);
					await $query.refetch();
				} else {
					alertMessage = `Error: ${result.error}`;
					alertType = 'error';
				}
			} catch (error) {
				alertMessage = `Unexpected error: ${error.message}`;
				alertType = 'error';
				console.error('Error updating schema:', error);
			}
		} else {
			alertMessage = 'No properties to remove from the schema.';
			alertType = 'error';
		}
	}

	$: schemaGroups = groupSchemas($query.data.schemas);
</script>

<div class="flex h-full overflow-hidden bg-surface-100-800-token">
	<aside class="w-1/3 p-4 overflow-y-auto bg-surface-200-700-token">
		<ul class="space-y-2">
			{#each schemaGroups as group}
				<li>
					<button
						class="w-full p-2 text-left transition-colors duration-200 rounded-lg hover:bg-primary-500 hover:text-white"
						on:click={() => selectSchemaGroup(group)}
					>
						<h3 class="font-medium truncate">{group.name}</h3>
						<div class="text-xs opacity-75">
							<span>v{getSchemaVersion(group.versions[group.versions.length - 1])}</span>
							<span class="ml-2"
								>by {getSchemaAuthor(group.versions[group.versions.length - 1])}</span
							>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</aside>
	<main class="w-2/3 p-4 overflow-x-hidden overflow-y-auto bg-surface-100-800-token">
		{#if selectedSchemaGroup}
			<div class="tabs">
				{#each selectedSchemaGroup.versions as version}
					<button
						class="tab {selectedVersion === version
							? 'variant-filled-secondary'
							: 'variant-ghost-secondary'}"
						on:click={() => selectVersion(version)}
					>
						v{getSchemaVersion(version)}
					</button>
				{/each}
			</div>
			<div class="p-4 rounded-lg bg-surface-200-700-token">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-xl font-semibold truncate">{getSchemaName(selectedVersion)}</h3>
					<div class="space-x-2">
						<button class="btn variant-filled-primary" on:click={handleInsert}>Add Object</button>
						<button class="btn variant-filled-secondary" on:click={handleUpdateSchema}
							>Update Schema</button
						>
					</div>
				</div>
				<p class="mb-4 text-sm opacity-75">Author: {getSchemaAuthor(selectedVersion)}</p>

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
				<h3 class="mb-2 text-xl font-semibold truncate">{getSchemaName(selectedVersion)}</h3>
				<p class="mb-4 text-sm opacity-75">Author: {getSchemaAuthor(selectedVersion)}</p>
				<div class="space-y-2">
					{#each Object.entries(selectedVersion.json.properties || {}) as [propName, propDetails]}
						{#if propName !== 'oContext'}
							<div
								class="p-2 transition-colors duration-200 rounded-lg bg-surface-300-600-token hover:bg-surface-400-500-token"
							>
								<div class="flex items-center justify-between mb-1">
									<span class="font-semibold">{propName}</span>
									<div class="space-x-2">
										<span
											class="px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary-500 text-secondary-50"
											>{propDetails.type}</span
										>
										{#if selectedVersion.json.required?.includes(propName)}
											<span
												class="px-2 py-0.5 text-xs font-semibold rounded-full bg-error-500 text-error-50"
												>Required</span
											>
										{/if}
									</div>
								</div>
								{#if propDetails.description}
									<p class="text-xs opacity-75">{propDetails.description}</p>
								{/if}
							</div>
						{/if}
					{/each}
				</div>

				<div class="mt-6">
					<button
						class="flex items-center justify-between w-full p-2 text-lg font-semibold rounded-lg bg-surface-300-600-token hover:bg-surface-400-500-token"
						on:click={toggleContext}
					>
						<span>oContext</span>
						<span class="text-2xl">{isContextExpanded ? '−' : '+'}</span>
					</button>
					{#if isContextExpanded}
						<div class="mt-2 space-y-2">
							{#each Object.entries(getSystemProps(selectedVersion)) as [propName, propValue]}
								<div
									class="p-2 transition-colors duration-200 rounded-lg bg-surface-300-600-token hover:bg-surface-400-500-token"
								>
									<div class="flex items-center justify-between">
										<span class="font-semibold">{propName}</span>
										<span class="text-sm break-all opacity-75">
											{propName === 'prev' ? propValue : truncateCID(propValue)}
										</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<p class="p-4 text-center rounded-lg bg-surface-200-700-token">No schema selected</p>
		{/if}
	</main>
</div>

<style>
	.tabs {
		@apply flex space-x-2;
	}
	.tab {
		@apply px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200;
	}
</style>
