<script lang="ts">
	import '../app.postcss';
	import { Drawer, AppShell, initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { client } from '$lib/wundergraph';
	import { Auth } from '@supabase/auth-ui-svelte';

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
	const vcAuthTheme = {
		default: {
			colors: {
				brand: '#e9c96e',
				brandAccent: '#f0d99a',
				brandButtonText: 'black',
				defaultButtonBackground: '#080808',
				defaultButtonBorder: 'black',
				defaultButtonText: 'white',
				dividerBackground: 'black',
				inputBackground: 'transparent',
				inputBorder: 'gray',
				inputText: 'white',
				inputPlaceholder: 'gray'
			},
			fonts: {
				bodyFontFamily: `'Poppins', sans-serif`,
				buttonFontFamily: `'Poppins', sans-serif`,
				inputFontFamily: `'Poppins', sans-serif`,
				labelFontFamily: `'Aclonica', sans-serif`
			},
			radii: {
				borderRadiusButton: '100px',
				buttonBorderRadius: '100px',
				inputBorderRadius: '100px'
			},
			space: {
				spaceSmall: '6px',
				spaceMedium: '10px',
				spaceLarge: '20px',
				labelBottomMargin: '8px',
				anchorBottomMargin: '4px',
				emailInputSpacing: '4px',
				socialAuthSpacing: '4px',
				buttonPadding: '10px 15px',
				inputPadding: '10px 15px'
			},
			fontSizes: {
				baseBodySize: '16px',
				baseInputSize: '18px',
				baseLabelSize: '20px',
				baseButtonSize: '18px'
			},
			borderWidths: {
				buttonBorderWidth: '0',
				inputBorderWidth: '1px'
			}
		}
	};
</script>

<QueryClientProvider client={queryClient}>
	<Drawer height="h-auto">
		{#if $drawerStore.meta}
			<ComposeView view={$drawerStore.meta} />
		{:else}
			<div class="max-w-xl mx-auto mt-10 mb-16">
				<Auth
					supabaseClient={supabase}
					view="magic_link"
					redirectTo={`${url}/auth/callback`}
					showLinks={false}
					theme="dark"
					appearance={{
						theme: vcAuthTheme
					}}
				/>
			</div>
		{/if}
	</Drawer>

	<AppShell>
		<slot />
	</AppShell>
</QueryClientProvider>

{#if !session}
	<footer class="fixed inset-x-0 bottom-0 p-4 text-xs text-center text-white">
		<button
			on:click={() =>
				drawerStore.open({
					position: 'bottom'
				})}
			class="mx-2">Login</button
		>
		<a href="/data-privacy" class="mx-2">Datenschutz</a>
		<a href="/terms-of-service" class="mx-2">AGB</a>
		<a href="/imprint" class="mx-2">Impressum</a>
	</footer>
{/if}
