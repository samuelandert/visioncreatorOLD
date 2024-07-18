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
		state++;
		if (state === 4) {
			startStory();
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

	onMount(() => {
		if (typeof window !== 'undefined') {
			typingSound = new Audio('typing.mp3');
			backgroundMusic = new Audio('inthenameoflove.mp3');
		}
	});

	const labels = {
		welcome: {
			title: 'Zeit-gegen-Geld-tauschen war gestern',
			subtitle: 'Es ist an der Zeit das zu ändern und mein ... zu entdecken',
			description: 'Mein neuer Lebensweg beginnt jetzt',
			buttonText: 'Ich bin bereit'
		},
		nameInput: {
			placeholder: 'Mein Name ist?',
			buttonText: 'Lass mich träumen'
		},
		greeting: {
			title: 'Schön das du da bist, {name}!',
			description: 'Lass uns in deine Zukunft schauen und in dein neues Leben eintauchen',
			buttonText: 'Starte Video'
		},
		story: {
			muteButtonText: 'mute',
			unmuteButtonText: 'play sound',
			waitlistButtonText: 'Jetzt auf Warteliste setzen'
		}
	};
</script>

<div class="video-container">
	<video autoplay loop muted playsinline class="background-video">
		<source src="wald.mp4" type="video/mp4" />
	</video>

	<div class="h-full overlay">
		<div class="@container h-full">
			<div
				class="min-h-full flex flex-col justify-end text-center items-center mx-auto max-w-xl @4xl:max-w-6xl p-2 gap-4 pb-12 @3xl:pb-16"
			>
				{#if state === 1}
					<StartWelcome labels={labels.welcome} on:next={nextState} />
				{:else if state === 2}
					<StartNameInput labels={labels.nameInput} on:next={nextState} />
				{:else if state === 3}
					<StartGreeting labels={labels.greeting} on:next={nextState} />
				{:else}
					<StartStory
						labels={labels.story}
						{isMuted}
						{toggleMute}
						{typingSound}
						on:openDrawer={() => drawerStore.open({ position: 'bottom' })}
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
