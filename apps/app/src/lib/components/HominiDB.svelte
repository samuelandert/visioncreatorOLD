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

	function isFieldRequired(schemaName, fieldName) {
		const schema = $query.data.schemas.find((s) => s.json?.oContext?.name === schemaName);
		if (!schema) return false;
		const requiredFields = schema.json.required || [];
		return requiredFields.includes(fieldName);
	}

	function getFieldType(schemaName, fieldName) {
		const schema = $query.data.schemas.find((s) => s.json?.oContext?.name === schemaName);
		if (!schema) return 'unknown';
		const fieldType = schema.json.properties[fieldName]?.type || 'unknown';
		return fieldType;
	}

	function sortByTimestamp(a, b) {
		return new Date(b.json.timestamp).getTime() - new Date(a.json.timestamp).getTime();
	}
</script>

<div class="p-8 overflow-scroll">
	<ul class="space-y-4">
		{#each $query.data.db.sort(sortByTimestamp) as item}
			{@const schemaInfo = parseSchemaInfo(item.json.$schema)}
			{@const schema = getSchemaByUri(item.json.$schema)}
			<li class="grid grid-cols-[200px_1fr] card variant-filled-surface">
				<aside class="p-4 border-r border-surface-300-600-token">
					<span class="block text-2xs text-surface-300">Schema</span>
					<h3 class="-mt-1 text-lg font-semibold">{schemaInfo.name}</h3>
					<span class="block text-2xs text-surface-300">Version</span>
					<span class="block -mt-1 text-sm">{schemaInfo.version}</span>
					<span class="block text-2xs text-surface-300">Author</span>
					<span class="block -mt-1 text-sm">{schemaInfo.author}</span>
					<span class="block text-2xs text-surface-300">CID</span>
					<span class="block -mt-1 text-sm">{schemaInfo.cid.slice(0, 10)}...</span>
					{#if schema?.json?.oContext?.prev}
						<span class="block text-2xs text-surface-300">Prev</span>
						<span class="block -mt-1 text-sm">{schema.json.oContext.prev.slice(0, 10)}...</span>
					{/if}
				</aside>

				<div class="p-4">
					{#if item.json.oContext}
						<div class="relative mb-2">
							<span class="block text-2xs text-surface-300">oContext</span>
							<div class="block px-2 -mb-1 text-sm rounded bg-surface-200-700-token">
								{#each Object.entries(item.json.oContext) as [subKey, subValue]}
									<div class="-py-1">
										<span class="text-2xs text-surface-300">{subKey}:</span>
										<span class="ml-1">{subValue}</span>
									</div>
								{/each}
							</div>
							<div class="absolute top-0 right-0 flex">
								{#if isFieldRequired(schemaInfo.name, 'oContext')}
									<span class="px-1 mr-1 text-white rounded-xl text-2xs bg-error-500">Required</span
									>
								{/if}
								<span class="px-1 text-white rounded-xl text-2xs bg-surface-700">
									{getFieldType(schemaInfo.name, 'oContext')}
								</span>
							</div>
						</div>
					{/if}
					{#each Object.entries(item.json) as [key, value]}
						{#if key !== '$schema' && key !== 'oContext'}
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
