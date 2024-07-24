<script lang="ts">
	import { createMutation, createQuery } from '$lib/wundergraph';
	import { futureMe, Me } from '$lib/stores';
	import { onMount } from 'svelte';
	import { log } from '$lib/stores';
	import { view as meView } from '$lib/views/Me';

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
</script>

{#if $me.isLoading}
	<p class="flex items-center justify-center w-full p-10 h-72">Loading view...</p>
{:else if $me.isError}
	<p class="flex items-center justify-center w-full p-10 h-72 text-error-500">
		Error: {$me.error?.message}
	</p>
{:else}
	<ComposeView view={meView} />
{/if}
