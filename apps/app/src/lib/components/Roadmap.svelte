<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	let gridColumns = 6;
	let visioncreators = writable(0);
	const startProvision = 70;
	const endProvision = 20;
	const platformFee = 20;

	type Milestone = {
		value: number;
		date: Date;
		poolAmount: number;
		daysSincePrevious: number;
		provisionPercentage: number;
		showDetails?: boolean;
		startupFund?: number;
		platformFeeAmount?: number;
		vcPool?: number;
	};

	type User = {
		name: string;
		identifier: string;
		timestamp: Date;
		earnings: number;
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
			);
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

		const provisionPercentage =
			startProvision -
			(startProvision - endProvision) *
				(1 - Math.exp((-4 * index) / (fibonacciSequence.length - 1)));

		const platformFeeAmount = (poolAmount * platformFee) / 100;
		const remainingPool = poolAmount - platformFeeAmount;
		const vcPool = (remainingPool * provisionPercentage) / 100;
		const startupFund = remainingPool - vcPool;

		fibonacciMilestones.push({
			value,
			date,
			poolAmount,
			daysSincePrevious,
			provisionPercentage,
			startupFund,
			platformFeeAmount,
			vcPool
		});
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

	$: getProgressPercentage = (milestone: number, previousMilestone: number): number => {
		if ($visioncreators >= milestone) return 100;
		if ($visioncreators <= previousMilestone) return 0;
		return Math.floor(
			(($visioncreators - previousMilestone) / (milestone - previousMilestone)) * 100
		);
	};

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount);
	}

	function formatTimeRemaining(date: Date): string {
		const now = new Date();
		const diff = date.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return `${days}d ${hours}h ${minutes}m`;
	}

	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		return `${minutes}m ago`;
	}

	const randomUsers: User[] = [
		{ name: 'Alice Johnson', identifier: 'alice_j', timestamp: new Date(), earnings: 5 },
		{ name: 'Bob Smith', identifier: 'bob_s', timestamp: new Date(), earnings: 10 },
		{ name: 'Charlie Brown', identifier: 'charlie_b', timestamp: new Date(), earnings: 15 },
		{ name: 'Diana Prince', identifier: 'diana_p', timestamp: new Date(), earnings: 20 },
		{ name: 'Ethan Hunt', identifier: 'ethan_h', timestamp: new Date(), earnings: 25 },
		{ name: 'Fiona Apple', identifier: 'fiona_a', timestamp: new Date(), earnings: 30 },
		{ name: 'George Lucas', identifier: 'george_l', timestamp: new Date(), earnings: 35 },
		{ name: 'Hannah Montana', identifier: 'hannah_m', timestamp: new Date(), earnings: 40 },
		{ name: 'Ian McKellen', identifier: 'ian_m', timestamp: new Date(), earnings: 45 },
		{ name: 'Julia Roberts', identifier: 'julia_r', timestamp: new Date(), earnings: 50 },
		{ name: 'Kevin Bacon', identifier: 'kevin_b', timestamp: new Date(), earnings: 55 },
		{ name: 'Lara Croft', identifier: 'lara_c', timestamp: new Date(), earnings: 60 },
		{ name: 'Michael Jordan', identifier: 'michael_j', timestamp: new Date(), earnings: 65 },
		{ name: 'Natalie Portman', identifier: 'natalie_p', timestamp: new Date(), earnings: 70 },
		{ name: 'Olivia Wilde', identifier: 'olivia_w', timestamp: new Date(), earnings: 75 },
		{ name: 'Peter Parker', identifier: 'peter_p', timestamp: new Date(), earnings: 80 },
		{ name: 'Quentin Tarantino', identifier: 'quentin_t', timestamp: new Date(), earnings: 85 },
		{ name: 'Robert Downey Jr.', identifier: 'robert_d', timestamp: new Date(), earnings: 90 },
		{ name: 'Sarah Connor', identifier: 'sarah_c', timestamp: new Date(), earnings: 95 },
		{ name: 'Tom Hanks', identifier: 'tom_h', timestamp: new Date(), earnings: 100 },
		{ name: 'Uma Thurman', identifier: 'uma_t', timestamp: new Date(), earnings: 105 },
		{ name: 'Vincent Vega', identifier: 'vincent_v', timestamp: new Date(), earnings: 110 },
		{ name: 'Walter White', identifier: 'walter_w', timestamp: new Date(), earnings: 115 },
		{ name: 'Xavier Charles', identifier: 'xavier_c', timestamp: new Date(), earnings: 120 },
		{ name: 'Yoda', identifier: 'yoda', timestamp: new Date(), earnings: 125 }
	];

	let recentUsers: User[] = [];

	function addRandomUser() {
		const randomIndex = Math.floor(Math.random() * randomUsers.length);
		const newUser = {
			...randomUsers[randomIndex],
			timestamp: new Date(),
			id: Date.now(),
			earnings: Math.floor(Math.random() * 100) + 1
		};
		recentUsers = [newUser, ...recentUsers].slice(0, 20);
	}

	function removeRandomUser() {
		if (recentUsers.length > 0) {
			const randomIndex = Math.floor(Math.random() * recentUsers.length);
			recentUsers = recentUsers.filter((_, index) => index !== randomIndex);
		}
	}

	function handleVCChange(change: number) {
		visioncreators.update((value) => Math.max(0, value + change));
		if (change > 0) {
			addRandomUser();
		} else if (change < 0 && recentUsers.length > 0) {
			removeRandomUser();
		}
	}
