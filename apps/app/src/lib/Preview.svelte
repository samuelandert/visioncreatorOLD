<script lang="ts">
	import { view as initialView } from '$lib/views/Default';
	import { writable } from 'svelte/store';

	let selectedChildren = { ...initialView.children[0] };
	let view = { ...initialView };

	let components = writable([]);

	async function loadComponentNames() {
		const componentFiles = import.meta.glob('$lib/components/*.svelte');
		const componentNames = [];
		for (const path in componentFiles) {
			const name = path.split('/').pop().replace('.svelte', '');
			if (name.startsWith('o-') || name === 'Claude') {
				componentNames.push({ name, value: name });
			}
		}
		components.set(componentNames);
	}

	onMount(() => {
		loadComponentNames();
	});

	function updateChildren(component, slot) {
		view.children = [{ ...selectedChildren, component, slot }];
	}

	async function saveComponent() {
		let name = prompt('Enter the name for the new component:');
		if (!name) return;

		name = name.charAt(0).toUpperCase() + name.slice(1);

		const response = await fetch('/api/save-component', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});

		if (response.ok) {
			alert('Component saved successfully!');
			loadComponentNames(); // Refresh the component list
		} else {
			alert('Error saving component.');
		}
	}
</script>

<div class="flex w-full h-full">
	<div class="w-48 h-full py-10 pr-5 overflow-y-scroll bg-surface-900">
		{#each $components as component}
			<button
				class="block w-full p-1 text-left hover:bg-gray-200"
				on:click={() => updateChildren(component.value, selectedChildren.slot)}
			>
				{component.name}
			</button>
		{/each}
		<button
			on:click={saveComponent}
			type="submit"
			class="w-full p-2 rounded-full text-surface-800 bg-primary-500">Save</button
		>
	</div>
	<div class="w-full h-full p-4 bg-surface-900">
		<div class="w-full h-full overflow-hidden rounded-2xl">
			<ComposeView {view} />
		</div>
	</div>
</div>
