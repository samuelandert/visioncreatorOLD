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
		'Dear Diary,',
		'Today my eyes are shining and sparkling with joy.',
		'I took 7 years ago the visioncreator challenge to my hearts',
		'And now I lead a life where I can decide every single day',
		'which meaningful work I invest my precious lifetime in.',
		"I'm so glad that I've finally shed the old and dusty concept",
		'of "trading time for money" and now I effortlessly receive',
		'over 21 independent income streams flowing to me monthly,',
		'allowing me and my family to enjoy an eventful and beautiful life.',
		"I'm grateful and happy that I became a Visioncreator in 2024.",
		'Each of us invests €1 and 1min in ourselves every day,',
		'and thus in new habits that unlock the full life potential of every individual.',
		'We discover, develop, and create society-shaping grand visions every day',
		'with burning passion, in whose successes we all participate.',
		"We've managed to finance a community startup",
		'from within our ranks every quarter,',
		'making life on our planet',
		'more and more worth living for every person.',
		'Today is a special day!',
		'In an hour, it will be time',
		'for 1,346,269 Visioncreators to finance',
		'a vision with 44.87 million euros for the first time.',
		"It's simply incredible and fascinating that we're achieving this today.",
		'I have goosebumps and can hardly wait.',
		'Outside, fireworks are already shooting into the sky',
		"and I'm about to throw myself into the party crowd.",
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
