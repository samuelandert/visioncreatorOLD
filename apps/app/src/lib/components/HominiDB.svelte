<script lang="ts">
	export let me;
	const query = $me.query;

	function parseSchemaInfo(schemaString) {
		try {
			const parts = schemaString.split('/');
			if (parts.length === 4) {
				return {
					author: parts[0],
					name: parts[1],
					version: parts[2],
					cid: parts[3]
				};
			}
			return { author: 'Unknown', name: 'Unknown', version: 'N/A', cid: 'Unknown' };
		} catch (error) {
			console.error('Error parsing schema:', error);
			return { author: 'Unknown', name: 'Unknown', version: 'N/A', cid: 'Unknown' };
		}
	}

	function getSchemaByUri(schemaUri) {
		const { cid } = parseSchemaInfo(schemaUri);
		return $query.data.schemas.find((s) => s.cid === cid);
	}

	function getFieldType(schema, fieldName) {
		if (!schema) return 'unknown';
		const fieldSchema = schema.json.properties[fieldName];
		if (!fieldSchema) return 'unknown';

		if (fieldSchema.type === 'array' && fieldSchema.items) {
			return `array[${fieldSchema.items.type}]`;
		}
		return fieldSchema.type || 'unknown';
	}

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
	}
</script>

<div class="p-4 overflow-scroll">
	<ul class="space-y-4">
		{#each $query.data.db.sort(sortByTimestamp) as item}
			{@const schemaInfo = parseSchemaInfo(item.json.$schema)}
			{@const schema = getSchemaByUri(item.json.$schema)}
			<li class="grid grid-cols-[200px_1fr] card variant-filled-surface">
				<aside class="p-2 border-r border-surface-300-600-token">
					<span class="-mt-4 text-2xs text-surface-300">Schema</span>
					<h3 class="mb-1 -mt-2 text-lg font-semibold">{schemaInfo.name} v{schemaInfo.version}</h3>
					<div class="space-y-0.5 text-xs">
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-300">Author</span>
							<span class="text-sm text-white">{schemaInfo.author}</span>
						</div>
						<div class="flex flex-col leading-tight">
							<span class="text-2xs text-surface-300">CID</span>
							<span class="text-sm text-white">{schemaInfo.cid.slice(0, 12)}...</span>
						</div>
						{#if schema?.json?.oContext?.prev}
							<div class="flex flex-col leading-tight">
								<span class="text-2xs text-surface-300">Prev</span>
								<span class="text-sm text-white">
									{schema.json.oContext.prev.split('/').slice(0, 3).join('/')}
								</span>
							</div>
						{/if}
					</div>
				</aside>
				<div class=" bg-surface-600">
					{#if item.json.oContext}
						<div class="p-2 mb-2 rounded bg-surface-700">
							<div class="flex items-center space-x-2 text-sm text-white">
								<p>
									<span class="text-xs text-surface-300">author</span>
									{item.json.oContext.author}
								</p>
								<p>
									<span class="text-xs text-surface-300">version</span>
									{item.json.oContext.version}
								</p>
								{#if item.json.oContext.prev !== null && item.json.oContext.prev !== 'null'}
									<span class="text-xs text-surface-300">prev</span>
									<span>{item.json.oContext.prev}</span>
								{/if}
							</div>
						</div>
					{/if}
					<div class="p-2 grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 text-sm -mt-2">
						{#each Object.entries(item.json) as [key, value]}
							{#if key !== '$schema' && key !== 'oContext'}
								<span class="px-1 text-white rounded-sm text-2xs bg-surface-700">
									{getFieldType(schema, key)}
								</span>
								<span class="text-xs text-surface-300">{key}</span>
								{#if typeof value === 'object' && value !== null}
									<span class="px-1 rounded bg-surface-200-700-token">
										{#each Object.entries(value) as [subKey, subValue], i}
											{subKey}: {subValue}{#if i < Object.entries(value).length - 1}, {/if}
										{/each}
									</span>
								{:else}
									<span>{value}</span>
								{/if}
							{/if}
						{/each}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
