<script lang="ts">
	import ComposeView from '$lib/components/ComposeView.svelte';
	import { page } from '$app/stores';

	// Get the component name from the URL parameter 'c', default to "Header"
	// /me/viewer?c=ComponentName
	$: componentName = $page.url.searchParams.get('c') || 'Header';

	$: view = {
		id: 'ComponentViewer',
		layout: {
			areas: `
			"main"
		`
		},
		children: [
			{
				id: 'xyz1',
				component: componentName,
				slot: 'main'
			}
		]
	};
</script>

<ComposeView {view} />
