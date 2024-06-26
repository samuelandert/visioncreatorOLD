<script lang="ts">
	import { view as initialView } from '$lib/views/Countries';
	import { writable } from 'svelte/store';

	let selectedChildren = { ...initialView.children[0] };
	let view = { ...initialView };

	// Dynamically import component names from the components folder
	let components = writable([]);

	// Function to load component names
	async function loadComponentNames() {
		const componentFiles = import.meta.glob('$lib/components/*.svelte');
		const componentNames = [];
		for (const path in componentFiles) {
			const name = path.split('/').pop().replace('.svelte', '');
			componentNames.push({ name, value: name });
		}
		components.set(componentNames);
	}

	onMount(() => {
		loadComponentNames();
	});

	function updateChildren(component, slot) {
		view.children = [{ ...selectedChildren, component, slot }];
	}
</script>

<div class="flex w-screen h-screen p-10">
	<div class="w-1/4 h-full overflow-auto">
		<label>
			<select
				bind:value={selectedChildren.component}
				on:change={(e) => updateChildren(e.target.value, selectedChildren.slot)}
			>
				{#each $components as component}
					<option value={component.value}>{component.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="w-3/4 h-full overflow-auto">
		<ComposeView {view} />
	</div>
</div>
