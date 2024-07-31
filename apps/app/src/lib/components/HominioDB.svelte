<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import Properties from './Properties.svelte';
	export let me;

	let query = $me.query;
	let selectedItem = null;
	let message = { text: '', type: '' };
	let schemaInfo = null;
	let expandedProperties = new Map();

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
	}

	async function generateRandomObject() {
		message = { text: '', type: '' };
		const result = await $insertDBMutation.mutateAsync({});
		if (result.success) {
			message = { text: 'Random object generated successfully!', type: 'success' };
			await $query.refetch();
		} else {
			message = { text: `Failed: ${result.details}`, type: 'error' };
			console.error('Failed:', result.details);
		}
	}

	function truncateCID(url: string) {
		const cid = url.split('/').pop() || '';
		return cid.length > 16 ? `${cid.slice(0, 20)}...` : cid;
	}

	function findSchemaInfo(schemaId: string) {
		if (!$query || !$query.data || !$query.data.db) return null;
		const schema = $query.data.db.find((item) => item.json.$id === schemaId);
		if (schema) {
			return {
				title: schema.json.title || 'Unknown Schema',
				description: schema.json.description || 'No description available',
				author: schema.json.author || 'Unknown',
				id: schema.json.$id,
				version: schema.json.version
			};
		}
		return null;
	}

	$: if (selectedItem && selectedItem.json.$schema) {
		schemaInfo = findSchemaInfo(selectedItem.json.$schema);
	} else {
		schemaInfo = null;
	}

	function loadSchema(schemaId: string) {
		console.log('Loading schema:', schemaId);
		const schema = $query.data.db.find((item) => item.json.$id === schemaId);
		if (schema) {
			selectedItem = schema;
			expandedProperties.set(schemaId, null);
			expandedProperties = new Map(expandedProperties);
			console.log('Updated expandedProperties:', expandedProperties);
		}
	}

	function handleToggleProperty(event: CustomEvent<{ path: string; expanded: boolean }>) {
		console.log('HominioDB: Received toggle event', event.detail);
		const { path, expanded } = event.detail;
		if (expanded) {
			expandedProperties = [...expandedProperties, path];
		} else {
			expandedProperties = expandedProperties.filter(
				(p) => p !== path && !p.startsWith(path + '.')
			);
		}
		console.log('HominioDB: Updated expandedProperties', expandedProperties);
	}

	$: if (selectedItem) {
		console.log('HominioDB: Selected item changed, resetting expandedProperties');
		expandedProperties = [];
	}
</script>

<div class="flex h-full text-gray-900 bg-tertiary-100 dark:bg-surface-800 dark:text-white">
	<!-- Left side: List view -->
	<div class="w-[300px] p-4 overflow-y-auto border-r border-surface-300-600-token">
		<button on:click={generateRandomObject} class="mb-4 btn variant-filled-primary">
			Generate Random Object
		</button>

		{#if message.text}
			<div
				class={`p-2 mb-4 rounded ${
					message.type === 'success'
						? 'bg-success-100 text-success-800 dark:bg-success-700 dark:text-success-300'
						: 'bg-error-100 text-error-800 dark:bg-error-600 dark:text-error-300'
				}`}
			>
				{message.text}
			</div>
		{/if}

		{#if query}
			<ul class="space-y-4">
				{#each $query.data.db.sort(sortByTimestamp) as item}
					<li
						class="p-2 cursor-pointer card variant-filled-tertiary-200 dark:variant-filled-surface-700 hover:bg-tertiary-300 dark:hover:bg-surface-600"
						on:click={() => (selectedItem = item)}
					>
						<h3 class="font-semibold truncate text-md">{item.json.title}</h3>
						{#if item.json.author || item.json.version}
							<p class="text-xs truncat text-tertiary-400">
								{#if item.json.author}{item.json.author}{/if}
								{#if item.json.author && item.json.version} • {/if}
								{#if item.json.version}V{item.json.version}{/if}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<!-- Right side: Detail view -->
	<div class="flex-1 p-4 overflow-x-auto">
		{#if selectedItem}
			<h2 class="text-2xl font-bold">{selectedItem.json.title}</h2>
			<p class="mb-3 text-md text-tertiary-400">
				{selectedItem.json.description}
			</p>

			<div class="flex">
				<!-- First column: normal props -->
				<div class="flex flex-col max-w-xs p-4 border-r border-surface-300-600-token">
					<h3 class="mb-2 text-lg font-semibold">Metainfo</h3>
					{#if schemaInfo}
						<div
							class="flex flex-col p-2 mb-4 rounded cursor-pointer hover:bg-tertiary-200 dark:hover:bg-surface-700"
							on:click={() => loadSchema(schemaInfo.id)}
						>
							<span class="text-xs text-surface-500 dark:text-surface-400">Schema</span>
							<span class="text-sm font-semibold text-tertiary-100 dark:text-tertiary-200">
								{schemaInfo.title} v{schemaInfo.version ?? 0}
							</span>
							<span class="text-xs text-tertiary-400 dark:text-tertiary-400">
								{schemaInfo.description}
							</span>
						</div>
					{/if}
					{#each ['$id', 'author', 'version', 'prev'] as key}
						{#if selectedItem.json[key] !== undefined}
							<div class="flex flex-col mb-2">
								<span class="text-xs text-surface-500 dark:text-surface-400">
									{key}
								</span>
								<span class="text-sm text-tertiary-100 dark:text-tertiary-200">
									{key === '$id' ? truncateCID(selectedItem.json[key]) : selectedItem.json[key]}
								</span>
							</div>
						{/if}
					{/each}
				</div>
				<Properties
					properties={selectedItem.json.properties}
					required={selectedItem.json.required || []}
					{expandedProperties}
					on:toggleProperty={handleToggleProperty}
				/>
			</div>
		{:else}
			<p class="text-xl text-center">Select an item from the list to view details</p>
		{/if}
	</div>
</div>
