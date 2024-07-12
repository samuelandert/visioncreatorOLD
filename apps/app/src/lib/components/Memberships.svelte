<script lang="ts">
	import { createQuery } from '$lib/wundergraph';
	export let customerId: string;

	$: subscriptionsQuery = createQuery({
		operationName: 'ListSubscriptions',
		input: { customerId },
		enabled: !!customerId
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<h4 class="mb-2 h4">Memberships</h4>
{#if $subscriptionsQuery.isLoading}
	<p>Loading subscriptions...</p>
{:else if $subscriptionsQuery.error}
	<p class="text-error-500">Failed to load subscriptions</p>
{:else if $subscriptionsQuery.data?.subscriptions.length === 0}
	<p>No active memberships found.</p>
{:else}
	<ul>
		{#each $subscriptionsQuery.data?.subscriptions || [] as subscription}
			<li class="flex items-center justify-between p-2 bg-surface-100-800-token rounded-token">
				<div>
					<span class="font-semibold">{subscription.name}</span>
					<span
						class="ml-2 text-sm {subscription.status === 'active'
							? 'bg-green-500'
							: 'bg-red-500'} text-white px-2 py-1 rounded-full"
					>
						{subscription.status === 'active' ? 'Active' : 'Cancelled'}
					</span>
				</div>
				<div class="text-right">
					<span class="font-semibold">€{(subscription.amount / 100).toFixed(2)} per month</span>
					<br />
					<span class="text-sm text-surface-600-300-token">
						Created {formatDate(subscription.start_date)}
					</span>
				</div>
			</li>
		{/each}
	</ul>
{/if}
