<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }

  const balance = writable(0);
  let transactions: Transaction[] = [];

  function generateRandomTransactions(count: number): Transaction[] {
    const descriptions = [
      'Grocery shopping', 'Salary deposit', 'Rent payment', 'Utility bill',
      'Restaurant dinner', 'Online purchase', 'ATM withdrawal', 'Transfer from savings',
      'Subscription fee', 'Refund'
    ];

    return Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
      type: Math.random() > 0.5 ? 'income' : 'expense'
    }));
  }

  onMount(() => {
    transactions = generateRandomTransactions(20).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    balance.set(transactions.reduce((sum, t) => sum + t.amount, 1000));
  });

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  function sendMoney() {
    const amount = parseFloat(prompt("Enter the amount to send:") || "0");
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    let currentBalance: number;
    balance.subscribe(value => {
      currentBalance = value;
    })();

    if (amount > currentBalance) {
      alert("Insufficient funds. You cannot send more than your current balance.");
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      description: "Money sent",
      amount: -amount,
      type: 'expense'
    };

    transactions = [newTransaction, ...transactions];
    balance.update(b => b - amount);
  }
</script>

<div class="w-full h-full flex flex-col overflow-hidden bg-gray-100 text-gray-800">
  <div class="p-6 mb-6 bg-blue-600 text-white text-center">
    <h1 class="text-2xl font-bold mb-2">Current Balance</h1>
    <p class="text-6xl font-bold">{formatCurrency($balance)}</p>
  </div>

  <div class="px-6 flex-grow overflow-y-auto">
    <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>
    <div class="bg-white rounded-lg shadow">
      {#each transactions as transaction (transaction.id)}
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <p class="font-semibold">{transaction.description}</p>
            <p class="text-sm text-gray-500">{transaction.date}</p>
          </div>
          <p class="{transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} font-bold text-xl">
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
      {/each}
    </div>
  </div>

  <div class="p-4 bg-blue-600">
    <div class="max-w-md mx-auto">
      <button
        on:click={sendMoney}
        class="w-full py-2 px-4 bg-blue-800 text-white font-semibold rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-300"
      >
        Send Money
      </button>
    </div>
  </div>
</div>