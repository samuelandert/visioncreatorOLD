<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let names: string[];
	export let totalVisioncreators: number;

	let currentNameIndex = 0;
	let tickerContent = '';
	let tickerElement: HTMLDivElement;
	let animationDuration = 240; // Doubled from 120 to 240
	let interval: NodeJS.Timeout;

	function getRandomTimeAgo() {
		const unit = Math.random() < 0.33 ? 'sec' : Math.random() < 0.66 ? 'min' : 'hour';
		const value = Math.floor(Math.random() * (unit === 'hour' ? 24 : 60)) + 1;
		return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
	}

	function generateTickerItem() {
		currentNameIndex = (currentNameIndex + 1) % names.length;
		const name = names[currentNameIndex];
		const timeAgo = getRandomTimeAgo();
		return `${name} joined ${timeAgo} --- `;
	}

	function updateTicker() {
		const newItem = generateTickerItem();
		tickerContent = tickerContent.slice(newItem.length) + newItem;
		totalVisioncreators++;
	}

	function initializeTicker() {
		const viewportWidth = window.innerWidth;
		const charactersPerViewport = Math.ceil(viewportWidth / 10); // Approximate characters per viewport width

		while (tickerContent.length < charactersPerViewport * 2) {
			tickerContent += generateTickerItem();
		}

		if (tickerElement) {
			const tickerWidth = tickerElement.offsetWidth;
			animationDuration = (tickerWidth / viewportWidth) * 40; // Doubled from 20 to 40
			tickerElement.style.animationDuration = `${animationDuration}s`;
		}
	}

	onMount(() => {
		initializeTicker();

		// Force a reflow to ensure the initial content is rendered
		void tickerElement.offsetWidth;

		interval = setInterval(updateTicker, 10000); // Doubled from 5000 to 10000
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div
	class="fixed top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-md @md:text-xl flex items-center"
>
	<div class="mr-4 font-bold whitespace-nowrap">
		{totalVisioncreators.toLocaleString()} Visioncreators
	</div>
	<div class="flex-grow overflow-hidden">
		<div bind:this={tickerElement} class="ticker-content whitespace-nowrap">
			{tickerContent}
		</div>
	</div>
</div>

<style>
	.ticker-content {
		display: inline-block;
		padding-left: 100%;
		animation: ticker linear infinite;
		animation-duration: 240s;
	}

	@keyframes ticker {
		0% {
			transform: translate3d(0, 0, 0);
		}
		100% {
			transform: translate3d(-100%, 0, 0);
		}
	}
</style>
