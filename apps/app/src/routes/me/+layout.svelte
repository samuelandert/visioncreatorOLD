<script lang="ts">
	import { writable } from 'svelte/store';
	import { Me, eventStream } from '$lib/stores';
	import { onMount } from 'svelte';
	import { log } from '$lib/stores';

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
	class={`@container h-full ${$modalOpen ? 'blur-md' : ''}`}
	style="-webkit-overflow-scrolling: touch;"
>
	<slot />
</div>

<button
	class="fixed z-40 flex items-center justify-center text-4xl rounded-full text-primary-900 bg-primary-500 w-14 h-14 {$modalOpen
		? 'hidden sm:flex'
		: 'flex'}"
	style="bottom: 1rem; left: calc(50% - 1.75rem);"
	on:click={toggleModal}
>
	+
</button>

{#if $modalOpen}
	<div
		class="absolute inset-0 flex items-end justify-center mx-4 mb-4 sm:mb-24"
		on:click={toggleModal}
	>
		{#if $Me}
			<div
				class="w-full max-h-full max-w-6xl p-4 @3xl:p-8 rounded-3xl bg-surface-600"
				on:click|stopPropagation
			>
				{#if $activeTab === 'actions'}
					<ActionButtons me={{ id: session.user.id }} />
				{:else if $activeTab === 'settings'}
					<Newsletter me={{ email: session.user.email, id: session.user.id }} />
				{/if}

				<div class="border-t border-surface-500">
					<ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
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
					</ul>
				</div>
			</div>
		{/if}
	</div>
{/if}