</script>

<main class="flex w-screen h-screen bg-surface-900 text-surface-50 overflow-hidden">
	<div class="flex-grow overflow-auto p-4">
		<div
			class="grid gap-4 w-full box-border"
			style="grid-template-columns: repeat({gridColumns}, 1fr);"
		>
			{#each fibonacciMilestones as milestone, index (milestone.value)}
				{#if states[index] === 'completed'}
					<div
						class="bg-success-500/30 flex flex-col justify-center items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[140px] rounded-lg shadow-lg"
					>
						<span class="text-3xl font-bold text-surface-50"
							>{milestone.value.toLocaleString()}</span
						>
						<span class="text-sm mt-2 text-surface-100">{formatDate(milestone.date)}</span>
					</div>
				{:else if states[index] === 'in-progress'}
					<div
						class="card bg-warning-500 flex flex-col justify-between items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[140px] rounded-lg shadow-lg"
					>
						<div
							class="w-full h-full absolute top-0 left-0 bg-success-500/30 rounded-lg transition-all duration-300 ease-in-out animate-pulse"
							style="width: {Math.max(
								1,
								getProgressPercentage(milestone.value, fibonacciMilestones[index - 1]?.value || 0)
							)}%"
						/>

						<div class="flex flex-col items-center z-10 mt-4">
							<span class="text-2xl font-bold text-surface-50"
								>{(milestone.value - $visioncreators).toLocaleString()} left</span
							>
							<span class="text-sm mt-2 text-surface-100">
								{#if milestone.date > new Date()}
									{formatTimeRemaining(milestone.date)}
								{:else}
									Milestone Reached
								{/if}
							</span>
							<span class="text-xs text-center mt-1 text-surface-200">
								earn <span class="text-success-500"
									>+{formatCurrency((milestone.vcPool || 0) / milestone.value)}/m</span
								> <br />per invite
							</span>
						</div>
					</div>
				{:else}
					<div
						class="card bg-surface-700/30 flex flex-col justify-center items-center p-4 transition-all duration-200 hover:scale-105 relative overflow-hidden min-h-[140px] rounded-lg shadow-lg cursor-pointer"
						on:click={() => (milestone.showDetails = !milestone.showDetails)}
					>
						{#if !milestone.showDetails}
							<div class="flex flex-col items-center">
								<Icon icon="mdi:lock" class="text-4xl mb-2 text-surface-400" />
								<span class="text-2xl font-bold text-surface-400"
									>{milestone.value.toLocaleString()}</span
								>
								{#if index > 0}
									{@const activeMilestone = fibonacciMilestones.find(
										(m) => states[fibonacciMilestones.indexOf(m)] === 'in-progress'
									)}
									{#if activeMilestone}
										<span class="text-xs text-center mt-1 text-surface-400">
											earn {formatCurrency((milestone.vcPool || 0) / milestone.value)}/m <br />per
											invite
										</span>
									{/if}
								{/if}
							</div>
						{:else}
							<div class="flex flex-col items-center w-full">
								<span class="text-sm text-surface-400"
									>{formatDate(milestone.date)} +{milestone.daysSincePrevious}d</span
								>
								<span class="text-sm text-surface-400" />
								<span class="text-xs mt-1 text-surface-400"
									>Total pool: {formatCurrency(milestone.poolAmount).split('.')[0]}</span
								>
								<span class="text-xs mt-1 text-surface-400"
									>Platform fee: {formatCurrency(milestone.platformFeeAmount || 0).split(
										'.'
									)[0]}</span
								>
								<span class="text-xs mt-1 text-surface-400"
									>Startup fund: {formatCurrency(milestone.startupFund || 0).split('.')[0]}</span
								>
								<span class="text-xs mt-1 text-surface-400"
									>VC pool: {formatCurrency(milestone.vcPool || 0).split('.')[0]}</span
								>
								<span class="text-xs mt-1 text-surface-400"
									>VC percentage: {milestone.provisionPercentage.toFixed(2)}%</span
								>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<aside class="w-64 bg-surface-800 flex flex-col p-4">
		<div class="flex-grow overflow-auto">
			<h3 class="text-lg font-semibold mb-4">Recent VisionCreators</h3>
			<ul class="space-y-2">
				{#each recentUsers as user (user.id)}
					<li
						class="flex items-center justify-between rounded-xl bg-surface-700 p-2"
						transition:fade
					>
						<Avatar
							me={{
								data: { seed: user.identifier },
								design: { highlight: false },
								size: 'sm'
							}}
						/>
						<div class="flex-1 px-2 flex flex-col">
							<span class="text-sm text-tertiary-400">{user.name}</span>
							<span class="text-xs text-tertiary-600"
								>now earns {formatCurrency(user.earnings)}/m</span
							>
						</div>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-4">
			<div class="grid grid-cols-2 gap-2 w-full">
				{#each [1] as value}
					<button
						on:click={() => handleVCChange(-value)}
						class="btn variant-filled-surface text-sm py-1"
					>
						-{value}
					</button>
					<button
						on:click={() => handleVCChange(value)}
						class="btn variant-filled-surface text-sm py-1"
					>
						+{value}
					</button>
				{/each}
			</div>
		</div>
	</aside>
</main>
