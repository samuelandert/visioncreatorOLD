<script lang="ts">
	import '../app.postcss';
	import { Drawer, AppShell, initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { client } from '$lib/wundergraph';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { vcAuthTheme } from '$lib/themes/vcAuthTheme';
	import * as vcAuthLocalization from '$lib/themes/vcAuthLocalization.json';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { dev } from '$app/environment';
	import { fly } from 'svelte/transition';

	let authReady = writable(false);
	let isLoggerExpanded = writable(false);

	function toggleLogger() {
		isLoggerExpanded.update((value) => !value);
	}

	export let data: LayoutData;

	initializeStores();
	const drawerStore = getDrawerStore();

	let { supabase, session, queryClient, url } = data;
	$: ({ supabase, session, queryClient, url } = data);

	onMount(() => {
		drawerStore.subscribe((state) => {
			if (state.open && browser) {
				setTimeout(() => {
					authReady.set(true);
				}, 100);
				authReady.set(false);
			}
		});
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
	<Drawer height="h-auto">
		<div class="@container">
			{#if $drawerStore.meta}
				<ComposeView view={$drawerStore.meta} />
			{:else}
				<div class="max-w-xl mx-auto @3xl:my-16 p-6 max-h-full">
					<div
						class="flex flex-col items-center justify-center p-6 text-center shadow-md bg-surface-700 rounded-3xl"
					>
						<div class="h2 text-xl font-bold mb-2.5 @3xl:text-3xl">Newsletter</div>
						<p class="max-w-2xl text-md @3xl:text-lg">
							Erfahre wöchentliche Updates, wie wir uns entwickeln und wo du auf deiner Warteliste
							stehst, bis du von uns Eingeladen wirst.
						</p>
					</div>
					{#if $authReady}
						<Auth
							supabaseClient={supabase}
							view="magic_link"
							redirectTo={`${url}/auth/callback`}
							showLinks={false}
							theme="dark"
							appearance={{
								theme: vcAuthTheme
							}}
							localization={{
								variables: vcAuthLocalization
							}}
						/>{/if}
				</div>
			{/if}
			{#if dev}
				<div class="fixed z-50 transform -translate-x-1/2 bottom-4 left-1/2">
					<a
						href="http://127.0.0.1:54324/"
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-sm variant-ghost-secondary"
					>
						Open Mailbox
					</a>
				</div>
			{/if}
		</div>
	</Drawer>

	<AppShell>
		<div class="flex flex-col h-screen overflow-hidden md:flex-row">
			<main
				class="relative w-full h-full overflow-hidden {$isLoggerExpanded
					? 'hidden md:block md:w-3/4'
					: ''}"
			>
				<slot />
			</main>

			{#if $isLoggerExpanded}
				<aside
					class="w-full h-full p-4 overflow-y-auto md:w-1/4 bg-surface-700"
					transition:fly={{ duration: 300, x: 300 }}
				>
					<Logger />
				</aside>
			{/if}
		</div>
	</AppShell>

	<button
		class="fixed z-50 rounded-full bottom-4 right-4 btn-sm variant-ghost-secondary"
		on:click={toggleLogger}
	>
		{$isLoggerExpanded ? 'Close' : 'Logs'}
	</button>
</QueryClientProvider>

<!-- 
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
{/if} -->
