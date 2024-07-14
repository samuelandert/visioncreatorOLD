<script lang="ts">
	import { createMutation } from '$lib/wundergraph';
	import { log } from '$lib/stores';

	export let loading = false;
	export let error: string | null = null;
	export let showResult = false;
	export let isSuccess = false;
	export let resultMessage = '';

	let customer = {
		given_name: 'Chielo',
		family_name: 'Jai',
		email: 'chielo.jai@vc.earth',
		address_line1: '123 Main St',
		city: 'Earth',
		postal_code: '12345'
	};

	let dropinHandler: any = null;

	const createMandateMutation = createMutation({
		operationName: 'CreateMandate'
	});

	async function setupDirectDebit() {
		loading = true;
		error = null;
		showResult = false;
		try {
			log('info', 'Starting Direct Debit setup');
			const result = await $createMandateMutation.mutateAsync({
				customer
			});
			if (result.error) {
				throw new Error(result.error);
			}
			log('info', 'Flow started successfully', { flowId: result.data.flowId });
			initializeDropin(result.data.flowId);
		} catch (e) {
			error = e.message || 'An unexpected error occurred';
			showResult = true;
			isSuccess = false;
			resultMessage = error;
			log('error', 'Error in setupDirectDebit', { error });
		} finally {
			loading = false;
		}
	}

	function initializeDropin(flowId: string) {
		if (typeof GoCardlessDropin !== 'undefined') {
			log('info', 'Initializing GoCardless Drop-in', { flowId });
			dropinHandler = GoCardlessDropin.create({
				billingRequestFlowID: flowId,
				environment: 'sandbox',
				onSuccess: async (billingRequest, billingRequestFlow) => {
					log('success', 'GoCardless Drop-in successful', { billingRequest, billingRequestFlow });
					console.log('Success:', billingRequest, billingRequestFlow);
				},
				onExit: async (err) => {
					if (err) {
						log('error', 'Error during GoCardless process', { error: err.message });
						console.error('Error during GoCardless process:', err);
						showResult = true;
						isSuccess = false;
						resultMessage = 'An error occurred during the process: ' + err.message;
					} else {
						log('info', 'GoCardless Drop-in exited without error');
					}
				}
			});
			dropinHandler.open();
		} else {
			log('error', 'GoCardlessDropin is not defined');
			console.error('GoCardlessDropin is not defined');
			showResult = true;
			isSuccess = false;
			resultMessage = 'Failed to load GoCardless Drop-in';
		}
	}
</script>

<button
	class="btn variant-ghost-secondary"
	on:click={setupDirectDebit}
	disabled={loading || $createMandateMutation.isLoading}
>
	Subscribe New VC
</button>

{#if error || $createMandateMutation.error}
	<div class="mb-4 alert variant-filled-error">
		<p>{error || $createMandateMutation.error?.message}</p>
	</div>
{/if}

{#if showResult}
	<div class="w-full mt-4 h-60">
		<ResultScreen {isSuccess} message={resultMessage} />
	</div>
{/if}
