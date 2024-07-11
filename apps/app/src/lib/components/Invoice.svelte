<script lang="ts">
	let pdfUrl: string | null = null;
	let error: string | null = null;

	let customerName = '';
	let customerAddress = '';
	let customerEmail = '';

	async function generateInvoice() {
		const payload = {
			company: {
				name: 'Visioncreator GmbH',
				address: 'Reifenstuelstr. 6\n80469 München\nGermany',
				email: 'hello@visioncreator.works'
			},
			customer: {
				name: customerName,
				address: customerAddress,
				email: customerEmail
			},
			invoice: {
				number: 1001,
				date: new Date().toLocaleDateString(),
				dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
				status: 'Paid',
				currency: '€',
				path: '/tmp/invoice.pdf' // Provide a temporary path
			},
			items: [
				{
					name: 'Visioncreator Membership',
					quantity: 1,
					price: 33.33,
					tax: 19
				}
			],
			note: 'Thank you for your business!'
		};
		console.log('Payload prepared:', JSON.stringify(payload, null, 2));

		try {
			console.log('Sending request to generate invoice');
			const response = await fetch('/api/generate-invoice', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			console.log('Response received:', response.status, response.statusText);

			if (response.ok) {
				const data = await response.json();
				console.log('Response data received');

				if (data.pdf) {
					const pdfContent = atob(data.pdf);
					const pdfBlob = new Blob(
						[new Uint8Array(pdfContent.split('').map((char) => char.charCodeAt(0)))],
						{ type: 'application/pdf' }
					);
					console.log('PDF Blob created, size:', pdfBlob.size);
					pdfUrl = URL.createObjectURL(pdfBlob);
					console.log('PDF URL created:', pdfUrl);
				} else {
					throw new Error('PDF data not found in response');
				}
			} else {
				const errorData = await response.json();
				error = errorData.error + (errorData.details ? `: ${errorData.details}` : '');
				console.error('Error data:', errorData);
			}
		} catch (err) {
			console.error('Error generating PDF:', err);
			error = 'An error occurred while generating the PDF: ' + (err.message || '');
		}
	}
</script>

<div class="flex w-full p-8 mx-auto">
	<div class="w-1/4 pr-4 space-y-4">
		<h2 class="h2">Customer Details</h2>
		<label class="label">
			<span>Name</span>
			<input
				class="input"
				type="text"
				bind:value={customerName}
				placeholder="Enter customer name"
			/>
		</label>
		<label class="label">
			<span>Address</span>
			<textarea
				class="textarea"
				bind:value={customerAddress}
				rows="3"
				placeholder="Enter customer address"
			/>
		</label>
		<label class="label">
			<span>Email</span>
			<input
				class="input"
				type="email"
				bind:value={customerEmail}
				placeholder="Enter customer email"
			/>
		</label>
		<button class="btn variant-filled-primary" on:click={generateInvoice}>Generate Invoice</button>
	</div>

	<div class="w-3/4 pl-4">
		<h2 class="h2">Invoice Preview</h2>
		{#if pdfUrl}
			<iframe
				src={pdfUrl}
				title="Invoice PDF"
				class="w-full h-[calc(100vh-200px)] border-2 border-surface-300-600-token rounded-container-token"
			/>
		{:else if error}
			<p class="text-error-500">{error}</p>
		{:else}
			<p class="text-surface-600-300-token">
				No invoice generated yet. Fill in the customer details and click "Generate Invoice".
			</p>
		{/if}
	</div>
</div>
