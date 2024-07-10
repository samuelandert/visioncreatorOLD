<script lang="ts">
	import { onMount } from 'svelte';

	let pdfUrl: string | null = null;
	let error: string | null = null;

	onMount(async () => {
		console.log('Invoice component mounted');
		const payload = {
			company: {
				name: 'Visioncreator GmbH',
				address: 'Reifenstuelstr. 6\n80469 München\nGermany',
				email: 'hello@visioncreator.works'
			},
			customer: {
				name: 'John Doe',
				address: '456 Customer Ave, Town, Country',
				phone: 'Tel: (987) 654-3210',
				email: 'john@example.com'
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
	});
</script>

<div class="container p-4 mx-auto">
	<h1 class="mb-4 text-2xl font-bold">Invoice Preview</h1>
	{#if pdfUrl}
		<iframe
			src={pdfUrl}
			title="Invoice PDF"
			class="w-full h-screen border-2 border-gray-300 rounded"
		/>
	{:else if error}
		<p class="text-red-600">{error}</p>
	{:else}
		<p class="text-gray-600">Loading invoice...</p>
	{/if}
</div>
