<script lang="ts">
	import { view as initialView } from '$lib/views/Countries';
	import { writable } from 'svelte/store';

	let selectedChildren = { ...initialView.children[0] }; // Create a new object
	let view = { ...initialView }; // Create a new object
	let selectedCode = selectedChildren.queries[0]?.input?.filter?.code?.eq || 'All';

	const components = writable([
		{ name: 'Countries', value: 'Countries' },
		{ name: 'Green', value: 'Green' },
		{ name: 'Levels', value: 'Levels' }
	]);

	const codes = writable([
		{ name: 'All', value: 'All' },
		{ name: 'Germany', value: 'DE' },
		{ name: 'Saudi Arabia', value: 'SA' },
		{ name: 'United States', value: 'US' },
		{ name: 'France', value: 'FR' },
		{ name: 'Australia', value: 'AU' },
		{ name: 'Canada', value: 'CA' }
	]);

	function updateChildren(component, slot) {
		view.children = [{ ...selectedChildren, component, slot }]; // Include queries when replacing the children array
	}

	function updateQueryCode(code) {
		if (code === 'All') {
			delete selectedChildren.queries[0].input.filter.code;
		} else {
			selectedChildren.queries[0].input.filter.code = { eq: code };
		}
		view.children = [{ ...selectedChildren }];
		selectedCode = selectedChildren.queries[0]?.input?.filter?.code?.eq || 'All';
	}
</script>

<div class="h-screen w-screen flex p-10">
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
		<label>
			<select bind:value={selectedCode} on:change={(e) => updateQueryCode(e.target.value)}>
				{#each $codes as code}
					<option value={code.value}>{code.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="w-3/4 h-full overflow-auto">
		<ComposeView {view} />
	</div>
</div>
