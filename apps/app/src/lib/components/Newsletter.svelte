<script lang="ts">
	import { createQuery, createMutation } from '$lib/wundergraph';
	import { SlideToggle } from '@skeletonlabs/skeleton';

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

	const handleToggleNewsletter = async () => {
		try {
			await $toggleNewsletterMutation.mutateAsync({
				id: me.id,
				email: me.email
			});
			$newsletterStatus.refetch();
		} catch (error) {
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
