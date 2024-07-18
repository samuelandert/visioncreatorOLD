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
		'Liebes Tagebuch,',

		'heute strahlen und blitzen meine Augen vor Freude.',

		'Ich führe ein Leben, indem ich tagtäglich entscheiden kann,',

		'in welche sinnreiche Arbeit ich meine wertvolle Lebenszeit investiere.',

		'Ich bin so froh, dass ich das alte und verstaubte Konzept',

		'“Zeit gegen Geld tauschen“ endlich abgelegt habe und mir jetzt',

		'über 21 unabhängige Einkommensströme einfach so monatlich zufließen',

		'und mich und meine Familie, ein ereignisreiches und schönes Leben genießen lassen.',

		'Ich bin dankbar und glücklich dafür, dass ich 2024 Visioncreator geworden bin.',

		'Jeder von uns investiert jeden Tag 1€ und 1 Minute oder mehr in sich selbst,',

		'und damit in neue Herausforderungen, die das volle Lebenspotenzial jedes Einzelnen entfalten.',

		'Wir entdecken, entwickeln und kreieren jeden Tag mit brennender Leidenschaft',

		'gesellschaftsbewegende Großvisionen, an dessen Erfolgen wir alle beteiligt sind.',

		'Wir haben es geschafft, jedes Quartal ein Community-Startup',

		'aus unserer Mitte heraus zu finanzieren',

		'und so das Leben auf unserem Planeten',

		'für jeden Menschen immer lebenswerter zu machen.',

		'Heute ist ein besonderer Tag!',

		'In einer Stunde ist es so weit',

		'dass zum ersten Mal 1.346.269 Visioncreators',

		'eine Vision mit 44,87 Millionen Euro finanzieren werden.',

		'Einfach unglaublich und faszinierend zugleich, dass wir das heute erreichen.',

		'Ich habe richtige Gänsehaut und kann es kaum erwarten.',

		'Draußen schießen schon die Feuerwerks-Raketen',

		'und ich werde mich jetzt ins Partygetümmel schmeißen.',

		'Danke, dass ich damals an mich geglaubt habe',

		'und mich dafür entschieden habe Visioncreator zu sein.',

		'In tiefer Dankbarkeit dein Visioncreator xyz'
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
</script>

<h2
	class="h2 text-2xl fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-48 @md:text-3xl @2xl:text-4xl @4xl:text-5xl @5xl:text-6xl leading-relaxed w-4/5 md:w-9/10 max-w-full"
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
	on:click={() => dispatch('openDrawer')}>{labels.waitlistButtonText}</button
>
