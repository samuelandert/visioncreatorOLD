<script lang="ts">
	import { writable } from 'svelte/store';
	import { env } from '$env/dynamic/public';
	import QRCode from 'qrcode';

	export let userId: string;

	let linkCopied = writable(false);
	let qrCodeUrl = writable('');
	let showQRCode = writable(false); // Store to manage QR code visibility

	async function copyInvitationLink() {
		const baseUrl = env.PUBLIC_BASE_URL;
		const link = `${baseUrl}/?visionid=${userId}`;
		try {
			await navigator.clipboard.writeText(link);
			linkCopied.set(true);
			setTimeout(() => {
				linkCopied.set(false);
			}, 1000);
		} catch (err) {
			console.error('Failed to copy the link:', err);
			alert('Failed to copy the link.');
		}
	}

	async function toggleQRCode() {
		if (!$qrCodeUrl) {
			const baseUrl = env.PUBLIC_BASE_URL;
			const link = `${baseUrl}/?visionid=${userId}`;
			try {
				const url = await QRCode.toDataURL(link);
				qrCodeUrl.set(url);
			} catch (err) {
				console.error('Failed to generate QR code:', err);
				alert('Failed to generate QR code.');
			}
		}
		showQRCode.update((n) => !n); // Toggle visibility
	}
</script>

<div
	class="w-full max-w-6xl p-2 @3xl:p-6 overflow-auto text-center rounded-3xl bg-surface-800 flex flex-col items-center justify-center space-y-4"
>
	{#if $showQRCode && $qrCodeUrl}
		<img src={$qrCodeUrl} alt="QR Code" class="mt-4" />
	{/if}
	<div class="flex flex-row items-center space-x-2">
		<button
			type="button"
			class="btn btn-sm @3xl:btn-lg variant-filled-primary"
			on:click={copyInvitationLink}
			disabled={$linkCopied}
		>
			{$linkCopied ? 'Link Copied!' : 'Copy Invitation Link'}
		</button>
		<button
			type="button"
			class="btn btn-sm @3xl:btn-lg variant-ghost-primary"
			on:click={toggleQRCode}
		>
			{$showQRCode ? 'Hide QR Code' : 'Show QR Code'}
		</button>
	</div>
</div>
