<script lang="ts">
	import { onMount, writable } from 'svelte';
	import ComposeView from './components/ComposeView.svelte';

	let components = [];
	let selectedComponentName = writable(null); // Use a writable store for reactivity

	onMount(async () => {
		const modules = import.meta.glob('./components/*.svelte', { eager: true });
		components = Object.keys(modules).map((path) => {
			const name = path.split('/').pop().replace('.svelte', '');
			return {
				name,
				component: modules[path].default
			};
		});
		// Initialize selectedComponentName with the Green component
		const greenComponent = components.find((c) => c.name === 'Green');
		selectedComponentName.set(greenComponent ? greenComponent.name : null);
	});

	function selectComponent(componentName) {
		selectedComponentName.set(componentName);
	}

	// Reactive statement to update the view whenever selectedComponentName changes
	$: view = {
		id: 'xyz',
		layout: {
			areas: `
              "main"
          `
		},
		children: [
			{
				id: 'Countries',
				component: $selectedComponentName, 
				slot: 'main',
				queries: []
			}
		]
	};
</script>

<div class="flex-1 p-4 bg-gray-100 rounded">
	<select
		bind:value={$selectedComponentName}
		on:change={() => selectComponent($selectedComponentName)}
	>
		<option disabled>Select a component</option>
		{#each components as component}
			<option value={component.name}>{component.name}</option>
		{/each}
	</select>
	<ComposeView {view} />
</div>
