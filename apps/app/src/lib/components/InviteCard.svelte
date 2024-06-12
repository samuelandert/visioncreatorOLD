<script lang="ts">
	import { writable } from 'svelte/store';
	import { env } from '$env/dynamic/public';

	export let userId: string;

	let linkCopied = writable(false);

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
</script>

<div
	class="w-full max-w-6xl p-2 @3xl:p-6 overflow-auto text-center rounded-3xl bg-surface-800 flex flex-col items-center justify-center space-y-4"
>
	<div class="flex flex-row items-center space-x-2">
		<button
			type="button"
			class="btn btn-sm @3xl:btn-lg variant-filled-primary"
			on:click={copyInvitationLink}
			disabled={$linkCopied}
		>
			{$linkCopied ? 'Link Copied!' : 'Copy Invitation Link'}
		</button>
		<button type="button" class="btn btn-sm @3xl:btn-lg variant-ghost-primary">QR-Code</button>
	</div>
</div>
