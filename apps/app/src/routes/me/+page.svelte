<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createQuery, createMutation } from '$lib/wundergraph';

	export let data;
	let loading = false;

	let { session } = data;
	$: ({ session } = data);

	const getUserDetailsQuery = createQuery({
		operationName: 'getMe',
		input: {
			userid: session.user.id
		},
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
			await $updateNameMutation.mutateAsync({ userid: session.user.id, fullName: newName });
		}
	};
</script>

{#if $getUserDetailsQuery.isLoading}
	<p>Loading user details...</p>
{:else if $getUserDetailsQuery.error}
	{$getUserDetailsQuery.error.message}
{:else if $getUserDetailsQuery.data}
	<div class="m-10">
		<p class="pb-8 text-2xl">Welcome {$getUserDetailsQuery.data.fullName}</p>
		<form method="post" action="?/signout" use:enhance={handleSignOut}>
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
{:else}
	Nothing to see here
{/if}
