<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { futureMe } from '$lib/stores';
	import StartWelcome from '$lib/components/StartWelcome.svelte';
	import StartNameInput from '$lib/components/StartNameInput.svelte';
	import StartGreeting from '$lib/components/StartGreeting.svelte';
	import StartStory from '$lib/components/StartStory.svelte';

	const drawerStore = getDrawerStore();

	let state = 1;
	let typingSound: HTMLAudioElement;
	let backgroundMusic: HTMLAudioElement;
	let isMuted = false;

	const names = [
		'Emma',
		'Liam',
		'Olivia',
		'Noah',
		'Ava',
		'Ethan',
		'Sophia',
		'Mason',
		'Isabella',
		'William',
		'Mia',
		'James',
		'Charlotte',
		'Benjamin',
		'Amelia',
		'Lucas',
		'Harper',
		'Henry',
		'Evelyn',
		'Alexander',
		'Abigail',
		'Michael',
		'Emily',
		'Daniel',
		'Elizabeth'
	];

	const targetAudiences = [
		'founder',
		'employee',
		'student',
		'freelancer',
		'changemaker',
		'hustler',
		'mother',
		'father',
		'visionary',
		'designer',
		'lost soul',
		'writer',
		'creator',
		'business owner',
		'entrepreneur',
		'artist',
		'digital nomad',
		'developer',
		'student',
		'dreamer'
	];

	const labels = {
		welcome: {
			heading: 'to every',
			description: 'a life with fire in the belly - every day - is waiting for us',
			subline:
				'make history - discover, build and own society-shaping ventures serving humanity - create autonomy for millions and yourself, while earning multiple income streams',
			buttonText: "Let's go"
		},
		nameInput: {
			placeholder: "What's your name?",
			buttonText: "I'am in!",
			persuasiveText:
				'Unlock your true potential: Becoming a Visioncreator is your gateway to discovering your passion and turning it into sustainable income streams, while serving humanity at earth scale',
			callToActionPrefix: 'are you ready to',
			callToActionOptions: [
				'design a purposeful life you love',
				'become a master of a craft you enjoy',
				'build prosperity and abundance on earth'
			]
		},
		greeting: {
			title: 'Wonderful to have you around, {name}!',
			description: "Let's look into your future and dive into your new life",
			buttonText: 'Show me my future'
		},
		story: {
			muteButtonText: 'mute',
			unmuteButtonText: 'play sound',
			waitlistButtonText: 'Join Waitinglist Now'
		}
	};

	let totalVisioncreators = 10000;

	onMount(() => {
		if (typeof window !== 'undefined') {
			typingSound = new Audio('typing.mp3');
			backgroundMusic = new Audio('inthenameoflove.mp3');

			// Add global keydown event listener
			window.addEventListener('keydown', handleKeydown);
		}

		// Clean up the event listener when the component is destroyed
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('keydown', handleKeydown);
			}
		};
	});

	$: {
		const urlParams = $page.url.searchParams;
		const urlVisionId = urlParams.get('visionid');

		if (typeof window !== 'undefined' && urlVisionId) {
			futureMe.update((current) => ({
				...current,
				visionid: urlVisionId
			}));
		}
	}

	const nextState = () => {
		if (state < 4) {
			state++;
			if (state === 4) {
				startStory();
			}
		} else {
			drawerStore.open({ position: 'bottom' });
		}
	};

	const startStory = () => {
		backgroundMusic.play();
	};

	const toggleMute = () => {
		isMuted = !isMuted;
		typingSound.muted = isMuted;
		backgroundMusic.muted = isMuted;
	};

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			nextState();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="video-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="wald.mp4" type="video/mp4" />
	</video>

	<!-- {#if state !== 4 && state !== 5}
		<StartNewsTicker {names} bind:totalVisioncreators />
	{/if} -->

	<div class="h-full overlay">
		<div class="@container h-full">
			<div
				class="min-h-full flex flex-col justify-end text-center items-center mx-auto max-w-xl @4xl:max-w-6xl p-2 gap-4 pb-12 @3xl:pb-16"
			>
				{#if state === 1}
					<StartWelcome
						heading={labels.welcome.heading}
						description={labels.welcome.description}
						buttonText={labels.welcome.buttonText}
						{targetAudiences}
						subline={labels.welcome.subline}
						on:next={nextState}
					/>
				{:else if state === 2}
					<StartNameInput labels={labels.nameInput} on:next={nextState} />
				{:else if state === 3}
					<StartGreeting labels={labels.greeting} on:next={nextState} />
				{:else if state === 4}
					<StartStory
						labels={labels.story}
						{isMuted}
						{toggleMute}
						{typingSound}
						on:next={() => drawerStore.open({ position: 'bottom' })}
					/>
				{/if}
			</div>
		</div>
	</div>

	<footer class="fixed inset-x-0 bottom-0 p-4 text-xs text-center text-white">
		<button on:click={() => drawerStore.open({ position: 'bottom' })} class="mx-2">Login</button>
		<a href="/data-privacy" class="mx-2">Datenschutz</a>
		<a href="/terms-of-service" class="mx-2">AGB</a>
		<a href="/imprint" class="mx-2">Impressum</a>
	</footer>
</div>

<style>
	.video-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 0;
		margin: 0;
	}

	.background-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to top, rgba(24, 25, 73, 0.842), rgba(230, 209, 74, 0.142));
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
