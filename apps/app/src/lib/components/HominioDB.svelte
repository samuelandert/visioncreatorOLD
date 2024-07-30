<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import { slide } from 'svelte/transition';
	export let me;

	$: query = $me?.query;

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
	}

	async function generateRandomObject() {
		const result = await $insertDBMutation.mutateAsync({});
		if (result.success) {
			await query.refetch();
		} else {
			console.error('Failed to generate random object:', result.error);
		}
	}

	function truncateCID(cid: string) {
		return cid.length > 15 ? `${cid.slice(0, 6)}...${cid.slice(-6)}` : cid;
	}

	function renderProperties(properties: any, required: string[] = []) {
		return Object.entries(properties).map(([key, value]) => ({
			key,
			value,
			isObj: typeof value === 'object' && value !== null && value.type === 'object',
			isRequired: required.includes(key)
		}));
	}

	let expandedProperties: Record<string, boolean> = {};

	function toggleProperty(key: string) {
		expandedProperties[key] = !expandedProperties[key];
		expandedProperties = { ...expandedProperties };
	}
</script>

<div class="p-4 overflow-scroll text-gray-900 bg-tertiary-100 dark:bg-surface-900 dark:text-white">
	<button
		on:click={generateRandomObject}
		class="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
	>
		Generate Random Object
	</button>

	{#if query}
		<ul class="space-y-4">
			{#each $query.data.db.sort(sortByTimestamp) as item}
				<li class="card variant-filled-tertiary-200 dark:variant-filled-surface-900">
					<div class="flex flex-col p-4 space-y-4">
						{#each Object.entries(item.json) as [key, value]}
							<div class="flex flex-col">
								<div class="flex items-center">
									<span
										class="px-1 text-white rounded-sm text-2xs bg-surface-700 dark:bg-surface-600"
									>
										{typeof value === 'object' && value !== null ? 'object' : typeof value}
									</span>
									<span class="ml-1 text-sm font-semibold text-surface-700 dark:text-surface-300">
										{key}
									</span>
									{#if ['$id', '$schema', 'title', 'author', 'properties'].includes(key)}
										<span class="px-1 ml-1 text-red-500 border border-red-500 rounded text-2xs"
											>*</span
										>
									{/if}
									{#if typeof value === 'object' && value !== null}
										<button
											class="ml-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
											on:click={() => toggleProperty(key)}
										>
											{expandedProperties[key] ? '▼' : '▶'}
										</button>
									{/if}
								</div>
								<span class="text-xs text-surface-600 dark:text-surface-400">
									{key === '$id'
										? 'The unique identifier for this schema'
										: key === 'prev'
										? 'The previous version of this schema, if any'
										: key === 'title'
										? 'The title of the schema'
										: key === 'author'
										? 'The author of the schema'
										: key === '$schema'
										? 'The JSON Schema version being used'
										: key === 'properties'
										? 'The properties defined by this schema'
										: key === 'description'
										? 'A description of the schema'
										: key === 'version'
										? 'The version number of this schema'
										: ''}
								</span>
								{#if typeof value !== 'object' || value === null}
									<span class="text-xs text-surface-900 dark:text-white">
										{key === '$id' ? truncateCID(value) : value}
									</span>
								{/if}
								{#if typeof value === 'object' && value !== null && expandedProperties[key]}
									<div class="mt-2 ml-4">
										{#each renderProperties(value, item.json.required || []) as prop}
											<div class="mt-2">
												<div class="flex items-center">
													<span
														class="px-1 text-white rounded-sm text-2xs bg-surface-700 dark:bg-surface-600"
													>
														{prop.isObj ? 'object' : prop.value.type}
													</span>
													<span class="ml-1 text-xs text-surface-700 dark:text-surface-300">
														{prop.key}
													</span>
													{#if prop.isRequired}
														<span
															class="px-1 ml-1 text-red-500 border border-red-500 rounded text-2xs"
															>*</span
														>
													{/if}
												</div>
												<span class="text-xs text-surface-600 dark:text-surface-400">
													{prop.value.description}
												</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
