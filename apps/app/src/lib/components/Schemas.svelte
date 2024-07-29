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
	let modifiedSchema = null;

	function selectSchemaGroup(group) {
		selectedSchemaGroup = group;
		selectedVersion = group.versions[group.versions.length - 1];
		modifiedSchema = JSON.parse(JSON.stringify(selectedVersion.json));
	}

	function selectVersion(version) {
		selectedVersion = version;
		modifiedSchema = JSON.parse(JSON.stringify(version.json));
	}

	function updatePropName(oldPropName: string, newPropName: string) {
		if (oldPropName !== newPropName) {
			const properties = {};
			const oldProperties = modifiedSchema.properties;

			// Preserve the order of properties
			for (const key of Object.keys(oldProperties)) {
				if (key === oldPropName) {
					properties[newPropName] = oldProperties[oldPropName];
				} else {
					properties[key] = oldProperties[key];
				}
			}

			// Update required array if the old property name was in it
			const required = modifiedSchema.required.map((name) =>
				name === oldPropName ? newPropName : name
			);

			modifiedSchema = {
				...modifiedSchema,
				properties,
				required
			};
		}
	}

	// Modify the existing toggleRequired function
	function toggleRequired(propName: string) {
		if (!modifiedSchema) return;

		const required = [...modifiedSchema.required];
		const index = required.indexOf(propName);
		if (index > -1) {
			required.splice(index, 1);
		} else {
			required.push(propName);
		}
		modifiedSchema = { ...modifiedSchema, required };
	}

	$: isSchemaModified = JSON.stringify(selectedVersion?.json) !== JSON.stringify(modifiedSchema);

	function toggleDeletion(propName: string) {
		if (!modifiedSchema.deletedProperties) {
			modifiedSchema.deletedProperties = [];
		}
		const index = modifiedSchema.deletedProperties.indexOf(propName);
		if (index > -1) {
			modifiedSchema.deletedProperties.splice(index, 1);
		} else {
			modifiedSchema.deletedProperties.push(propName);
		}
		modifiedSchema = { ...modifiedSchema };
	}

	async function handleUpdateSchema() {
		if (!modifiedSchema || !isSchemaModified) return;

		try {
			// Remove deleted properties
			if (modifiedSchema.deletedProperties) {
				for (const propName of modifiedSchema.deletedProperties) {
					delete modifiedSchema.properties[propName];
				}
				delete modifiedSchema.deletedProperties;
			}

			const result = await $createSchemaMutation.mutateAsync({
				schema: modifiedSchema,
				update: `${selectedVersion.json.oContext.author}/${selectedVersion.json.oContext.name}/${selectedVersion.json.oContext.version}/${selectedVersion.cid}`
			});

			if (result.success) {
				alertMessage = 'Schema updated successfully!';
				alertType = 'success';
				console.log('Updated schema:', result.insertedData);
				await $query.refetch();

				// Update local state
				selectedVersion = { ...selectedVersion, json: modifiedSchema };
				const groupIndex = schemaGroups.findIndex((g) => g.name === selectedSchemaGroup.name);
				if (groupIndex !== -1) {
					const versionIndex = schemaGroups[groupIndex].versions.findIndex(
						(v) => v.cid === selectedVersion.cid
					);
					if (versionIndex !== -1) {
						schemaGroups[groupIndex].versions[versionIndex] = selectedVersion;
						schemaGroups = [...schemaGroups];
					}
				}
			} else {
				alertMessage = `Error: ${result.error}`;
				alertType = 'error';
			}
		} catch (error) {
			alertMessage = `Unexpected error: ${error.message}`;
			alertType = 'error';
			console.error('Error updating schema:', error);
		}
	}

	$: getHoverColor = (baseColor) => {
		const colorNumber = parseInt(baseColor.split('-')[1]);
		return `bg-${baseColor.split('-')[0]}-${Math.min(colorNumber + 100, 900)}`;
	};

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
				await $query.refetch(); // Refetch the query after successful insert
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

	function markForDeletion(propName: string) {
		if (!modifiedSchema.deletedProperties) {
			modifiedSchema.deletedProperties = [];
		}
		modifiedSchema.deletedProperties.push(propName);
		modifiedSchema = { ...modifiedSchema };
	}

	$: isPropertyModified = (propName) => {
		const originalProp = selectedVersion?.json.properties[propName];
		const modifiedProp = modifiedSchema?.properties[propName];
		return JSON.stringify(originalProp) !== JSON.stringify(modifiedProp);
	};

	$: isPropertyDeleted = (propName) => {
		return modifiedSchema?.deletedProperties?.includes(propName);
	};

	$: schemaGroups = groupSchemas($query.data.schemas);
</script>

<div class="flex h-full overflow-hidden bg-surface-100-800-token">
	<aside class="w-[300px] p-4 overflow-y-auto bg-surface-200-700-token">
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
				<!-- Dedicated button area -->
				<div class="flex justify-end mb-4 space-x-2">
					<button class="btn btn-sm variant-ghost-warning" on:click={handleInsert}>
						Add Object
					</button>
					<button
						class="btn btn-sm variant-ghost-secondary"
						on:click={handleUpdateSchema}
						disabled={!isSchemaModified}
					>
						Update Schema
					</button>
				</div>

				<!-- Schema info area -->
				<div class="mb-4">
					<h3 class="text-xl font-semibold truncate">{getSchemaName(selectedVersion)}</h3>
					<p class="text-sm opacity-75">Author: {getSchemaAuthor(selectedVersion)}</p>
				</div>

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

				<div class="space-y-2">
					{#each Object.entries(modifiedSchema.properties || {}) as [propName, propDetails], index}
						{#if propName !== 'oContext'}
							{@const baseColor = isPropertyDeleted(propName)
								? 'error-500'
								: isPropertyModified(propName)
								? 'warning-500'
								: 'surface-300'}
							<div
								class="p-2 transition-colors duration-200 rounded-lg
							bg-{baseColor}
							hover:{getHoverColor(baseColor)}"
							>
								<div class="flex items-center justify-between mb-1">
									<input
										type="text"
										value={propName}
										on:input={(e) => updatePropName(propName, e.target.value)}
										class="px-1 font-semibold bg-transparent border-none rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
									<div class="flex items-center space-x-2">
										<span
											class="px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary-500 text-secondary-50"
										>
											{propDetails.type}
										</span>
										<button
											class="px-2 py-0.5 text-xs font-semibold rounded-full {modifiedSchema.required.includes(
												propName
											)
												? 'bg-error-500 text-error-50'
												: 'bg-surface-500 text-surface-50'}"
											on:click={() => toggleRequired(propName)}
										>
											{modifiedSchema.required.includes(propName) ? 'Required' : 'Optional'}
										</button>
										<button
											class="px-2 py-0.5 text-xs font-semibold rounded-full {isPropertyDeleted(
												propName
											)
												? 'bg-success-500'
												: 'bg-error-500'} text-error-50"
											on:click={() => toggleDeletion(propName)}
										>
											{isPropertyDeleted(propName) ? 'Restore' : 'Delete'}
										</button>
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
