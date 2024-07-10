<script lang="ts">
	import ComposeView from '$lib/components/ComposeView.svelte';

	const view = {
		id: 'HelloEarth',
		layout: {
			areas: `
			"main"
		`
		},
		children: [
			{
				id: 'xyz1',
				component: 'Invoice',
				slot: 'main'
			}
		]
	};
</script>

<ComposeView {view} />
