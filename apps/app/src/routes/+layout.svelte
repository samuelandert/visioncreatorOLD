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

	<AppShell>
		<slot />
	</AppShell>
</QueryClientProvider>

<footer class="fixed inset-x-0 bottom-0 p-4 text-xs text-center text-white">
	<a href="/me" class="mx-2">Login</a>
	<a href="/data-privacy" class="mx-2">Datenschutz</a>
	<a href="/terms-of-service" class="mx-2">AGB</a>
	<a href="/imprint" class="mx-2">Impressum</a>
</footer>
