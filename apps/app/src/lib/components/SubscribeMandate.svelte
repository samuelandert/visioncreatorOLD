<script lang="ts">
	export let loading = false;
	export let error: string | null = null;
	export let showResult = false;
	export let isSuccess = false;
	export let resultMessage = '';

	const HARDCODED_TEMPLATE_ID = 'BRT00007Y68WKQJ';
	let dropinHandler: any = null;

	async function setupDirectDebit() {
		loading = true;
		error = null;
		showResult = false;
		try {
			const response = await fetch('/api/gocardless/mandate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ templateId: HARDCODED_TEMPLATE_ID })
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

	async function handleMandateResponse(flowId: string) {
		try {
			const response = await fetch(`/api/gocardless/mandate?flow_id=${flowId}&success=true`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (data.success) {
				showResult = true;
				isSuccess = true;
				resultMessage = 'Your subscription has been set up successfully.';
			} else {
				throw new Error(data.error || 'Failed to set up subscription.');
			}
		} catch (error) {
			console.error('Error processing mandate:', error);
			showResult = true;
			isSuccess = false;
			resultMessage = error.message || 'An unexpected error occurred.';
		}
	}

	function initializeDropin(flowId: string) {
		if (typeof GoCardlessDropin !== 'undefined') {
			dropinHandler = GoCardlessDropin.create({
				billingRequestFlowID: flowId,
				environment: 'sandbox',
				onSuccess: async (billingRequest, billingRequestFlow) => {
					console.log('Success:', billingRequest, billingRequestFlow);
					await handleMandateResponse(flowId);
				},
				onExit: async (err) => {
					if (err) {
						console.error('Error during GoCardless process:', err);
						showResult = true;
						isSuccess = false;
						resultMessage = 'An error occurred during the process: ' + err.message;
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

<button class="mb-4 btn variant-filled-primary" on:click={setupDirectDebit} disabled={loading}>
	Subscribe New VC
</button>

{#if error}
	<div class="mb-4 alert variant-filled-error">
		<p>{error}</p>
	</div>
{/if}

{#if showResult}
	<div class="w-full mt-4 h-60">
		<ResultScreen {isSuccess} message={resultMessage} />
	</div>
{/if}
