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
		'Today, I woke up feeling truly alive.',
		'My eyes sparkle with joy. They see endless possibilities.',
		'A fire burns in my belly. It drives me to create and change the world.',
		'My heart sings with purpose. It beats in time with our shared vision.',
		"I'm overwhelmed. Words can't capture how I feel.",
		'Seven years ago, I took a chance.',
		'I became a Visioncreator.',
		'That choice changed everything. Not just for me, but for many others too.',
		'Now, every morning is full of purpose and excitement.',
		'I choose work that lights up my soul. Every. Single. Day.',
		'Gone are the days of trading time for money.',
		'Instead,',
		"I've found true abundance and fulfillment.",
		"My life is an adventure. It's beautiful. It's excellent.",
		'Passion-fueled income streams support me.',
		'They flow in every month.',
		'Being a Visioncreator is my identity.',
		'It fills me with pride and purpose.',
		"I'm part of a global movement. Together, we're reshaping society.",
		"Each day, we invest 1€ in our shared future. It's a small seed that grows big.",
		'This simple act unlocks our potential. One person at a time.',
		'We create world-changing startups. Every day.',
		'Our work uplifts all of humanity.',
		'We own 100% of these ventures. Together.',
		'Each startup makes life on Earth more vibrant.',
		'Our impact is beyond my wildest dreams.',
		'And today... ',
		'Today is truly special!',
		'In just one hour,',
		"we'll witness something extraordinary.",
		'The 1,346,269th Visioncreator joins us.',
		"Together, we'll bring another world-changing vision to life.",
		"I can't believe we're achieving this. It's beyond words.",
		'I have goosebumps. The excitement is electric.',
		'Outside, drone fireworks light up the sky.',
		"I can't wait to join the party crowd of Visioncreators.",
		"We're all here to celebrate this moment.",
		"Our movement keeps growing. It's incredible.",
		"I'm so grateful.",
		'Grateful for believing in myself back then.',
		'Grateful for choosing to become a Visioncreator.',
		'It made my life an exciting journey of wonders',
		'With deep gratitude and joy,',
		'Your Visioncreator, xyz'
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
