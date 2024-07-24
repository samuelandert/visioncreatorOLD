<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createComposerStore, getComposerStore } from '$lib/composables/composerStores';
	import { coreServices } from '$lib/composables/services';
	import Composer from './Composer.svelte';
	import { createQuery } from '../../lib/wundergraph';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Me } from '$lib/stores';
	import { get } from 'svelte/store';

	interface IComposerLayout {
		areas: string;
		columns?: string;
		rows?: string;
		gap?: string;
		style?: string;
	}

	interface IComposer {
		id: string;
		layout?: IComposerLayout;
		component?: string;
		slot?: string;
		children?: IComposer[];
		data?: Record<string, any>;
		queries?: { operation: string; input?: any }[];
		authID?: string;
	}

	export let composer: IComposer;
	let queryClient;

	let layoutStyle = '';
	let unsubscribers = [];

	$: {
		layoutStyle = computeLayoutStyle(composer?.layout);

		loadComponentAndInitializeState(composer);

		if (composer?.children) {
			composer.children.forEach((child) => {
				loadComponentAndInitializeState(child);
			});
		}
	}

	async function loadComponentAndInitializeState(component: IComposer) {
		if (!component || !component.component) return;

		if (component.id) {
			component.store = createComposerStore(component.id, component.store || {});
			if (component.data?.gql) {
				getComposerStore(component.id).update((storeValue) => {
					return {
						...storeValue,
						store: {
							...storeValue.store,
							...component.data.gql
						}
					};
				});
			}
		}

		// Initialize queries
		if (component.queries) {
			component.queries.forEach((query) => {
				let input = { ...query.input };

				// Replace 'authID' with actual user ID from Me store
				const currentUserId = get(Me).id;
				for (const key in input) {
					if (input[key] === 'authID') {
						input[key] = currentUserId;
					}
				}

				const queryInstance = createQuery({
					operationName: query.operation,
					input: input,
					liveQuery: true
				});
				getComposerStore(component.id).update((storeValue) => ({
					...storeValue,
					queries: {
						...storeValue.queries,
						[query.operation]: queryInstance
					}
				}));
			});
		}

		getComposerStore(component.id).update((storeValue) => ({
			...storeValue,
			id: component.id,
			do: {
				core: coreServices
			},
			data: component.data || {}
		}));

		if (component.children) {
			component.children.forEach(loadComponentAndInitializeState);
		}

		const components = import.meta.glob('/src/lib/components/*.svelte');
		const ComponentModule = component.component
			? (await components[`/src/lib/components/${component.component}.svelte`]()).default
			: null;
		if (!ComponentModule) {
			throw new Error(`Component ${component.component} not found`);
		}
		return ComponentModule;
	}

	function computeLayoutStyle(layout?: IComposerLayout): string {
		if (!layout) return '';
		return `
            grid-template-areas: ${layout.areas};
            ${layout.gap ? `gap: ${layout.gap};` : ''}
            ${layout.columns ? `grid-template-columns: ${layout.columns};` : ''}
            ${layout.rows ? `grid-template-rows: ${layout.rows};` : ''}
        `;
	}

	onDestroy(() => {
		unsubscribers.forEach((unsub) => unsub());
	});
</script>

<QueryClientProvider client={queryClient}>
	<div
		class={`grid w-full h-full overflow-hidden ${composer?.layout?.style || ''}`}
		style={layoutStyle}
	>
		{#await loadComponentAndInitializeState(composer) then Component}
			<svelte:component this={Component} id={composer.id} me={getComposerStore(composer.id)} />
		{/await}
		{#if composer?.children}
			{#each composer.children as child (child.id)}
				<div
					class="grid w-full h-full overflow-hidden ${composer?.layout?.style || ''}"
					style={`grid-area: ${child.slot}`}
				>
					{#await loadComponentAndInitializeState(child) then ChildComponent}
						<svelte:component this={ChildComponent} id={child.id} me={getComposerStore(child.id)} />
						{#if child.children && child.children.length}
							<Composer composer={child} />
						{/if}
					{/await}
				</div>
			{/each}
		{/if}
	</div>
</QueryClientProvider>
