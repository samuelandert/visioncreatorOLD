<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

	let emailInput = '';

	const subscribeToNewsletterMutation = createMutation({
		operationName: 'SubscribeToNewsletter'
	});

	const subscribe = async () => {
		if (!emailInput) {
			alert('Please enter an email address.');
			return;
		}

		try {
			await $subscribeToNewsletterMutation.mutateAsync({
				email: `${emailInput}@mail.mail`
			});
			alert('Subscription successful!');
			emailInput = ''; // Clear the input after successful subscription
		} catch (error) {
			console.error('Subscription failed:', error);
			alert('Subscription failed. Please try again.');
		}
	};
</script>

<div class="flex flex-col items-center space-y-4">
	<div class="relative w-full max-w-xs">
		<input
			type="text"
			bind:value={emailInput}
			placeholder="Enter your email"
			class="w-full pr-24 input input-bordered"
		/>
		<span class="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2">@mail.mail</span>
	</div>
	<button on:click={subscribe} class="btn btn-primary">Subscribe to Newsletter</button>
</div>
