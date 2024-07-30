<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
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

	function renderProperty(key: string, value: any, required: string[], depth: number = 0) {
		const isObj = typeof value === 'object' && value !== null;
		const isRequired = required.includes(key);
		return `
		<div class="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 text-sm" style="margin-left: ${
			depth * 16
		}px;">
		  <span class="px-1 text-white rounded-sm text-2xs bg-surface-700">
			${isObj ? 'object' : typeof value}
		  </span>
		  <span class="text-xs text-surface-300">
			${key}
			${
				isRequired
					? '<span class="px-1 ml-1 text-red-500 border border-red-500 rounded text-2xs">*</span>'
					: ''
			}
		  </span>
		  ${
				isObj
					? `<div class="ml-4">
				${Object.entries(value)
					.map(([subKey, subValue]) =>
						renderProperty(subKey, subValue, value.required || [], depth + 1)
					)
					.join('')}
			  </div>`
					: `<span>${JSON.stringify(value)}</span>`
			}
		</div>
	  `;
	}
</script>

<div class="p-4 overflow-scroll text-gray-900 bg-white dark:bg-gray-900 dark:text-white">
	<button
		on:click={generateRandomObject}
		class="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
	>
		Generate Random Object
	</button>

	<ul class="space-y-4">
		{#each $query.data.db.sort(sortByTimestamp) as item}
			<li class="grid grid-cols-[200px_1fr] card variant-filled-surface">
				<aside class="p-2 border-r border-surface-300-600-token">
					<h3 class="text-lg font-semibold">{item.json.title}</h3>
					<div class="space-y-0.5 text-xs">
						<div class="flex flex-col mb-2 leading-tight">
							<span class="text-xs text-tertiary-300">{item.json.description}</span>
						</div>
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-300">$id</span>
							<span class="text-xs text-white">{truncateCID(item.json.$id)}</span>
						</div>
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-300">$schema</span>
							<span class="text-xs text-white">{item.json.$schema}</span>
						</div>

						{#each Object.entries(item.json) as [key, value]}
							{#if !['$id', '$schema', 'title', 'description', 'properties', 'required'].includes(key)}
								<div class="flex flex-col leading-tight">
									<span class="text-2xs text-surface-300">{key}</span>
									<span class="text-xs text-white">{JSON.stringify(value)}</span>
								</div>
							{/if}
						{/each}
					</div>
				</aside>
				<div class="p-2 bg-surface-600">
					<div class="space-y-2">
						<h4 class="mb-2 text-lg font-semibold">Properties</h4>
						{@html Object.entries(item.json.properties || {})
							.map(([key, value]) => renderProperty(key, value, item.json.required || []))
							.join('')}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
