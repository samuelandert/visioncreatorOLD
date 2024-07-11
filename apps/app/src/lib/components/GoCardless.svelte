<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import ResultScreen from './ResultScreen.svelte';

	let customers: any[] = [];
	let loading = false;
	let error: string | null = null;
	let selectedCustomer: any = null;
	let showResult = false;
	let isSuccess = false;
	let resultMessage = '';
	let dropinHandler: any = null;
	let subscriptionTemplates: any[] = [];
	let loadingTemplates = false;
	let selectedTemplate: any = null;

	onMount(async () => {
		await loadCustomers();
		await loadSubscriptionTemplates();
	});
	async function loadSubscriptionTemplates() {
		loadingTemplates = true;
		try {
			const response = await fetch('/api/gocardless/templates');
			if (!response.ok) throw new Error('Failed to fetch subscription templates');
			const data = await response.json();
			if (Array.isArray(data)) {
				subscriptionTemplates = data;
			} else {
				throw new Error('Unexpected response format');
			}
		} catch (e) {
			error = e.message || 'Failed to load subscription templates';
		} finally {
			loadingTemplates = false;
		}
	}

	async function subscribe(customer: any) {
		if (!selectedTemplate) {
			error = 'Please select a subscription template';
			return;
		}

		if (!customer.mandateId) {
			error = 'No active mandate found for this customer';
			return;
		}

		loading = true;
		error = null;
		showResult = false;
		try {
			const response = await fetch('/api/gocardless/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mandateId: customer.mandateId,
					templateId: selectedTemplate.id
				})
			});
			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}
			showResult = true;
			isSuccess = true;
			resultMessage = 'Billing request created successfully.';
			await loadCustomers(); // Reload customers to update subscription status
		} catch (e) {
			error = e.message || 'An unexpected error occurred';
			showResult = true;
			isSuccess = false;
			resultMessage = error;
		} finally {
			loading = false;
		}
	}

	async function loadCustomers() {
		loading = true;
		try {
			const response = await fetch('/api/gocardless/customers');
			if (!response.ok) throw new Error('Failed to fetch customers');
			const data = await response.json();
			if (Array.isArray(data)) {
				customers = data;
				if (customers.length > 0) {
					selectedCustomer = customers[0];
				}
			} else {
				throw new Error('Unexpected response format');
			}
		} catch (e) {
			error = e.message || 'Failed to load customers';
		} finally {
			loading = false;
		}
	}

	async function setupDirectDebit(customer: any) {
		loading = true;
		error = null;
		showResult = false;
		try {
			const response = await fetch('/api/gocardless/mandate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ customerId: customer.id })
			});
			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}
			initializeDropin(data.flowId);
		} catch (e) {
			error = e.message || 'An unexpected error occurred';
			showResult = true;
			isSuccess = false;
			resultMessage = error;
		} finally {
			loading = false;
		}
	}

	function initializeDropin(flowId: string) {
		if (typeof GoCardlessDropin !== 'undefined') {
			dropinHandler = GoCardlessDropin.create({
				billingRequestFlowID: flowId,
				environment: 'sandbox', // Change to 'live' for production
				onSuccess: (billingRequest: any, billingRequestFlow: any) => {
					console.log('Success:', billingRequest, billingRequestFlow);
					showResult = true;
					isSuccess = true;
					resultMessage = 'Your direct debit has been set up successfully.';
					loadCustomers(); // Reload customers to update mandate status
				},
				onExit: (err: any, metadata: any) => {
					if (err) {
						console.error('Error:', err, metadata);
						showResult = true;
						isSuccess = false;
						resultMessage = 'An error occurred during the process: ' + err.message;
					} else {
						console.log('Exited:', metadata);
						// Handle exit without error (user closed the modal)
					}
				}
			});
			dropinHandler.open();
		} else {
			console.error('GoCardlessDropin is not defined');
			showResult = true;
			isSuccess = false;
			resultMessage = 'Failed to load GoCardless Drop-in';
		}
	}
</script>

<div class="container p-4 mx-auto">
	<h1 class="mb-4 h1">GoCardless Customers</h1>

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
								on:click={() => (selectedCustomer = customer)}
							>
								{customer.given_name}
								{customer.family_name}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			{#if selectedCustomer}
				<div class="w-3/4 pl-4 space-y-4">
					<h2 class="h2">{selectedCustomer.given_name} {selectedCustomer.family_name}</h2>
					<div class="grid grid-cols-2 gap-4">
						<div><strong>Address:</strong> {selectedCustomer.address_line1 || 'N/A'}</div>
						<div><strong>Postal Code:</strong> {selectedCustomer.postal_code || 'N/A'}</div>
						<div><strong>City:</strong> {selectedCustomer.city || 'N/A'}</div>
						<div><strong>Country:</strong> {selectedCustomer.country_code || 'N/A'}</div>
						<div><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</div>
					</div>
					<div class="flex space-x-4">
						{#if selectedCustomer.hasActiveMandates}
							{#if loadingTemplates}
								<ProgressRadial width="w-8" />
							{:else if subscriptionTemplates.length > 0}
								<select bind:value={selectedTemplate} class="select">
									<option value={null}>Select a subscription plan</option>
									{#each subscriptionTemplates as template}
										<option value={template}>
											{template.name} - {template.amount}
											{template.currency} / {template.interval}
										</option>
									{/each}
								</select>
								<button
									class="btn variant-filled-primary"
									on:click={() => subscribe(selectedCustomer)}
									disabled={!selectedTemplate}
								>
									Subscribe
								</button>
							{:else}
								<p>No subscription plans available.</p>
							{/if}
						{:else}
							<button
								class="btn variant-filled-secondary"
								on:click={() => setupDirectDebit(selectedCustomer)}
							>
								Create Mandate
							</button>
						{/if}
					</div>
				</div>
			{:else}
				<div class="w-3/4 pl-4">
					<p class="text-surface-500">Select a customer to view details.</p>
				</div>
			{/if}
		</div>
	{/if}

	{#if showResult}
		<div class="w-full mt-4 h-60">
			<ResultScreen {isSuccess} message={resultMessage} />
		</div>
	{/if}
</div>
