<script lang="ts">
	import { createQuery, createMutation } from '$lib/wundergraph';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { log } from '$lib/stores';

	export let me: { email: string; id: string };

	const newsletterStatus = createQuery({
		operationName: 'MyNewsletterStatus',
		input: {
			id: me.id,
			email: me.email
		}
	});

	const toggleNewsletterMutation = createMutation({
		operationName: 'ToggleNewsletter'
	});

	$: {
		if ($newsletterStatus.isSuccess) {
			log(
				'info',
				`Newsletter status loaded: ${$newsletterStatus.data ? 'Subscribed' : 'Not subscribed'}`,
				{ status: $newsletterStatus.data }
			);
		} else if ($newsletterStatus.isError) {
			log('error', `Error loading newsletter status: ${$newsletterStatus.error}`, {
				error: $newsletterStatus.error
			});
		}
	}

	const handleToggleNewsletter = async () => {
		try {
			log('info', 'Toggling newsletter subscription...', { id: me.id, email: me.email });
			const response = await $toggleNewsletterMutation.mutateAsync({
				id: me.id,
				email: me.email
			});
			log('success', `Newsletter subscription toggled.`, { response });
			await $newsletterStatus.refetch();
			log(
				'info',
				`Newsletter status refetched. New status: ${
					$newsletterStatus.data ? 'Subscribed' : 'Not subscribed'
				}`,
				{ newStatus: $newsletterStatus.data }
			);
		} catch (error) {
			log('error', `Error during newsletter toggle process`, { error });
			console.error('Error during newsletter toggle process:', error);
		}
	};
</script>

<div class="flex items-center p-4 space-x-4">
	{#if $newsletterStatus.isLoading}
		<span class="text-tertiary-500">Loading...</span>
	{:else if $newsletterStatus.isError}
		<span class="text-error-500">Error loading status</span>
	{:else}
		<SlideToggle
			name="newsletter-toggle"
			checked={$newsletterStatus.data}
			on:change={handleToggleNewsletter}
			active="bg-primary-500"
		/>
		<span class="text-tertiary-300">Newsletter</span>
	{/if}
</div>
