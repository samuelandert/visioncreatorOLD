<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
	import { view } from '$lib/views/Form';
	import ComposeView from './ComposeView.svelte';

	function openDrawer() {
		drawerStore.open({
			position: 'bottom',
			meta: view
		});
	}
</script>

<button class="mt-6 btn variant-filled-primary btn-lg" on:click={openDrawer}> Open Modal </button>
