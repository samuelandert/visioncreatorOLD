<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';
	import { view } from '$lib/views/UpdateName';
	import ComposeView from '$lib/components/ComposeView.svelte';
	import NewMandate from '$lib/components/NewMandate.svelte';

	interface ActionButtonsProps {
		me: {
			id: string;
		};
	}

	export let me: ActionButtonsProps['me'];

	let loading = false;
	let showComposeView = false;
	let showNewMandate = false;
	const dispatch = createEventDispatcher();

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
			dispatch('signout');
		};
	};

	const toggleComposeView = () => {
		showComposeView = !showComposeView;
		showNewMandate = false;
	};

	const toggleNewMandate = () => {
		showNewMandate = !showNewMandate;
		showComposeView = false;
	};
</script>

<div class="@container">
	{#if showComposeView}
		<div class="p-4">
			<ComposeView {view} on:close={toggleComposeView} />
		</div>
	{:else if showNewMandate}
		<div class="p-4">
			<NewMandate />
		</div>
	{:else}
		<div class="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 gap-2 mb-4">
			<form
				method="post"
				action="?/signout"
				use:enhance={handleSignOut}
				class="@sm:col-span-2 @md:col-span-1"
			>
				<button class="btn @sm:btn-sm @lg:btn-md variant-ghost-error w-full" disabled={loading}>
					Sign Out
				</button>
			</form>
			<button
				class="btn @sm:btn-sm @lg:btn-md variant-ghost-warning w-full"
				on:click={toggleComposeView}
				disabled={loading}
			>
				Update Name
			</button>
			<button
				class="btn @sm:btn-sm @lg:btn-md variant-ghost-secondary w-full"
				on:click={toggleNewMandate}
				disabled={loading}
			>
				Create Mandate
			</button>
		</div>
	{/if}
</div>
