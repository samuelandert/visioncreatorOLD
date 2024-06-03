<script lang="ts">
	import '../app.postcss';
	import { Drawer, AppShell, initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { client } from '$lib/wundergraph';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data: LayoutData;

	initializeStores();
	const drawerStore = getDrawerStore();

	let { supabase, session, queryClient, url } = data;
	$: ({ supabase, session, queryClient, url } = data);

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
		{#if $drawerStore.meta}
			<ComposeView view={$drawerStore.meta} />
		{:else}
			<div class="max-w-xl mx-auto my-4">
				<Auth
					supabaseClient={supabase}
					view="magic_link"
					redirectTo={`${url}/auth/callback`}
					showLinks={false}
					appearance={{
						theme: ThemeSupa
					}}
				/>
			</div>
		{/if}
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
