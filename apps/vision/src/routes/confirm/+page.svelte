<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let response = '';
	let message = '';
	let visionid;
	let otp = '';

	onMount(() => {
		otp = $page.url.searchParams.get('otp') || '';
		visionid = $page.url.searchParams.get('visionid') || 0;
	});

	async function handleSubmit() {
		const res = await fetch('/check', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ otp: otp, visionid })
		});
		const data = await res.json();
		response = JSON.stringify(data, null, 2);

		// Display a success or failure message based on the isSame property
		message = data.isSame ? 'Success' : 'Failed, try again and send new code';
	}
</script>

<div class="relative w-screen h-screen">
	<img
		src="https://source.unsplash.com/random"
		alt="Welcome Image"
		class="absolute inset-0 object-cover w-full h-full"
	/>
	<div class="absolute inset-0 bg-black bg-opacity-50" />
	<div class="relative flex flex-col items-center justify-center h-full">
		<p class="mb-4 text-lg text-white">Schließe deinen Signup ab</p>
		<form
			on:submit|preventDefault={handleSubmit}
			class="relative flex flex-col items-center justify-center text-center"
		>
			<input
				type="number"
				bind:value={otp}
				min="000000"
				max="999999"
				required
				class="p-4 px-8 mb-4 text-4xl text-white rounded-lg no-spinners"
				placeholder="Enter OTP"
			/>
			<button type="submit" class="px-4 py-2 text-white bg-teal-500 rounded-2xl">Sign-In Now</button
			>
		</form>
		<pre class="text-white">{message}</pre>
	</div>
</div>

<style>
	input {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid white;
		outline: none;
	}
	.no-spinners::-webkit-inner-spin-button,
	.no-spinners::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.no-spinners {
		-moz-appearance: textfield;
	}
</style>
