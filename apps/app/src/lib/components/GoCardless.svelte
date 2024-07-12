<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Memberships from './Memberships.svelte';
	import NewMandate from './NewMandate.svelte';
	import CreateSubscription from './CreateSubscription.svelte';
	import { createQuery } from '$lib/wundergraph';

	let selectedCustomer: any = null;

	const customersQuery = createQuery({
		operationName: 'LoadCustomers'
	});

	function selectCustomer(customer: any) {
		console.log('Selecting customer:', customer);
		selectedCustomer = customer;
	}
</script>

<div class="container p-4 mx-auto">
	<h1 class="mb-4 h1">GoCardless Customers</h1>

	<NewMandate loading={$customersQuery.isLoading} error={$customersQuery.error?.message} />

	{#if $customersQuery.isLoading}
		<div class="flex justify-center">
			<ProgressRadial width="w-12" />
		</div>
	{:else if $customersQuery.error}
		<div class="alert variant-filled-error">
			<p>{$customersQuery.error.message}</p>
		</div>
	{:else if $customersQuery.data?.customers?.length === 0}
		<p class="text-surface-500">No customers found.</p>
	{:else}
		<div class="flex">
			<div class="w-1/4 pr-4 border-r">
				<ul class="space-y-2">
					{#each $customersQuery.data?.customers || [] as customer}
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
						<CreateSubscription mandateId={selectedCustomer.mandateId} />
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
