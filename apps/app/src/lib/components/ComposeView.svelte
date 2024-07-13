<script lang="ts">
	import { onDestroy } from 'svelte';
	import lodash from 'lodash';
	const { isEqual } = lodash;
	export let view: any;

	let composerInstance;
	let previousView;

	async function compose(element: HTMLElement, view: any) {
		if (composerInstance) {
			composerInstance.$destroy();
		}
		const module = await import(`./Composer.svelte`);
		composerInstance = new module.default({
			target: element,
			props: { composer: view }
		});
	}

	function composeAction(element: HTMLElement, view: any) {
		if (!isEqual(previousView, view)) {
			compose(element, view);
			previousView = { ...view };
		}
		return {
			update(view: any) {
				if (!isEqual(previousView, view)) {
					compose(element, view);
					previousView = { ...view };
				}
			}
		};
	}

	onDestroy(() => {
		if (composerInstance) {
			composerInstance.$destroy();
		}
	});
</script>

<div use:composeAction={view} class="grid w-full h-full overflow-hidden" />
