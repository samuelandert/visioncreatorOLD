<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let labels: {
		heading: string;
		description: string;
		callToActionPrefix: string;
		callToActionSuffix: string;
		callToActionOptions: string[];
		buttonText: string;
	};
	export let targetAudience: string;
	export let targetAudiences: string[];

	const dispatch = createEventDispatcher();

	let currentCallToActionIndex = 0;
	let currentCallToAction = labels.callToActionOptions[0];
	let currentTargetAudience = targetAudience;
	let targetAudienceIndex = targetAudiences.indexOf(targetAudience);

	onMount(() => {
		const targetAudienceInterval = setInterval(() => {
			targetAudienceIndex = (targetAudienceIndex + 1) % targetAudiences.length;
			currentTargetAudience = targetAudiences[targetAudienceIndex];
		}, 500);

		const callToActionInterval = setInterval(() => {
			currentCallToActionIndex = (currentCallToActionIndex + 1) % labels.callToActionOptions.length;
			currentCallToAction = labels.callToActionOptions[currentCallToActionIndex];
		}, 4000);

		return () => {
			clearInterval(targetAudienceInterval);
			clearInterval(callToActionInterval);
		};
	});
</script>

<div class="w-20 @3xl:w-32 opacity-70">
	<img src="logo.png" alt="visioncreator" />
</div>
<h1
	class="h1 text-3xl @md:text-2xl @4xl:text-3xl @5xl:text-4xl @6xl:text-5xl @7xl:text-6xl tracking-wide text-center"
>
	{labels.heading} <span class="font-bold text-primary-500">{currentTargetAudience}</span>
</h1>
<p class="text-xl @md:text-3xl @4xl:text-4xl @5xl:text-5xl mb-6 text-center">
	{labels.description}
</p>
<div class="flex flex-col items-center text-sm @md:text-lg @4xl:text-xl @5xl:text-2xl mb-6">
	<p class="mb-2 text-center">{labels.callToActionPrefix}</p>
	<p
		class="h2 flex items-center justify-center w-full h-12 max-w-5xl font-bold text-secondary-400 text-xl @md:text-4xl @4xl:text-5xl tracking-wide text-center"
	>
		{currentCallToAction}
	</p>
	<p class="mt-2 text-center">{labels.callToActionSuffix}</p>
</div>
<button
	type="button"
	class="btn bg-gradient-to-br variant-gradient-secondary-primary btn-md @3xl:btn-lg"
	on:click={() => dispatch('next')}>{labels.buttonText}</button
>
