<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createComposerStore, getComposerStore } from '$lib/composables/composerStores';
	import { coreServices } from '$lib/composables/services';
	import Composer from './Composer.svelte';
	import { createQuery } from '../../lib/wundergraph';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Me } from '$lib/stores';
	import { get } from 'svelte/store';
	import { eventBus } from '$lib/composables/eventBus';
	import { setupEventMapper } from '$lib/composables/eventMapper';

	interface IComposerLayout {
		areas?: string;
		columns?: string;
		rows?: string;
		gap?: string;
		style?: string;
		overflow?: 'hidden' | 'auto';
		scale?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	}

	interface IComposer {
		id: string;
		layout?: IComposerLayout;
		component?: string;
		slot?: string;
		children?: IComposer[];
		data?: Record<string, any>;
		map?: any;
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

	onMount(() => {
		setupEventMapper();
	});

	async function loadComponentAndInitializeState(component: IComposer) {
		if (!component || !component.component) return;

		const currentUserId = get(Me).id;

		if (component.id) {
			component.store = createComposerStore(component.id, component.store || {});
		}

		// Initialize query
		if (component.map) {
			const queryInstance = createQuery({
				operationName: 'queryComposer',
				input: {
					id: currentUserId, // Always pass the current user ID
					map: component.map
				},
				liveQuery: true
			});
			getComposerStore(component.id).update((storeValue) => ({
				...storeValue,
				query: queryInstance
			}));
		}

		getComposerStore(component.id).update((storeValue) => ({
			...storeValue,
			id: component.id,
			authID: currentUserId,
			do: {
				core: coreServices,
				emit: (event: string, ...args: any[]) => eventBus.emit(event, component.id, ...args)
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
	function getScaleStyle(scale?: string): string {
		if (!scale) return '';
		const scaleMap = {
			xs: 'width: 320px; transform: scale(0.3125);', // 320px
			sm: 'width: 480px; transform: scale(0.46875);', // 480px
			md: 'width: 768px; transform: scale(0.75);', // 768px
			lg: 'width: 1024px; transform: scale(1);', // 1024px
			xl: 'width: 1280px; transform: scale(1.25);', // 1280px
			'2xl': 'width: 1600px; transform: scale(1.5625);' // 1600px
		};
		return scaleMap[scale] || '';
	}

	onDestroy(() => {
		unsubscribers.forEach((unsub) => unsub());
	});
</script>

<QueryClientProvider client={queryClient}>
	<div
		class={`grid w-full h-full ${
			composer?.layout?.overflow ? `overflow-${composer.layout.overflow}` : ''
		} ${composer?.layout?.style || ''}`}
		style={layoutStyle}
	>
		<div style={getScaleStyle(composer?.layout?.scale)} class="origin-top-left">
			{#await loadComponentAndInitializeState(composer) then Component}
				<svelte:component this={Component} me={getComposerStore(composer.id)} />
			{/await}
		</div>
		{#if composer?.children}
			{#each composer.children as child (child.id)}
				<div
					class={`grid w-full h-full ${
						child.layout?.overflow ? `overflow-${child.layout.overflow}` : ''
					} ${child.layout?.style || ''}`}
					style={`grid-area: ${child.slot};`}
				>
					<div style={getScaleStyle(child.layout?.scale)} class="origin-top-left">
						{#await loadComponentAndInitializeState(child) then ChildComponent}
							<svelte:component this={ChildComponent} me={getComposerStore(child.id)} />
							{#if child.children && child.children.length}
								<Composer composer={child} />
							{/if}
						{/await}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</QueryClientProvider>
