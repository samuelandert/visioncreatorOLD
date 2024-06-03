<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount, afterUpdate } from 'svelte';
	import { page } from '$app/stores';

	const drawerStore = getDrawerStore();

	export let data;

	let typingSound, backgroundMusic;
	if (typeof window !== 'undefined') {
		typingSound = new Audio('typing.mp3');
		backgroundMusic = new Audio('inthenameoflove.mp3');
	}

	let currentParagraph = 0;
	let centeredText = '';
	let isStarted = false;
	let typeWriter;

	let name;
	let visionID = 0;

	let urlParamName, urlParamVisionid;
	$: {
		urlParamName = $page.url.searchParams.get('name') || '';
		urlParamVisionid = $page.url.searchParams.get('visionid') || 0;
		if (typeof window !== 'undefined') {
			// Capitalize the first letter of the name
			urlParamName = urlParamName.charAt(0).toUpperCase() + urlParamName.slice(1);
			localStorage.setItem('name', urlParamName);
			localStorage.setItem('visionID', urlParamVisionid);
			// Only set name from localStorage if it's not already set
			if (!name) {
				name = localStorage.getItem('name');
			}
			visionID = localStorage.getItem('visionID');
		}
	}
	function openDrawer() {
		drawerStore.open({
			position: 'bottom'
		});
	}

	let paragraphs = [
		'31. Dezember 2030 - Uhrzeit - 23:00',
		'Liebes Tagebuch, heute strahlen und blitzen meine Augen vor Freude.',
		'Ich führe ein Leben, indem ich Tag täglich entscheiden kann',
		'in welche sinnstiftende Arbeit ich meine wertvolle Lebenszeit investiere.',
		'Ich bin so froh das ich das alte und verstaubte Konzept',
		'Zeit gegen Geld zu tauschen abgelegt habe und ich jetzt',
		'über 25 verschiedene Einkommensquellen habe, die mich und meine Familie',
		'ein ereignisreiches und gutes Leben führen lassen',
		'Ich bin dankbar und glücklich darüber, dass ich 2024 Visioncreator geworden bin.',
		'Es ist eine geile Community und wir haben viel Spaß zusammen.',
		'Jeder von uns investiert jeden Tag 1€',
		'in gesellschaftsbewegende Visionen an denen wir alle beteiligt sind',
		'Wir haben es geschafft jeden Monat ein Community-Startup',
		'aus unserer Mitte heraus zu finanzieren und so das Leben ',
		'auf unserem Planeten Tag für Tag für jeden Menschen immer lebenswerter zu machen',
		'Heute ist ein besonderer Tag. In einer Stunde ist es so weit',
		'dass wir zum ersten mal eine Vision mit 10 Million € finanzieren werden',
		'Einfach unglaublich und faszinierend zugleich, dass wir das heute schaffen.',
		'Ich habe richtig Gänsehaut und kann es kaum erwarten',
		'draußen schießen schon die Feuerwerks-Raketen',
		'und ich werde mich jetzt ins Partygetümmel schmeißen',
		'Danke das ich damals an mich geglaubt habe',
		'und mich dazu entschieden habe Visioncreator zu sein',
		'In tiefer Dankbarkeit dein Visioncreator xyz'
	];
	let state = 1;

	const next = () => {
		if (state === 1) {
			// transition from state 1 to state 2
			state = 2;
			// If name is already stored in localStorage, skip to state 3
			if (name) {
				state = 3;
			}
		} else if (state === 2) {
			// transition from state 2 to state 3
			state = 3;
			// update local storage with the name
			if (typeof window !== 'undefined') {
				localStorage.setItem('name', name);
			}
		} else if (state === 3) {
			// transition from state 3 to state 4
			state = 4;
			start();
		}
	};

	const start = () => {
		isStarted = true;
		localStorage.setItem('name', name);
		backgroundMusic.play();
		typeWriter();
	};

	if (typeof window !== 'undefined') {
		typeWriter = async () => {
			if (!isStarted) return;
			const text = paragraphs[currentParagraph].replace('xyz', localStorage.getItem('name'));
			for (let i = 0; i < text.length; i++) {
				centeredText = text.substring(0, i + 1);
				typingSound.play();
				await new Promise((resolve) => setTimeout(resolve, 65));
			}
			typingSound.pause();
			typingSound.currentTime = 0;
			if (currentParagraph < paragraphs.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				centeredText = '';
				currentParagraph = (currentParagraph + 1) % paragraphs.length;
				typeWriter();
			}
		};
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
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

<div class="video-container">
	<video autoplay loop muted class="background-video">
		<source src="wald.mp4" type="video/mp4" />
	</video>
	<div class="absolute z-10 flex justify-around w-full text-3xl top-32">
		<div class="text-center">
			<img class="transparent-image" src="logo.png" alt="visioncreator" width="150px" />
		</div>
	</div>

	<div class="overlay">
		{#if state === 1}
			<div class="max-w-5xl mx-auto text-center">
				<h1 class="my-4 text-6xl font-bold text-white h1">In mir steckt mehr!</h1>

				<div class="max-w-2xl mx-auto mb-2 text-lg text-center text-white">
					<p class="text-3xl">Worauf warte ich noch?</p>
					<br />Bin ich bereit endlich, mein volles Lebenspotenzial zu entfalten und jeden Tag mit
					einem Strahlen und Lächeln durchs Leben zu gehen?
				</div>
			</div>
			<div class="absolute flex justify-around w-full text-4xl text-white bottom-20">
				<button
					type="button"
					class="mt-10 btn bg-gradient-to-br variant-gradient-secondary-primary btn-xl"
					on:click={next}>Ich bin bereit</button
				>
			</div>
		{:else if state === 2}
			<div style="display: flex; flex-direction: column; align-items: center; ">
				<input
					bind:value={name}
					placeholder="Mein Name ist?"
					style="background: rgba(255, 255, 255, 0.2); padding: 0.5rem 1rem; font-size: 2rem; color: white; border: 1px solid white; border-radius: 2rem; outline: none;"
				/>
			</div>
			<div class="absolute flex justify-around w-full text-2xl text-white bottom-20">
				<button
					type="button"
					class="mt-10 btn bg-gradient-to-br variant-gradient-secondary-primary btn-xl"
					on:click={next}>Lass mich träumen</button
				>
			</div>
		{:else if state === 3}
			<div style="display: flex; flex-direction: column; align-items: center;">
				<p class="mb-2 text-3xl text-white">Schön das du da bist {localStorage.getItem('name')}!</p>
				<p class="mb-4 text-xl text-white">
					Lass uns in deine Zukunft schauen und in dein neues Leben eintauchen
				</p>
			</div>
			<div class="absolute flex justify-around w-full text-2xl text-white bottom-20">
				<button
					type="button"
					class="mt-10 btn bg-gradient-to-br variant-gradient-secondary-primary btn-xl"
					on:click={next}>Auf gehts!</button
				>
			</div>
		{:else}
			<h1 class="centered-text">{centeredText}</h1>

			<div class="absolute flex justify-around w-full text-2xl text-white bottom-20">
				<button
					type="button"
					class="mt-10 btn bg-gradient-to-br variant-gradient-secondary-primary btn-xl"
					on:click={openDrawer}>Anmelden</button
				>
				<!-- <a
					href="https://coda.io/form/d6V5RkP54ce?InspiredByVisionID={visionID}&vorname={name}&newsletter=true"
					class="mb-2 text-3xl text-white"
				>
					<button class="px-4 py-2 mt-2 text-white bg-teal-500 rounded-2xl"
						>Ich will mehr wissen</button
					>
				</a> -->
			</div>
		{/if}
	</div>

	<!-- <div class="absolute w-full text-white bottom-10">
		<div class="flex justify-around w-full">
			<div class="text-center">
				<p class="text-4xl">1</p>
				<p class="text-xs text-gray-300">Vision entwickelt</p>
			</div>
			<div class="text-center">
				<p class="text-4xl">845€</p>
				<p class="text-xs text-gray-300">Monatlicher Projektpool</p>
			</div>
			<div class="text-center">
				<p class="text-4xl">2.024€</p>
				<p class="text-xs text-gray-300">Gesamt finanziert</p>
			</div>
		</div>
	</div> -->
</div>

<style>
	input::placeholder {
		color: #d1d5db;
	}
	.transparent-image {
		opacity: 0.9;
	}

	.video-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		padding: 0;
		margin: 0;
	}

	.background-video {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(3, 4, 57, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.centered-text {
		color: white;
		text-align: center;
		font-size: 2em;
	}
</style>
