<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
	import { view } from '$lib/views/Form';

	function openDrawer() {
		drawerStore.open({
			position: 'bottom',
			meta: view
		});
	}
</script>

<button class="btn variant-filled-primary btn-lg mt-6" on:click={openDrawer}> Open Modal </button>
