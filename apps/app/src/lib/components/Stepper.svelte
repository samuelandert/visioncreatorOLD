<script>
	import { getContext } from 'svelte';

	export let stepperState;
	export let stepStateName = '';

	const cHeader = 'flex items-center border-t mt-[15px]';
	const cHeaderStep = '-mt-[15px] transition-all duration-300';
	const active = 'variant-filled';
	const badge = 'variant-filled-surface';

	// Context
	const stepTerm = getContext('stepTerm') || 'Step';

	// State
	$: isActive = (step) => step === $stepperState.current;

	// Reactive
	$: classesHeader = `${cHeader} `;
	$: classesHeaderStep = `${cHeaderStep}`;
	$: classesBadge = (step) => (isActive(step) ? active : badge);
</script>

<!-- Header -->
{#if $stepperState.total}
	<header class="stepper-header {classesHeader}" transition:fade|local={{ duration: 100 }}>
		{#each Array.from(Array($stepperState.total).keys()) as step}
			<div class="stepper-header-step {classesHeaderStep}" class:flex-1={isActive(step)}>
				<span class="badge {classesBadge(step)}">
					{isActive(step) ? `${stepStateName}` : ` ${step + 1}`}
				</span>
			</div>
		{/each}
	</header>
{/if}
