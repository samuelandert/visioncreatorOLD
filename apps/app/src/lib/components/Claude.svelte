<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Transaction {
		id: string;
		date: Date;
		description: string;
		amount: number;
		type: 'income' | 'expense';
		category: string;
	}

	const balance = writable(0);
	let transactions: Transaction[] = [];

	function generateRandomTransactions(count: number): Transaction[] {
		const descriptions = [
			'Grocery shopping',
			'Salary deposit',
			'Rent payment',
			'Utility bill',
			'Restaurant dinner',
			'Online purchase',
			'ATM withdrawal',
			'Transfer from savings',
			'Subscription fee',
			'Refund'
		];

		const categories = [
			'Food & Dining',
			'Income',
			'Housing',
			'Utilities',
			'Entertainment',
			'Shopping',
			'Cash',
			'Transfer',
			'Subscriptions',
			'Refund'
		];

		return Array.from({ length: count }, () => ({
			id: Math.random().toString(36).substr(2, 9),
			date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
			description: descriptions[Math.floor(Math.random() * descriptions.length)],
			amount: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
			type: Math.random() > 0.5 ? 'income' : 'expense',
			category: categories[Math.floor(Math.random() * categories.length)]
		}));
	}

	onMount(() => {
		transactions = generateRandomTransactions(20).sort((a, b) => b.date.getTime() - a.date.getTime());
		balance.set(transactions.reduce((sum, t) => sum + t.amount, 1000));
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}

	function formatRelativeTime(date: Date): string {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
		if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
		if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
		return `${Math.floor(diffInSeconds / 31536000)} years ago`;
	}

	function sendMoney() {
		const amount = parseFloat(prompt('Enter the amount to send:') || '0');
		if (isNaN(amount) || amount <= 0) {
			alert('Please enter a valid positive number.');
			return;
		}

		let currentBalance: number;
		balance.subscribe((value) => {
			currentBalance = value;
		})();

		if (amount > currentBalance) {
			alert('Insufficient funds. You cannot send more than your current balance.');
			return;
		}

		const newTransaction: Transaction = {
			id: Math.random().toString(36).substr(2, 9),
			date: new Date(),
			description: 'Money sent',
			amount: -amount,
			type: 'expense',
			category: 'Transfer'
		};

		transactions = [newTransaction, ...transactions];
		balance.update((b) => b - amount);
	}
</script>

<div class="flex flex-col w-full h-full overflow-hidden text-gray-800 bg-gray-100">
	<div class="p-6 mb-6 text-center text-white bg-blue-600">
		<h1 class="mb-2 text-2xl font-bold">Current Balance</h1>
		<p class="text-6xl font-bold">{formatCurrency($balance)}</p>
	</div>

	<div class="flex-grow px-6 overflow-y-auto">
		<h2 class="mb-4 text-xl font-bold">Recent Transactions</h2>
		<div class="bg-white rounded-lg shadow">
			{#each transactions as transaction (transaction.id)}
				<div class="flex items-center justify-between p-4 border-b border-gray-200">
					<div class="flex-grow">
						<p class="font-semibold">{transaction.description}</p>
						<p class="text-xs text-gray-400">{transaction.category}</p>
					</div>
					<div class="flex flex-col items-end">
						<p
							class="{transaction.type === 'income'
								? 'text-green-600'
								: 'text-red-600'} font-bold text-xl"
						>
							{transaction.type === 'income' ? '+' : '-'}{formatCurrency(
								Math.abs(transaction.amount)
							)}
						</p>
						<p class="text-xs text-gray-400">{formatRelativeTime(transaction.date)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="p-4 bg-blue-600">
		<div class="max-w-md mx-auto">
			<button
				on:click={sendMoney}
				class="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-800 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
			>
				Send Money
			</button>
		</div>
	</div>
</div>