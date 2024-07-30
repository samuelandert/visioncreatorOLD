<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import { slide } from 'svelte/transition';
	export let me;
	const query = $me.query;

	const insertDBMutation = createMutation({
		operationName: 'insertDB'
	});

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
	}

	async function generateRandomObject() {
		const result = await $insertDBMutation.mutateAsync({});
		if (result.success) {
			await $query.refetch();
		} else {
			console.error('Failed to generate random object:', result.error);
		}
	}

	function truncateCID(cid: string) {
		return cid.length > 15 ? `${cid.slice(0, 6)}...${cid.slice(-6)}` : cid;
	}

	let expandedProperties: Record<string, boolean> = {};

	function toggleProperty(key: string) {
		expandedProperties[key] = !expandedProperties[key];
		expandedProperties = { ...expandedProperties };
	}

	function renderProperty(key: string, value: any, required: string[]) {
		const isObj = typeof value === 'object' && value !== null;
		const isRequired = required.includes(key);
		return {
			key,
			value,
			isObj,
			isRequired,
			subProperties: isObj
				? Object.entries(value).map(([subKey, subValue]) =>
						renderProperty(subKey, subValue, value.required || [])
				  )
				: []
		};
	}
</script>

<div class="p-4 overflow-scroll text-gray-900 bg-tertiary-100 dark:bg-surface-900 dark:text-white">
	<button
		on:click={generateRandomObject}
		class="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
	>
		Generate Random Object
	</button>

	<ul class="space-y-4">
		{#each $query.data.db.sort(sortByTimestamp) as item}
			<li
				class="grid grid-cols-[200px_1fr_1fr] card variant-filled-tertiary-200 dark:variant-filled-surface-900"
			>
				<aside class="p-2 border-r border-surface-300-600-token">
					<h3 class="text-lg font-semibold">{item.json.title}</h3>
					<div class="space-y-0.5 text-xs">
						<div class="flex flex-col mb-2 leading-tight">
							<span class="text-xs text-tertiary-700 dark:text-tertiary-300"
								>{item.json.description}</span
							>
						</div>
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-600 dark:text-surface-300">$id</span>
							<span class="text-xs text-surface-900 dark:text-white"
								>{truncateCID(item.json.$id)}</span
							>
						</div>
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-600 dark:text-surface-300">$schema</span>
							<span class="text-xs text-surface-900 dark:text-white">{item.json.$schema}</span>
						</div>

						{#each Object.entries(item.json) as [key, value]}
							{#if !['$id', '$schema', 'title', 'description', 'properties', 'required'].includes(key)}
								<div class="flex flex-col leading-tight">
									<span class="text-2xs text-surface-600 dark:text-surface-300">{key}</span>
									<span class="text-xs text-surface-900 dark:text-white"
										>{JSON.stringify(value)}</span
									>
								</div>
							{/if}
						{/each}
					</div>
				</aside>
				<div class="p-2 bg-tertiary-200 dark:bg-surface-800">
					<div class="space-y-2">
						<h4 class="mb-2 text-lg font-semibold">Properties</h4>
						<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1">
							{#each Object.entries(item.json.properties || {}).map( ([key, value]) => renderProperty(key, value, item.json.required || []) ) as prop}
								<span
									class="px-1 text-white rounded-sm text-2xs bg-surface-700 dark:bg-surface-600"
								>
									{prop.isObj ? 'object' : typeof prop.value}
								</span>
								<span class="flex items-center text-xs text-surface-700 dark:text-surface-300">
									{prop.key}
									{#if prop.isRequired}
										<span class="px-1 ml-1 text-red-500 border border-red-500 rounded text-2xs"
											>*</span
										>
									{/if}
									{#if prop.isObj}
										<button
											class="ml-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
											on:click={() => toggleProperty(prop.key)}
										>
											{expandedProperties[prop.key] ? '▼' : '▶'}
										</button>
									{/if}
								</span>
								{#if !prop.isObj}
									<span class="text-xs text-surface-600 dark:text-surface-400"
										>{JSON.stringify(prop.value)}</span
									>
								{:else}
									<span />
								{/if}
							{/each}
						</div>
					</div>
				</div>
				<div class="p-2 border-l bg-tertiary-300 dark:bg-surface-700 border-surface-300-600-token">
					{#each Object.entries(item.json.properties || {}).map( ([key, value]) => renderProperty(key, value, item.json.required || []) ) as prop}
						{#if prop.isObj && expandedProperties[prop.key]}
							<div transition:slide>
								<h5 class="mb-2 text-lg font-semibold">{prop.key}</h5>
								<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1">
									{#each prop.subProperties as subProp}
										<span
											class="px-1 text-white rounded-sm text-2xs bg-surface-700 dark:bg-surface-600"
										>
											{subProp.isObj ? 'object' : typeof subProp.value}
										</span>
										<span class="text-xs text-surface-700 dark:text-surface-300">
											{subProp.key}
											{#if subProp.isRequired}
												<span class="px-1 ml-1 text-red-500 border border-red-500 rounded text-2xs"
													>*</span
												>
											{/if}
										</span>
										<span class="text-xs text-surface-600 dark:text-surface-400"
											>{JSON.stringify(subProp.value)}</span
										>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</div>
