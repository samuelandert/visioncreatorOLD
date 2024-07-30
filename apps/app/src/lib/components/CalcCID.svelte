<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

	const calcCID = createMutation({
		operationName: 'calculateCID'
	});

	let inputSchema = JSON.stringify(
		{
			$id: 'https://alpha.ipfs.homin.io/QmQYe7kS3esrZA6ErybjEx86ug4C1LqquPtxxaFNicyfPf',
			type: 'object',
			title: 'The Schema',
			$schema: 'http://json-schema.org/draft-07/schema#',
			required: ['$schema', '$id', 'prev', 'author', 'version'],
			properties: {
				$id: {
					type: 'string',
					format: 'uri'
				},
				$schema: {
					type: 'string',
					format: 'uri'
				},
				author: {
					type: 'string'
				},
				prev: {
					type: 'string',
					format: 'uri'
				},
				version: {
					type: 'integer'
				}
			},
			description: 'A meta schema',
			additionalProperties: false
		},
		null,
		2
	);

	let updatedSchema = null;
	let error = null;

	async function handleCalcCID() {
		try {
			const parsedSchema = JSON.parse(inputSchema);
			const result = await $calcCID.mutateAsync({
				json: parsedSchema
			});
			if (result) {
				updatedSchema = result.json;
				error = null;
			} else {
				error = 'Failed to calculate CID';
			}
		} catch (e) {
			error = `Error: ${e.message}`;
		}
	}
</script>

<div class="p-4 text-gray-900 bg-white dark:bg-gray-900 dark:text-white">
	<div class="flex flex-col gap-4 md:flex-row">
		<div class="flex-1">
			<h3 class="mt-0 mb-2 text-xl">Input Schema</h3>
			<textarea
				bind:value={inputSchema}
				class="w-full p-2 font-mono text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 h-96"
			/>
		</div>
		<div class="flex-1">
			<h3 class="mt-0 mb-2 text-xl">Updated Schema with CID</h3>
			{#if updatedSchema}
				<pre
					class="p-2 overflow-auto text-sm break-words whitespace-pre-wrap bg-gray-100 rounded-md dark:bg-gray-800 h-96">
					{JSON.stringify(updatedSchema, null, 2)}
				</pre>
			{:else}
				<p class="text-gray-400 dark:text-gray-500">Click the button to calculate CID</p>
			{/if}
		</div>
	</div>

	<div class="flex justify-center mt-4">
		<button
			on:click={handleCalcCID}
			class="px-4 py-2 text-base text-white transition-colors duration-200 bg-green-600 border-none rounded cursor-pointer dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
		>
			Calculate CID
		</button>
	</div>

	{#if error}
		<div
			class="p-2 mt-4 text-red-500 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:border-red-700"
		>
			{error}
		</div>
	{/if}
</div>
