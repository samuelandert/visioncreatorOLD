<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createQuery } from '$lib/wundergraph';
	import { writable } from 'svelte/store';
	import { futureMe } from '$lib/stores';
	import { onMount } from 'svelte';

	export let data;

	let loading = false;
	let modalOpen = writable(false);

	let { session, supabase } = data;
	$: ({ session } = data);

	onMount(async () => {
		const supabaseMe = await supabase.auth.getUser();
		if (
			!supabaseMe.data.user?.user_metadata.inviter &&
			!supabaseMe.data.user?.user_metadata.full_name
		) {
			try {
				const { data, error } = await supabase.auth.updateUser({
					data: { inviter: $futureMe.visionid, full_name: $futureMe.name || 'UpdateMyName' }
				});
				if (error) throw error;
				await $updateNameMutation.mutateAsync({
					id: session.user.id,
					full_name: $futureMe.name || 'MyName'
				});
				await $createInviteMutation.mutateAsync({
					invitee: session.user.id,
					inviter: $futureMe.visionid
				});
				await $toggleNewsletterMutation.mutateAsync({
					id: session.user.id,
					email: session?.user.email
				});
			} catch (error) {
				console.error('Error during signup process:', error);
			}
		}
	});

	const me = createQuery({
		operationName: 'queryMe',
		input: {
			id: session.user.id
		},
		liveQuery: true
	});

	// const callEdgeFunction = async () => {
	// 	try {
	// 		const requestBody = JSON.stringify({ name: 'Functions' });
	// 		console.log('Request body:', requestBody); // Log the request body

	// 		const response = await fetch('http://127.0.0.1:54321/functions/v1/hello', {
	// 			method: 'POST',
	// 			headers: {
	// 				Authorization:
	// 					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: requestBody // Ensure the body is correctly formatted
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! status: ${response.status}`);
	// 		}

	// 		const result = await response.json();
	// 		alert(JSON.stringify(result));
	// 	} catch (error) {
	// 		console.error('Error calling edge function:', error);
	// 	}
	// };

	const leaderboard = createQuery({
		operationName: 'queryLeaderboard',
		liveQuery: true
	});

	const newsletterStatus = createQuery({
		operationName: 'MyNewsletterStatus',
		input: {
			id: session.user.id,
			email: session.user.email
		}
	});

	const updateNameMutation = createMutation({
		operationName: 'updateMe'
	});

	const createInviteMutation = createMutation({
		operationName: 'createInvite'
	});

	const toggleNewsletterMutation = createMutation({
		operationName: 'ToggleNewsletter'
	});

	const handleToggleNewsletter = async () => {
		try {
			await $toggleNewsletterMutation.mutateAsync({
				id: session.user.id,
				email: session?.user.email
			});
			$newsletterStatus.refetch();
		} catch (error) {
			console.error('Error during newsletter toggle process:', error);
		}
	};

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
			$me.refetch();
			modalOpen.set(false);
		}
	};

	function toggleModal(event?: MouseEvent) {
		if (!event || event.target === event.currentTarget) {
			modalOpen.update((n) => !n);
		}
	}

	$: userRank =
		$leaderboard.data?.findIndex((entry) => entry.id === session.user.id) + 1 || 'rechnet...';

	$: streamPotential =
		($leaderboard.data?.find((entry) => entry.id === session.user.id)?.suminvites || 0) * 5;
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
								Hey {$me.data?.full_name || $futureMe.name}
							</h1>
							<p class="text-md @3xl:text-2xl">Schön das du da bist</p>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-evenly p-4 @3xl:p-8 space-x-4">
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">{userRank}</p>
						<p class="text-tertiary-600 text-sm @3xl:text-lg">Warte Position</p>
					</div>
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">
							{streamPotential}€/m
						</p>
						<p class="text-tertiary-600 text-sm @3xl:text-lg">Stream Potenzial</p>
					</div>
				</div>
			{/if}
		</div>
		{#if $me.isLoading}
			<p class="flex items-center justify-center w-full p-10 h-72">Loading user details...</p>
		{:else if $me.isError}
			<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
				Error: {$me.error?.message}
			</p>
		{:else}
			<InviteCard userId={session.user.id} />
		{/if}

		<div class={`w-full max-w-6xl p-2 @3xl:p-6 overflow-auto rounded-3xl bg-surface-800`}>
			{#if $leaderboard.isLoading}
				<p class="flex items-center justify-center w-full p-10 h-72">Loading user details...</p>
			{:else if $leaderboard.isError}
				<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
					Error: {$leaderboard.error?.message}
				</p>
			{:else}
				<ul class="space-y-2 @3xl:space-y-4">
					{#each $leaderboard.data as { name, id, suminvites }, index}
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
								{name || $futureMe.name}
							</div>

							<div class="flex justify-between px-4 @3xl:px-6 space-x-4 max-h-12">
								<div class="flex flex-col items-center text-right">
									<p class="text-tertiary-400 text-xl @3xl:text-2xl font-semibold leading-tight">
										{suminvites}
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
		{#if $me.data}
			<div
				class="w-full max-w-6xl p-4 @3xl:p-8 rounded-3xl bg-surface-600"
				on:click|stopPropagation
			>
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
					<div class="flex items-center space-x-4">
						<span class="text-tertiary-300">Newsletter Subscription:</span>
						{#if $newsletterStatus.isLoading}
							<span class="text-tertiary-500">Loading...</span>
						{:else if $newsletterStatus.isError}
							<span class="text-error-500">Error loading status</span>
						{:else}
							<label class="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									class="sr-only peer"
									checked={$newsletterStatus.data}
									on:change={handleToggleNewsletter}
									disabled={$toggleNewsletterMutation.isLoading}
								/>
								<div
									class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
								/>
							</label>
						{/if}
					</div>
				</div>
				<!-- <button
					class="px-4 py-2 font-bold rounded-full text-warning-900 bg-warning-500 hover:bg-warning-400"
					on:click={callEdgeFunction}
				>
					Call Function
				</button> -->
			</div>
		{/if}
	</div>
{/if}
