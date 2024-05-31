<script lang="ts">
	import '../app.postcss';
	import { Drawer, AppShell, initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { client } from '$lib/wundergraph';

	export let data: LayoutData;

	initializeStores();
	const drawerStore = getDrawerStore();

	let { supabase, session, queryClient } = data;
	$: ({ supabase, session, queryClient } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	$: if (session?.access_token) {
		client.setAuthorizationToken(session.access_token);
	}
</script>

<QueryClientProvider client={queryClient}>
	<Drawer bgDrawer="bg-white" height="h-auto">
		<ComposeView view={$drawerStore.meta} />
	</Drawer>

	{#if session}
		<nav class="p-4 text-white bg-gray-800">
			<ul class="flex space-x-4">
				<li><a href="/" class="hover:text-gray-300">Home</a></li>
				<li><a href="/me/countries" class="hover:text-gray-300">Countries</a></li>
				<li><a href="/me/edit" class="hover:text-gray-300">Edit</a></li>
				<li><a href="/me/coda" class="hover:text-gray-300">Coda</a></li>
				<li><a href="/me/slube" class="hover:text-gray-300">Slube</a></li>
			</ul>
		</nav>
	{/if}

	<AppShell>
		<slot />
	</AppShell>
</QueryClientProvider>
