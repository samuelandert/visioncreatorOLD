<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createMutation, createSubscription } from '$lib/wundergraph';
	import { writable } from 'svelte/store';
	import { createAvatar } from '@dicebear/core';
	import { lorelei } from '@dicebear/collection';

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

	function toggleModal(event?: MouseEvent) {
		if (!event || event.target === event.currentTarget) {
			modalOpen.update((n) => !n);
		}
	}

	let avatar = generateAvatar(session.user.id);

	let leaderboardData = [
		{ id: 'user1', name: 'Alice', invites: 5 },
		{ id: 'user2', name: 'Bob', invites: 3 },
		{ id: 'user3', name: 'Samuel', invites: 2 },
		{ id: 'user4', name: 'Charlie', invites: 1 },
		{ id: 'user5', name: 'Dave', invites: 0 }
	];

	leaderboardData = leaderboardData.map((user) => ({
		...user,
		profileImg: generateAvatar(user.id)
	}));

	export function generateAvatar(seed: string): string {
		return createAvatar(lorelei, {
			size: 128,
			seed: seed,
			mouth: [
				'happy01',
				'happy02',
				'happy03',
				'happy04',
				'happy05',
				'happy06',
				'happy07',
				'happy08',
				'happy09',
				'happy10',
				'happy11',
				'happy12',
				'happy13',
				'happy14',
				'happy15',
				'happy16',
				'happy17',
				'happy18'
			]
		}).toDataUriSync();
	}
</script>

{#if $subscribeMe.isLoading}
	<p>Loading user details...</p>
{:else if $subscribeMe.isError}
	<p>Error: {$subscribeMe.error?.message}</p>
{:else}
	<div
		class={`@container overflow-y-scroll h-screen ${$modalOpen ? 'blur-md' : ''}`}
		style="-webkit-overflow-scrolling: touch;"
	>
		<div class="flex flex-col items-center justify-center w-full p-4 space-y-4 @3xl:space-y-8">
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
								src={avatar}
								alt="Profile"
								class="w-24 h-24 mb-2 border-4 rounded-full bg-tertiary-500 border-tertiary-200"
							/>
							<h1 class="text-2xl @3xl:text-5xl font-bold h1">
								Welcome {$subscribeMe.data?.full_name}
							</h1>
							<p class="text-xs @3xl:text-xl">ID: {$subscribeMe.data?.id}</p>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-evenly p-4 @3xl:p-8 space-x-4">
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">#3</p>
						<p class="text-tertiary-700 text-sm @3xl:text-lg">Leaderboard</p>
					</div>
					<div class="text-center">
						<p class="text-xl @3xl:text-4xl font-semibold text-tertiary-400">125€/m</p>
						<p class="text-tertiary-700 text-sm @3xl:text-lg">Stream Potenzial</p>
					</div>
				</div>
			</div>
			<div class={`w-full max-w-6xl p-2 @3xl:p-6 overflow-auto rounded-3xl bg-surface-800`}>
				<ul class="space-y-2 @3xl:space-y-4">
					{#each leaderboardData as { name, profileImg, invites }, index}
						<li
							class={`flex items-center justify-between rounded-4xl  ${
								name === 'Samuel' ? 'bg-surface-600' : 'bg-surface-700'
							}`}
						>
							<img
								src={profileImg}
								alt="Profile Image"
								class={`w-12 h-12 @3xl:h-14 @3xl:w-14 rounded-full ${
									name === 'Samuel' ? 'bg-tertiary-500' : 'bg-surface-400'
								}`}
							/>
							<p class="flex-1 px-4 text-xl @3xl:text-2xl text-tertiary-400">{name}</p>
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
			</div>
		</div>
	</div>
{/if}

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
