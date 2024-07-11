<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import SubscribeMandate from './SubscribeMandate.svelte';
	import Memberships from './Memberships.svelte';

	let customers: any[] = [];
	let loading = false;
	let error: string | null = null;
	let selectedCustomer: any = null;

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
</script>

<div class="container p-4 mx-auto">
	<h1 class="mb-4 h1">GoCardless Customers</h1>

	<SubscribeMandate {loading} {error} />

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

					<Memberships customerId={selectedCustomer.id} />
				</div>
			{:else}
				<div class="w-3/4 pl-4">
					<p class="text-surface-500">Select a customer to view details.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
