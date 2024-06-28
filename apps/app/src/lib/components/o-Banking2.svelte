<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  interface Transaction {
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }

  const balance = writable(2640.24);
  const secondaryBalance = writable(368.00);
  let transactions: Transaction[] = [];

  onMount(() => {
    transactions = [
      { id: '1', date: new Date(), description: 'Receive payment', amount: 24.00, type: 'income' },
      { id: '2', date: new Date(), description: 'Amazon payment', amount: 50.00, type: 'expense' },
      { id: '3', date: new Date(), description: 'PayPal payment', amount: 16.00, type: 'expense' },
    ];
  });

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
</script>

<div class="flex flex-col w-full h-full overflow-hidden text-gray-800 bg-yellow-300">
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Hello, Alexander 👋</h1>
      <button class="text-2xl">🔔</button>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold">BVC</span>
        <span class="font-bold">VISA</span>
      </div>
      <div class="mb-2">
        <span class="text-sm">Available balance</span>
        <h2 class="text-3xl font-bold">{formatCurrency($balance)}</h2>
      </div>
      <span class="text-sm text-gray-500">Card 5679****</span>
    </div>
    
    <div class="bg-gray-100 rounded-lg p-4 mb-4">
      <div class="flex items-center">
        <span class="mr-2">💰</span>
        <div>
          <span class="text-sm">Saving Goal</span>
          <p class="font-semibold">$249.24 from $2,640.24</p>
        </div>
      </div>
    </div>
    
    <h3 class="font-bold mb-2">Recently Payment</h3>
    <div class="bg-white rounded-lg shadow-md">
      {#each transactions as transaction}
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <p class="font-semibold">{transaction.description}</p>
            <p class="text-xs text-gray-400">today, 12:40</p>
          </div>
          <span class="{transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} font-bold">
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        </div>
      {/each}
    </div>
  </div>
  
  <div class="mt-auto p-4 bg-white">
    <div class="flex justify-around">
      <button class="flex flex-col items-center">
        <span class="text-2xl">🏠</span>
        <span class="text-xs">Home</span>
      </button>
      <button class="flex flex-col items-center">
        <span class="text-2xl">💳</span>
        <span class="text-xs">Card</span>
      </button>
      <button class="flex flex-col items-center">
        <span class="text-2xl">🔄</span>
        <span class="text-xs">Transfer</span>
      </button>
      <button class="flex flex-col items-center">
        <span class="text-2xl">👤</span>
        <span class="text-xs">Profile</span>
      </button>
    </div>
  </div>
</div>