<script lang="ts">
	import { createMutation } from '$lib/wundergraph';

	const subscribeToNewsletterMutation = createMutation({
		operationName: 'SubscribeToNewsletter'
	});

	const subscribe = async () => {
		try {
			await $subscribeToNewsletterMutation.mutateAsync({
				email: 'hardcoded3@mail.com'
			});
			alert('Subscription successful!');
		} catch (error) {
			console.error('Subscription failed:', error);
			alert('Subscription failed. Please try again.');
		}
	};
</script>

<button on:click={subscribe} class="btn btn-primary"> Subscribe to Newsletter </button>
