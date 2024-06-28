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
	</div>
	<div class="w-full h-full">
		<ComposeView {view} />
	</div>
</div>
