<script lang="ts">
	export let customerId: string;

	let subscriptions: any[] = [];
	let loading = false;
	let error: string | null = null;

	$: if (customerId) {
		loadSubscriptions(customerId);
	}

	async function loadSubscriptions(customerId: string) {
		console.log('Loading subscriptions for customer ID:', customerId);
		loading = true;
		error = null;
		try {
			const response = await fetch(`/api/gocardless/subscriptions?customerId=${customerId}`);
			console.log('Subscription API response status:', response.status);
			if (!response.ok) {
				throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
			}
			const data = await response.json();
			console.log('Subscriptions data received:', JSON.stringify(data, null, 2));
			subscriptions = data;
			console.log('Subscriptions state updated:', JSON.stringify(subscriptions, null, 2));
		} catch (err) {
			console.error('Error loading subscriptions:', err);
			error = 'Failed to load subscriptions';
		} finally {
			loading = false;
		}
	}

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
{#if loading}
	<p>Loading subscriptions...</p>
{:else if error}
	<p class="text-error-500">{error}</p>
{:else if subscriptions.length === 0}
	<p>No active memberships found.</p>
{:else}
	<ul>
		{#each subscriptions as subscription}
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
