<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';

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
			const minDays = 25;
			const growthFactor = 1.1; // Adjust this value to control the growth rate

			if (index === fibonacciSequence.indexOf(1597)) {
				// Ensure at least 25 days after the 987 milestone
				date = new Date(midDate.getTime() + minDays * 24 * 60 * 60 * 1000);
			} else {
				const daysToAdd =
					minDays * Math.pow(growthFactor, index - fibonacciSequence.indexOf(987) - 1);
				date = new Date(
					fibonacciMilestones[fibonacciMilestones.length - 1].date.getTime() +
						daysToAdd * 24 * 60 * 60 * 1000
				);
			}
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

	let gridColumns = 5;
	let states = fibonacciMilestones.map((milestone, index) => {
		if (index < 15) return 'completed';
		if (index === 15) return 'in-progress';
		return 'open';
	});

	let currentProgress = 987;

	function getProgressPercentage(milestone: number): number {
		if (milestone <= currentProgress) return 100;
		if (milestone > fibonacciMilestones[15].value) return 0;
		return Math.floor((currentProgress / milestone) * 100);
	}

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

<main class="w-screen h-screen bg-surface-900 text-surface-50 overflow-auto p-5">
	<div
		class="grid gap-4 w-full box-border"
		style="grid-template-columns: repeat({gridColumns}, 1fr);"
	>
		{#each fibonacciMilestones as milestone, index}
			<div
				class="card {getCardClass(
					states[index]
				)} flex flex-col justify-between items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[200px]"
			>
				<span class="h3 z-10">{milestone.value.toLocaleString()}</span>
				<span class="text-sm z-10">{formatCurrency(milestone.poolAmount)}</span>
				<ProgressBar
					value={getProgressPercentage(milestone.value)}
					meter="bg-surface-900/30"
					track="bg-surface-900/10"
					class="w-full h-full absolute top-0 left-0"
				/>
				<span class="text-sm mt-2 font-bold uppercase {getStateColor(states[index])} z-10"
					>{states[index]}</span
				>
				<span class="text-xs mt-1 z-10">{formatDate(milestone.date)}</span>
				<span class="text-xs mt-1 z-10">Days since previous: {milestone.daysSincePrevious}</span>
			</div>
		{/each}
	</div>
</main>
