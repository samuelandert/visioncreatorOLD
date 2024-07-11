<script lang="ts">
	export let isSuccess: boolean;
	export let message: string;
	export let backUrl: string = '/me/viewer?c=GoCardless';

	$: bgColor = isSuccess ? 'bg-success-500' : 'bg-error-500';
	$: textColor = isSuccess ? 'text-on-success-token' : 'text-on-error-token';
</script>

<div class="flex flex-col items-center justify-center w-full h-full {bgColor} {textColor}">
	<div class="space-y-4 text-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-24 h-24 mx-auto"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			{#if isSuccess}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			{/if}
		</svg>
		<h1 class="h1">{isSuccess ? 'Success!' : 'Error!'}</h1>
		<p class="text-xl">{message}</p>
		<a href={backUrl} class="btn variant-filled-surface">Back to Home</a>
	</div>
</div>
