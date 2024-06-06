<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createSubscription } from '$lib/wundergraph';

	export let data;
	let loading = false;

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
					<div class="flex justify-between w-full mt-4">
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
		<form method="post" class="py-6" action="?/signout" use:enhance={handleSignOut}>
			<button
				class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
				disabled={loading}>Sign Out</button
			>
		</form>
		<button
			class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
			on:click={handleUpdateName}
			disabled={loading}>Update Name</button
		>
	</div>
{/if}
