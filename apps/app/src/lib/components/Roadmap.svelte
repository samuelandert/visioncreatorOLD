<script lang="ts">
	import { writable } from 'svelte/store';

	let gridColumns = 6;
	let visioncreators = writable(1);

	type Milestone = {
		value: number;
		date: Date;
		poolAmount: number;
		daysSincePrevious: number;
	};

	const fibonacciSequence = [
		1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946,
		17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578,
		5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296,
		433494437, 701408733, 1134903170
	];

	const fibonacciMilestones: Milestone[] = [];

	fibonacciSequence.forEach((value, index) => {
		const startDate = new Date('2024-09-21');
		const midDate = new Date('2025-03-21');
		const endDate = new Date('2040-03-21');

		let date: Date;

		if (value === 1) {
			date = startDate;
		} else if (value === 987) {
			date = midDate;
		} else if (value < 987) {
			const progress = Math.pow(index / fibonacciSequence.indexOf(987), 2); // Quadratic growth until midpoint
			const daysToAdd = (progress * (midDate.getTime() - startDate.getTime())) / (1000 * 3600 * 24);
			date = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
		} else {
			const totalDays = (endDate.getTime() - midDate.getTime()) / (1000 * 3600 * 24);
			const progress = Math.pow(
				(index - fibonacciSequence.indexOf(987)) /
					(fibonacciSequence.length - fibonacciSequence.indexOf(987)),
				1.5
			); // Adjusted non-linear growth
			const daysToAdd = progress * totalDays;
			date = new Date(midDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
		}

		const poolAmount = value * 30;
		let daysSincePrevious = 0;

		if (index === 0) {
			daysSincePrevious = 0;
		} else {
			daysSincePrevious = Math.round(
				(date.getTime() - fibonacciMilestones[index - 1].date.getTime()) / (1000 * 3600 * 24)
			);
		}

		fibonacciMilestones.push({ value, date, poolAmount, daysSincePrevious });
	});

	$: states = fibonacciMilestones.map((milestone, index) => {
		if (milestone.value <= $visioncreators) return 'completed';
		if (
			milestone.value > $visioncreators &&
			fibonacciMilestones[index - 1]?.value <= $visioncreators
		)
			return 'in-progress';
		return 'open';
	});

	$: currentProgress = $visioncreators;

	$: getProgressPercentage = (milestone: number, previousMilestone: number): number => {
		if ($visioncreators >= milestone) return 100;
		if ($visioncreators <= previousMilestone) return 0;
		return Math.floor(
			(($visioncreators - previousMilestone) / (milestone - previousMilestone)) * 100
		);
	};

	function getCardClass(state: string): string {
		switch (state) {
			case 'completed':
				return 'bg-success-500';
			case 'in-progress':
				return 'bg-warning-500';
			default:
				return 'bg-surface-800';
		}
	}

	function getStateColor(state: string): string {
		switch (state) {
			case 'completed':
				return 'text-success-500';
			case 'in-progress':
				return 'text-info-200';
			default:
				return 'text-surface-400';
		}
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount);
	}
</script>

<main class="w-screen h-screen bg-surface-900 text-surface-50 overflow-auto p-4">
	<div class="mb-4">
		<label for="visioncreators" class="text-surface-200">VisionCreators:</label>
		<input
			id="visioncreators"
			type="number"
			bind:value={$visioncreators}
			class="ml-2 p-2 bg-surface-700 text-surface-50 rounded"
		/>
	</div>
	<div
		class="grid gap-4 w-full box-border"
		style="grid-template-columns: repeat({gridColumns}, 1fr);"
	>
		{#each fibonacciMilestones as milestone, index}
			{#if states[index] === 'completed' || states[index] === 'in-progress'}
				<div
					class="card {getCardClass(
						states[index]
					)} flex flex-col justify-between items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[140px] rounded-lg shadow-lg"
				>
					<div class="w-full h-6 absolute top-0 left-0 bg-surface-700/50 rounded-t-lg">
						<div
							class="h-full bg-success-500/30 rounded-t-lg transition-all duration-300 ease-in-out flex items-center justify-start pl-2"
							style="width: {getProgressPercentage(
								milestone.value,
								fibonacciMilestones[index - 1]?.value || 0
							)}%"
						>
							<span class="text-xs font-medium uppercase {getStateColor(states[index])} opacity-80"
								>{states[index]}</span
							>
						</div>
					</div>
					<div class="flex justify-between items-center w-full z-10 mt-6">
						<div class="flex flex-col items-start">
							<span class="text-2xl font-bold text-primary-300"
								>{milestone.value.toLocaleString()}</span
							>
							<span class="text-xs mt-1 text-surface-400">+{milestone.daysSincePrevious}d</span>
						</div>
						<div class="flex flex-col items-end">
							<span class="text-sm text-secondary-300"
								>{formatCurrency(milestone.poolAmount).split('.')[0]}</span
							>
							<span class="text-xs mt-1 text-surface-400">{formatDate(milestone.date)}</span>
						</div>
					</div>
				</div>
			{:else}
				<div
					class="card bg-surface-700/30 flex flex-col justify-between items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[140px] rounded-lg shadow-lg"
				>
					<div class="w-full h-6 absolute top-0 left-0 bg-surface-700/50 rounded-t-lg">
						<div class="h-full flex items-center justify-start pl-2">
							<span class="text-xs font-medium uppercase text-surface-300 opacity-80">Coming</span>
						</div>
					</div>
					<div class="flex justify-between items-center w-full z-10 mt-6">
						<div class="flex flex-col items-start">
							<span class="text-2xl font-bold text-surface-400"
								>{milestone.value.toLocaleString()}</span
							>
							<span class="text-xs mt-1 text-surface-300">+{milestone.daysSincePrevious}d</span>
						</div>
						<div class="flex flex-col items-end">
							<span class="text-sm text-surface-400"
								>{formatCurrency(milestone.poolAmount).split('.')[0]}</span
							>
							<span class="text-xs mt-1 text-surface-300">{formatDate(milestone.date)}</span>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</main>
