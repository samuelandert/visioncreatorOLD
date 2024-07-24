<script lang="ts">
	import { createMutation, createQuery } from '$lib/wundergraph';
	import { futureMe, Me } from '$lib/stores';
	import { onMount } from 'svelte';
	import { log } from '$lib/stores';
	import { view as profileView } from '$lib/views/Profile';
	import { view as leaderboardView } from '$lib/views/Leaderboard';

	export let data;

	let { session, supabase } = data;
	$: ({ session } = data);

	onMount(async () => {
		const supabaseMe = await supabase.auth.getUser();
		Me.update((store) => ({ ...store, id: supabaseMe.data.user?.id || '' }));

		if (
			!supabaseMe.data.user?.user_metadata.inviter &&
			!supabaseMe.data.user?.user_metadata.full_name
		) {
			try {
				const { data, error } = await supabase.auth.updateUser({
					data: { inviter: $futureMe.visionid, full_name: $futureMe.name || 'UpdateMyName' }
				});
				if (error) throw error;
				log('success', 'Supabase user metadata updated successfully');

				const updateNameResult = await $updateNameMutation.mutateAsync({
					id: session.user.id,
					full_name: $futureMe.name || 'MyName'
				});
				log('success', 'User name updated successfully', updateNameResult);

				const createInviteResult = await $createInviteMutation.mutateAsync({
					invitee: session.user.id,
					inviter: $futureMe.visionid
				});
				log('success', 'Invite created successfully', createInviteResult);

				// await $me.refetch();
				// await $leaderboard.refetch();
				log('success', 'Me and leaderboard data refreshed after invite creation');

				const toggleNewsletterResult = await $toggleNewsletterMutation.mutateAsync({
					id: session.user.id,
					email: session?.user.email
				});
				log('success', 'Newsletter preference updated successfully', toggleNewsletterResult);
			} catch (error) {
				log('error', 'Error during signup process', error);
				console.error('Error during signup process:', error);
			}
		}

		return () => {
			log('info', 'Me page unmounted');
		};
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

	const me = createQuery({
		operationName: 'queryMe',
		input: {
			id: session.user.id
		},
		liveQuery: true
	});

	// const leaderboard = createQuery({
	// 	operationName: 'queryLeaderboard',
	// 	liveQuery: true
	// });

	// $: if ($me.data) {
	// 	log('success', 'User data loaded', $me.data);
	// }

	// $: if ($leaderboard.data) {
	// 	log('success', 'Leaderboard data loaded', {
	// 		leaderboardData: $leaderboard.data
	// 	});
	// }
</script>

<div class="flex flex-col items-center justify-center w-full p-4 space-y-4 @3xl:space-y-8">
	<div class="w-full max-w-6xl bg-surface-800 rounded-3xl">
		<ComposeView view={profileView} />
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
		<ComposeView view={leaderboardView} />
		<!-- {#if $leaderboard.isLoading}
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
		{/if} -->
	</div>
</div>
