<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createQuery } from '$lib/wundergraph';
	import { writable } from 'svelte/store';
	import { futureMe } from '$lib/stores';

	export let data;
	let loading = false;
	let modalOpen = writable(false);

	let { session } = data;
	$: ({ session } = data);

	const me = createQuery({
		operationName: 'queryMe',
		input: {
			id: session.user.id
		},
		liveQuery: true
	});

	const leaderboard = createQuery({
		operationName: 'queryLeaderboard',
		liveQuery: true
	});

	const updateNameMutation = createMutation({
		operationName: 'updateMe'
	});

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};

	const handleUpdateName = async () => {
		const newName = prompt('Please enter your new name:');
		if (newName) {
			await $updateNameMutation.mutateAsync({ id: session.user.id, full_name: newName });
		}
	};

	function toggleModal(event?: MouseEvent) {
		if (!event || event.target === event.currentTarget) {
			modalOpen.update((n) => !n);
		}
	}

	let linkCopied = writable(false);

	async function copyInvitationLink() {
		const link = `https://localhost:3000/?visionid=${session.user.id}`;
		try {
			await navigator.clipboard.writeText(link);
			linkCopied.set(true);
			setTimeout(() => {
				linkCopied.set(false);
			}, 1000);
		} catch (err) {
			alert('Failed to copy the link.');
		}
	}

	// Watch for changes in subMe data and update if necessary
	$: if ($me.data && (!$me.data.full_name || $me.data.full_name === '')) {
		$updateNameMutation.mutateAsync({
			id: session.user.id,
			full_name: $futureMe.name
		});
	}
</script>

<div
	class={`@container overflow-y-scroll h-screen ${$modalOpen ? 'blur-md' : ''}`}
	style="-webkit-overflow-scrolling: touch;"
>
	<div class="flex flex-col items-center justify-center w-full p-4 space-y-4 @3xl:space-y-8">
		<div class="w-full max-w-6xl bg-surface-800 rounded-3xl">
			{#if $me.isLoading}
				<p class="flex items-center justify-center w-full p-10 h-72">Loading user details...</p>
			{:else if $me.isError}
				<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
					Error: {$me.error?.message}
				</p>
			{:else}
				<div
					class="relative text-center bg-center bg-cover rounded-t-3xl"
					style="background-image: url('/sun.jpeg');"
				>
					<div class="absolute inset-0 bg-opacity-40 bg-surface-900" />

					<div class="relative z-10 flex flex-col items-center text-tertiary-300">
						<div class="px-6 py-2 font-bold text-white bg-transparent text-md rounded-t-3xl">
							Profile
						</div>
						<div class="flex flex-col items-center p-8">
							<Avatar
								me={{
									data: { seed: $me.data?.id },
									design: { highlight: true },
									size: 'lg'
								}}
							/>
							<h1 class="text-2xl @3xl:text-5xl font-bold h1">
								Hey {$me.data?.full_name}
							</h1>
							<p class="text-md @3xl:text-2xl">Schön das du da bist</p>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-evenly p-4 @3xl:p-8 space-x-4">
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">3</p>
						<p class="text-tertiary-600 text-sm @3xl:text-lg">Leaderboard</p>
					</div>
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">125€/m</p>
						<p class="text-tertiary-600 text-sm @3xl:text-lg">Mein Stream Potenzial</p>
					</div>
				</div>
			{/if}
		</div>
		<div
			class={`w-full max-w-6xl p-2 @3xl:p-6 overflow-auto text-center rounded-3xl bg-surface-800 flex flex-col items-center justify-center space-y-4`}
		>
			<div class="flex flex-row items-center space-x-2">
				<button
					type="button"
					class="btn btn-sm @3xl:btn-lg variant-filled-primary"
					on:click={copyInvitationLink}>Einladung kopieren</button
				>
				<button type="button" class="btn btn-sm @3xl:btn-lg variant-ghost-primary">QR-Code</button>
			</div>
		</div>

		<div class={`w-full max-w-6xl p-2 @3xl:p-6 overflow-auto rounded-3xl bg-surface-800`}>
			{#if $leaderboard.isLoading}
				<p class="flex items-center justify-center w-full p-10 h-72">Loading user details...</p>
			{:else if $leaderboard.isError}
				<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
					Error: {$leaderboard.error?.message}
				</p>
			{:else}
				<ul class="space-y-2 @3xl:space-y-4">
					{#each $leaderboard.data as { name, id, invites }, index}
						<li
							class={`flex items-center justify-between rounded-4xl  ${
								id === session.user.id ? 'bg-surface-600' : 'bg-surface-700'
							}`}
						>
							<Avatar
								me={{
									data: { seed: id },
									design: { highlight: id === session.user.id },
									size: 'sm'
								}}
							/>

							<div class="flex-1 px-4 text-xl @3xl:text-2xl text-tertiary-400">
								{name}
							</div>

							<div class="flex justify-between px-4 @3xl:px-6 space-x-4 max-h-12">
								<div class="flex flex-col items-center text-right">
									<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
										{invites}
									</p>
									<p class="text-xxs @3xl:text-xs leading-none text-tertiary-700">invites</p>
								</div>

								<div class="flex flex-col items-center text-right">
									<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
										{index + 1}
									</p>
									<p class="text-xxs @3xl:text-xs leading-none text-tertiary-700">rank</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<button
	class="fixed z-40 flex items-center justify-center text-4xl transform translate-x-1/2 rounded-full text-primary-900 right-1/2 bottom-4 bg-primary-500 w-14 h-14 {$modalOpen
		? 'hidden sm:flex'
		: 'flex'}"
	on:click={toggleModal}
>
	+
</button>

{#if $modalOpen}
	<div
		class="fixed inset-0 flex items-end justify-center mx-4 mb-4 sm:mb-24"
		on:click={toggleModal}
	>
		<div class="w-full max-w-6xl p-4 @3xl:p-8 rounded-3xl bg-surface-600" on:click|stopPropagation>
			<div class="flex space-x-4">
				<form method="post" action="?/signout" use:enhance={handleSignOut}>
					<button
						class="px-4 py-2 font-bold rounded-full text-error-900 bg-error-500 hover:bg-error-400"
						disabled={loading}>Sign Out</button
					>
				</form>
				<button
					class="px-4 py-2 font-bold rounded-full text-warning-900 bg-warning-500 hover:bg-warning-400"
					on:click={handleUpdateName}
					disabled={loading}>Update Name</button
				>
			</div>
		</div>
	</div>
{/if}
