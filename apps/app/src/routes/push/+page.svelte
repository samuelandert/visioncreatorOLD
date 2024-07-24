<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let subscription: PushSubscription | null = null;
	let pushManager: PushManager | null = null;

	onMount(async () => {
		if (browser && 'serviceWorker' in navigator) {
			try {
				const registration = await navigator.serviceWorker.register('/service-worker.js');
				console.log('Service Worker registered successfully:', registration);
				pushManager = registration.pushManager;
				subscription = await pushManager.getSubscription();
			} catch (error) {
				console.error('Service Worker registration failed:', error);
			}
		}
	});

	async function subscribeToNotifications() {
		if (!pushManager) {
			console.error('Push manager not available');
			return;
		}

		try {
			const sub = await pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey:
					'BNQnK3cJhovdfVcIONcUjK1JYtdnzrgkKbvf1ZHSg2wCc6OVMwJU19CexTe7tusiH7FfNfOF0N0V1E2gRy7ls8I'
			});
			subscription = sub;

			// Send the subscription to your server
			const response = await fetch('/api/save-subscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(subscription)
			});

			if (response.ok) {
				alert('Subscribed to notifications!');
			} else {
				throw new Error('Failed to save subscription on server');
			}
		} catch (err) {
			console.error('Failed to subscribe:', err);
			alert('Failed to subscribe to notifications: ' + err.message);
		}
	}

	async function sendTestNotification() {
		try {
			const response = await fetch('/api/send-notification', { method: 'POST' });
			if (response.ok) {
				alert('Test notification sent!');
			} else {
				alert('Failed to send test notification');
			}
		} catch (err) {
			console.error('Error sending notification:', err);
			alert('Error sending notification');
		}
	}
</script>

<button
	class="btn variant-ghost-primary"
	on:click={subscribeToNotifications}
	disabled={!!subscription}
>
	Subscribe to Notifications
</button>

<button class="btn variant-ghost-primary" on:click={sendTestNotification} disabled={!subscription}>
	Send Test Notification
</button>
