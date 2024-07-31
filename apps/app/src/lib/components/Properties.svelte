<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let properties: any;
	export let path: string[] = [];
	export let expandedProperties: string[] = [];

	function toggleProperty(propertyPath: string) {
		console.log('Properties: Toggling property', propertyPath);
		const isExpanded = expandedProperties.includes(propertyPath);
		console.log('Properties: Current expanded state', isExpanded);
		dispatch('toggleProperty', { path: propertyPath, expanded: !isExpanded });
	}

	function isExpanded(propertyPath: string) {
		return expandedProperties.includes(propertyPath);
	}

	function renderProperties(properties: any, path: string[] = []) {
		return Object.entries(properties).map(([key, value]) => ({
			key,
			value,
			isObj: typeof value === 'object' && value !== null,
			path: [...path, key].join('.')
		}));
	}

	let renderedProperties: ReturnType<typeof renderProperties>;

	$: {
		console.log('Properties: Rendered properties changed', properties);
		console.log('Properties: Current expandedProperties', expandedProperties);
		renderedProperties = renderProperties(properties, path);
	}
</script>

<div class="flex">
	<div class="flex flex-col max-w-xs p-4 border-r border-surface-300-600-token">
		{#each renderedProperties as prop (prop.path)}
			<div class="flex flex-col mb-2">
				<div class="flex items-center">
					<span class="px-1 text-white rounded-sm text-2xs bg-surface-700 dark:bg-surface-600">
						{typeof prop.value}
					</span>
					<span class="ml-1 text-sm font-semibold truncate text-surface-700 dark:text-surface-300">
						{prop.key}
					</span>
					{#if prop.isObj}
						<button
							class="ml-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
							on:click={() => toggleProperty(prop.path)}
						>
							{isExpanded(prop.path) ? '▼' : '▶'}
						</button>
					{/if}
				</div>
				<span class="text-xs truncate text-surface-600 dark:text-surface-400">
					{prop.isObj ? '' : JSON.stringify(prop.value)}
				</span>
			</div>
		{/each}
	</div>
	{#each renderedProperties as prop (prop.path)}
		{#if prop.isObj && isExpanded(prop.path)}
			<svelte:self
				properties={prop.value}
				path={prop.path.split('.')}
				{expandedProperties}
				on:toggleProperty
			/>
		{/if}
	{/each}
</div>
