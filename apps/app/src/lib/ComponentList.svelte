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
	<div class="w-48 h-full overflow-auto">
		{#each $components as component}
			<button
				class="block w-full p-1 text-left hover:bg-gray-200"
				on:click={() => updateChildren(component.value, selectedChildren.slot)}
			>
				{component.name}
			</button>
		{/each}
	</div>

	<div class="w-full h-full overflow-auto">
		<ComposeView {view} />
	</div>
</div>
