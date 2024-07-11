<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Memberships from './Memberships.svelte';
	import NewMandate from './NewMandate.svelte';

	let customers: any[] = [];
	let loading = false;
	let error: string | null = null;
	let selectedCustomer: any = null;
	let subscriptionLoading = false;
	let subscriptionError: string | null = null;
	let subscriptionSuccess = false;

	onMount(async () => {
		await loadCustomers();
	});

	async function selectCustomer(customer: any) {
		console.log('Selecting customer:', customer);
		selectedCustomer = customer;
	}

	async function loadCustomers() {
		loading = true;
		try {
			const response = await fetch('/api/gocardless/customers');
			if (!response.ok) throw new Error('Failed to fetch customers');
			customers = await response.json();
			if (customers.length > 0) {
				selectedCustomer = customers[0];
			}
		} catch (e) {
			error = e.message || 'Failed to load customers';
		} finally {
			loading = false;
		}
	}

	async function createSubscription() {
		subscriptionLoading = true;
		subscriptionError = null;
		subscriptionSuccess = false;

		try {
			const response = await fetch('/api/gocardless/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					mandateId: selectedCustomer.mandateId,
					templateId: 'BRT00007Y68WKQJ'
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create subscription');
			}

			const data = await response.json();
			subscriptionSuccess = true;
			console.log('Subscription created:', data.subscription);
		} catch (e) {
			subscriptionError = e.message || 'Failed to create subscription';
		} finally {
			subscriptionLoading = false;
		}
	}
</script>

<div class="container p-4 mx-auto">
	<h1 class="mb-4 h1">GoCardless Customers</h1>

	<NewMandate {loading} {error} />

	{#if loading}
		<div class="flex justify-center">
			<ProgressRadial width="w-12" />
		</div>
	{:else if error}
		<div class="alert variant-filled-error">
			<p>{error}</p>
		</div>
	{:else if customers.length === 0}
		<p class="text-surface-500">No customers found.</p>
	{:else}
		<div class="flex">
			<div class="w-1/4 pr-4 border-r">
				<ul class="space-y-2">
					{#each customers as customer}
						<li>
							<button
								class="w-full p-2 text-left rounded-token hover:bg-surface-500/10"
								class:bg-primary-500={selectedCustomer === customer}
								on:click={() => selectCustomer(customer)}
							>
								{customer.given_name}
								{customer.family_name}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			{#if selectedCustomer}
				<div class="w-3/4 pl-4">
					<h3 class="mb-4 h3">Customer Details</h3>
					<p>Name: {selectedCustomer.given_name} {selectedCustomer.family_name}</p>
					<p>Email: {selectedCustomer.email}</p>
					<p>Has Active Mandate: {selectedCustomer.hasActiveMandates ? 'Yes' : 'No'}</p>

					{#if selectedCustomer.hasActiveMandates && selectedCustomer.mandateId}
						<button
							class="mt-4 btn variant-filled-secondary"
							on:click={createSubscription}
							disabled={subscriptionLoading}
						>
							{#if subscriptionLoading}
								<ProgressRadial width="w-6" />
							{:else}
								Subscribe
							{/if}
						</button>

						{#if subscriptionError}
							<div class="mt-2 alert variant-filled-error">
								<p>{subscriptionError}</p>
							</div>
						{/if}

						{#if subscriptionSuccess}
							<div class="mt-2 alert variant-filled-success">
								<p>Subscription created successfully!</p>
							</div>
						{/if}

						<Memberships customerId={selectedCustomer.id} />
					{:else}
						<p class="mt-4 text-surface-500">No active mandate available for subscription.</p>
					{/if}
				</div>
			{:else}
				<div class="w-3/4 pl-4">
					<p class="text-surface-500">Select a customer to view details.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
