<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

	const calcCID = createMutation({
		operationName: 'calculateCID'
	});

	async function handleCalcCID() {
		const result = await $calcCID.mutateAsync({
			json: originalSchema
		});
		if (result) {
			updatedSchema = result.json;
		} else {
			console.error('Failed to calculate CID');
		}
	}

	const originalSchema = {
		$schema: 'https://json-schema.org/draft/2020-12/schema',
		title: 'Product',
		description: 'A product in the catalog',
		type: 'object',
		properties: {
			id: {
				description: 'The unique identifier for a product',
				type: 'integer'
			},
			name: {
				description: 'Name of the product',
				type: 'string'
			}
		},
		required: ['id', 'name']
	};

	let updatedSchema = null;
</script>

<div class="p-4 text-white bg-gray-900">
	<button
		on:click={handleCalcCID}
		class="px-4 py-2 mb-4 text-base text-white transition-colors duration-200 bg-green-600 border-none rounded cursor-pointer hover:bg-green-700"
	>
		Calculate CID
	</button>

	<div class="flex gap-4">
		<div class="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg">
			<h3 class="mt-0 mb-2 text-xl">Original Schema</h3>
			<pre class="p-2 text-sm break-words whitespace-pre-wrap bg-gray-700 rounded-md">
				{JSON.stringify(originalSchema, null, 2)}
			</pre>
		</div>

		<div class="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg">
			<h3 class="mt-0 mb-2 text-xl">Updated Schema with CID</h3>
			{#if updatedSchema}
				<pre class="p-2 text-sm break-words whitespace-pre-wrap bg-gray-700 rounded-md">
					{JSON.stringify(updatedSchema, null, 2)}
				</pre>
			{:else}
				<p class="text-gray-400">Click the button to calculate CID</p>
			{/if}
		</div>
	</div>
</div>
