<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createQuery } from '$lib/wundergraph';

	export let data;
	let loading = false;

	let { session } = data;
	$: ({ session } = data);

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};

	const getUserDetailsQuery = createQuery({
		operationName: 'getMe',
		input: {
			userid: session.user.id
		}
	});
</script>

{#if $getUserDetailsQuery.isLoading}
	{#if $getUserDetailsQuery.failureReason}
		{$getUserDetailsQuery.failureReason.message}
	{:else}
		<p>Loading user details...</p>
	{/if}
{:else if $getUserDetailsQuery.error}
	{$getUserDetailsQuery.error.message}
{:else if $getUserDetailsQuery.data}
	<div class="m-10">
		<p class="pb-8 text-2xl">Welcome {$getUserDetailsQuery.data.fullName}</p>
		<!-- <img src={$getUserDetailsQuery.data.avatarUrl} alt="User Avatar" /> -->
		<form method="post" action="?/signout" use:enhance={handleSignOut}>
			<button
				class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 disabled:bg-blue-300"
				disabled={loading}>Sign Out</button
			>
		</form>
	</div>
{:else}
	Nothing to see here
{/if}
