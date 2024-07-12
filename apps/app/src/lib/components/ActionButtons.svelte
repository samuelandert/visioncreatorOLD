<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';
	import { view } from '$lib/views/UpdateName';
	import ComposeView from '$lib/components/ComposeView.svelte';

	interface ActionButtonsProps {
		me: {
			id: string;
		};
	}

	export let me: ActionButtonsProps['me'];

	let loading = false;
	let showComposeView = false;
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
	};
</script>

{#if showComposeView}
	<div class="p-4">
		<ComposeView {view} on:close={toggleComposeView} />
	</div>
{:else}
	<div class="flex justify-center mb-4 space-x-4">
		<form method="post" action="?/signout" use:enhance={handleSignOut}>
			<button class="btn variant-ghost-error" disabled={loading}>Sign Out</button>
		</form>
		<button class="btn variant-ghost-warning" on:click={toggleComposeView} disabled={loading}
			>Update Name</button
		>
	</div>
{/if}
