<script lang="ts">
	import { writable } from 'svelte/store';

	let isLoggerExpanded = writable(false);

	function toggleLogger() {
		isLoggerExpanded.update((value) => !value);
	}
</script>

<slot />
<!-- 
<div class="flex flex-col w-full h-full overflow-hidden md:flex-row">
	<main
		class="relative w-full h-full overflow-hidden {$isLoggerExpanded
			? 'hidden md:block md:w-3/4'
			: ''}"
	>
		<slot />
	</main>

	{#if $isLoggerExpanded}
		<aside class="w-full h-full p-4 overflow-y-auto md:w-1/4 bg-surface-700">
			<Logger />
		</aside>
	{/if}
</div>

<button
	class="fixed z-50 rounded-full bottom-4 right-4 btn-sm variant-ghost-secondary"
	on:click={toggleLogger}
>
	{$isLoggerExpanded ? 'Close' : 'Logs'}
</button> -->
