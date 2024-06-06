<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createSubscription } from '$lib/wundergraph';
	import { writable } from 'svelte/store';

	export let data;
	let loading = false;
	let modalOpen = writable(false);

	let { session } = data;
	$: ({ session } = data);

	const subscribeMe = createSubscription({
		operationName: 'subscribeMe',
		input: {
			userid: session.user.id
		}
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
			await $updateNameMutation.mutateAsync({ userid: session.user.id, fullName: newName });
		}
	};

	function toggleModal() {
		modalOpen.update((n) => !n);
	}
</script>

{#if $subscribeMe.isLoading}
	<p>Loading user details...</p>
{:else if $subscribeMe.isError}
	<p>Error: {$subscribeMe.error?.message}</p>
{:else}
	<div class="@container">
		<div class="flex items-center justify-center m-4 @3xl:m-10">
			<div class="w-full max-w-6xl shadow-xl bg-surface-800 rounded-3xl">
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
							<img
								src="https://source.unsplash.com/random/100x100"
								alt="Profile Image"
								class="w-24 h-24 mb-6 border-4 rounded-full border-surface-900"
							/>
							<h1 class="text-2xl text-5xl font-bold y">
								Welcome {$subscribeMe.data?.full_name}
							</h1>
							<p>ID: {$subscribeMe.data?.id}</p>
						</div>
					</div>
				</div>

				<div class="flex flex-col items-center p-8">
					<div class="flex justify-between w-full">
						<div class="text-center">
							<p class="mb-2 text-gray-400">Leaderboard Position</p>
							<p class="text-3xl font-semibold text-white">#5</p>
						</div>
						<div class="text-center">
							<p class="mb-2 text-gray-400">Monthly Income</p>
							<p class="text-3xl font-semibold text-white">$5,000</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<button
	class="fixed z-40 flex items-center justify-center text-4xl transform translate-x-1/2 rounded-full text-primary-900 right-1/2 bottom-5 bg-primary-500 w-14 h-14"
	on:click={toggleModal}>+</button
>

{#if $modalOpen}
	<div class="fixed inset-0 flex items-end justify-center mx-4 mb-24">
		<div class="w-full max-w-6xl p-8 rounded-3xl bg-surface-700">
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
