<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import { futureMe } from '$lib/stores';
	import Icon from '@iconify/svelte';

	export let labels: {
		muteButtonText: string;
		unmuteButtonText: string;
		waitlistButtonText: string;
	};
	export let isMuted: boolean;
	export let toggleMute: () => void;
	export let typingSound: HTMLAudioElement;

	const dispatch = createEventDispatcher();

	let currentParagraph = 0;
	let centeredText = '';
	let isStarted = false;
	let typeWriter;

	let paragraphs = [
		'March 21, 2031 - Time - 23:31',
		'Dear Journal,',
		'Today, my heart overflows with joy',
		'and my eyes sparkle with light.',
		'Seven years ago',
		'I became a Visioncreator and it changed everything.',
		'Now, I wake up every morning with a profound sense of purpose and excitement.',
		'I have the freedom to choose in which meaningful work I invest my precious time - every single day.',
		'Gone are the days of trading time for money.',
		'Instead',
		'I have unlocked true abundance and fulfillment.',
		'I live a life filled with adventure and beauty',
		'grown through passion fueled income streams that flow to me each month',
		'As a Visioncreator',
		'I am part of a global movement that is reshaping our world.',
		'Every day, every Visioncreator invest 1€ into our collective future.',
		'This small, consistent action unlocks the full potential in each one of us.',
		'We discover, develop and create society-shaping startups every day',
		'uplifting humanity as a whole',
		'while collectively owning 100% of our ventures.',
		'Each startup makes life on our beautiful planet more vibrant and worth living.',
		'The impact we are having is beyond my wildest dreams.',
		'And today... ',
		'oh, today is truly special!',
		'In just one hour',
		'we will witness something extraordinary.',
		'the 1,346,269th Visioncreator unites with us',
		'to breathe life into another world-changing vision',
		'It is simply incredible and fascinating that we are achieving this today.',
		'I have goosebumps and can hardly wait.',
		'Outside, mesmerizing drone fireworks paint the sky already',
		'and I am about to throw myself into the party crowd.',
		'Thank you for believing in myself back then',
		'and for deciding to be a Visioncreator.',
		'With deep gratitude, your Visioncreator xyz'
	];

	let firstSentence = paragraphs[0];
	let firstSentenceDisplayed = '';
	let isFirstSentenceComplete = false;

	if (typeof window !== 'undefined') {
		typeWriter = async () => {
			if (!isStarted) return;
			let text;
			if (currentParagraph === 0 && !isFirstSentenceComplete) {
				text = firstSentence.replace('xyz', $futureMe.name);
			} else {
				text = paragraphs[currentParagraph].replace('xyz', $futureMe.name);
			}

			for (let i = 0; i < text.length; i++) {
				if (currentParagraph === 0) {
					firstSentenceDisplayed = text.substring(0, i + 1);
				} else {
					centeredText = text.substring(0, i + 1);
				}
				typingSound.play();
				await new Promise((resolve) => setTimeout(resolve, 65));
			}
			typingSound.pause();
			typingSound.currentTime = 0;

			if (currentParagraph === 0) {
				isFirstSentenceComplete = true;
			}

			if (currentParagraph < paragraphs.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 1800));
				centeredText = '';
				currentParagraph = (currentParagraph + 1) % paragraphs.length;
				typeWriter();
			}
		};
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			isStarted = true;
			typeWriter();
		}
	});

	afterUpdate(() => {
		const centeredTextElement = document.querySelector('.centered-text');
		if (centeredTextElement) {
			centeredTextElement.textContent = centeredText;
		}
	});
	function handleWaitlistClick() {
		dispatch('next');
	}
</script>

<h2
	class="font-bold text-xl fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-48 @md:text-2xl @2xl:text-3xl @4xl:text-4xl @5xl:text-5xl leading-relaxed w-4/5 md:w-9/10 max-w-full"
>
	{firstSentenceDisplayed}
</h2>
<p
	class="fixed transform -translate-x-1/2 -translate-y-1/2 top-2/3 left-1/2 h-48 text-lg @md:text-xl @2xl:text-2xl @4xl:text-3xl @5xl:text-4xl leading-relaxed w-4/5 md:w-9/10 max-w-full"
>
	{centeredText}
</p>
<button
	class="flex flex-col items-center justify-center w-full h-auto p-4 text-tertiary-600"
	on:click={toggleMute}
	style="background: transparent; border: none; cursor: pointer; z-index: 1000; outline: none;"
	on:focus={{ outline: 'none' }}
>
	{#if isMuted}
		<Icon icon="ion:volume-high-outline" class="w-10 h-10 @3xl:w-14 @3xl:h-14" />
		<span class="text-sm mt-1 @3xl:text-base">{labels.unmuteButtonText}</span>
	{:else}
		<Icon icon="ion:volume-mute-outline" class="w-10 h-10 @3xl:w-14 @3xl:h-14" />
		<span class="text-sm mt-1 @3xl:text-base">{labels.muteButtonText}</span>
	{/if}
</button>

<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={handleWaitlistClick}>{labels.waitlistButtonText}</button
>
