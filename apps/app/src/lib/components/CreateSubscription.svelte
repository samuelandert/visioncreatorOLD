<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { createMutation } from '$lib/wundergraph';

	export let mandateId: string;
	export let templateId: string = 'BRT00007Y68WKQJ';

	const createSubscriptionMutation = createMutation({
		operationName: 'CreateSubscription'
	});

	async function handleCreateSubscription() {
		await $createSubscriptionMutation.mutate({
			mandateId,
			templateId
		});
	}
</script>

<button
	class="mt-4 btn variant-filled-secondary"
	on:click={handleCreateSubscription}
	disabled={$createSubscriptionMutation.isLoading}
>
	{#if $createSubscriptionMutation.isLoading}
		<ProgressRadial width="w-6" />
	{:else}
		Subscribe
	{/if}
</button>

{#if $createSubscriptionMutation.error}
	<div class="mt-2 alert variant-filled-error">
		<p>{$createSubscriptionMutation.error.message}</p>
	</div>
{/if}

{#if $createSubscriptionMutation.isSuccess}
	<div class="mt-2 alert variant-filled-success">
		<p>Subscription created successfully!</p>
	</div>
{/if}
