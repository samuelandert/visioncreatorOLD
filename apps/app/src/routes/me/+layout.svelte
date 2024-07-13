<script lang="ts">
	import { writable } from 'svelte/store';
	import { Me, eventStream } from '$lib/stores';
	import { onMount } from 'svelte';
	import { log } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import { view } from '$lib/views/Default.js';

	export let data;

	let modalOpen = writable(false);
	let activeTab = writable('actions');
	let { session } = data;
	$: ({ session } = data);

	function setActiveTab(tab: string) {
		activeTab.set(tab);
		log('info', `Tab changed to: ${tab}`);
	}

	onMount(() => {
		const unsubscribe = eventStream.subscribe((events) => {
			const latestEvent = events[events.length - 1];
			if (latestEvent && latestEvent.type === 'updateMe') {
				setTimeout(() => {
					modalOpen.set(false);
					log('info', 'Modal closed after update');
				}, 1500);
			}
		});

		return () => {
			unsubscribe();
		};
	});

	function toggleModal(event?: MouseEvent) {
		if (!event || event.target === event.currentTarget) {
			modalOpen.update((n) => !n);
			log('info', `Modal ${$modalOpen ? 'opened' : 'closed'}`);
		}
	}
</script>

<div
	class={`@container overflow-hidden w-full h-full ${$modalOpen ? 'blur-md' : ''}`}
	style="-webkit-overflow-scrolling: touch;"
>
	<slot />
</div>

<button
	class="fixed z-40 flex items-center justify-center text-4xl rounded-full text-primary-900 bg-primary-500 w-14 h-14"
	class:hidden={$modalOpen}
	style="bottom: 1rem; left: calc(50% - 1.75rem);"
	on:click={toggleModal}
>
	+
</button>

{#if $modalOpen}
	<div
		class="fixed inset-0 flex items-end justify-center p-4 sm:p-6"
		on:click={toggleModal}
		transition:fade
	>
		{#if $Me}
			<div
				class="w-full max-w-6xl bg-surface-600 rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
				on:click|stopPropagation
			>
				<div class="flex flex-col flex-grow w-full h-full p-4 overflow-hidden">
					{#if $activeTab === 'actions'}
						<ActionButtons me={{ id: session.user.id }} />
					{:else if $activeTab === 'settings'}
						<Newsletter me={{ email: session.user.email, id: session.user.id }} />
					{:else if $activeTab === 'logs'}
						<div class="h-full overflow-hidden" style="display: contents;">
							<ComposeView {view} />
						</div>
					{/if}
				</div>

				<div class="flex items-center justify-between p-2 border-t border-surface-500">
					<ul class="flex flex-wrap text-sm font-medium text-center">
						<li class="mr-2">
							<a
								href="#"
								class={`inline-block p-4 rounded-t-lg ${
									$activeTab === 'actions'
										? 'text-primary-500 border-b-2 border-primary-500'
										: 'text-tertiary-400 hover:text-tertiary-300'
								}`}
								on:click|preventDefault={() => setActiveTab('actions')}
							>
								Actions
							</a>
						</li>
						<li class="mr-2">
							<a
								href="#"
								class={`inline-block p-4 rounded-t-lg ${
									$activeTab === 'settings'
										? 'text-primary-500 border-b-2 border-primary-500'
										: 'text-tertiary-400 hover:text-tertiary-300'
								}`}
								on:click|preventDefault={() => setActiveTab('settings')}
							>
								Settings
							</a>
						</li>
						<li class="mr-2">
							<a
								href="#"
								class={`inline-block p-4 rounded-t-lg ${
									$activeTab === 'logs'
										? 'text-primary-500 border-b-2 border-primary-500'
										: 'text-tertiary-400 hover:text-tertiary-300'
								}`}
								on:click|preventDefault={() => setActiveTab('logs')}
							>
								Logs
							</a>
						</li>
					</ul>
					<button
						class="p-2 text-tertiary-400 hover:text-tertiary-300"
						on:click={() => toggleModal()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
