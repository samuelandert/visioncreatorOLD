<script lang="ts">
  import { writable } from 'svelte/store';

  interface Expense {
    id: number;
    description: string;
    amount: number;
    paidBy: string;
    splitWith: string[];
  }

  interface Balance {
    [key: string]: number;
  }

  const expenses = writable<Expense[]>([]);
  const balances = writable<Balance>({});
  const friends = writable<string[]>([]);

  let description = '';
  let amount = 0;
  let paidBy = '';
  let splitWith: string[] = [];
  let newFriend = '';

  function addExpense() {
    if (description && amount > 0 && paidBy && splitWith.length > 0) {
      expenses.update(exp => [...exp, {
        id: Date.now(),
        description,
        amount,
        paidBy,
        splitWith
      }]);
      updateBalances();
      resetForm();
    }
  }

  function updateBalances() {
    expenses.subscribe(exp => {
      const newBalances: Balance = {};
      exp.forEach(expense => {
        const share = expense.amount / (expense.splitWith.length + 1);
        newBalances[expense.paidBy] = (newBalances[expense.paidBy] || 0) + expense.amount;
        expense.splitWith.forEach(friend => {
          newBalances[friend] = (newBalances[friend] || 0) - share;
        });
        newBalances[expense.paidBy] -= share;
      });
      balances.set(newBalances);
    });
  }

  function resetForm() {
    description = '';
    amount = 0;
    paidBy = '';
    splitWith = [];
  }

  function addFriend() {
    if (newFriend && !$friends.includes(newFriend)) {
      friends.update(f => [...f, newFriend]);
      newFriend = '';
    }
  }
</script>

<div class="flex items-center justify-center w-full h-full bg-surface-800 text-gray-100">
  <div class="p-8 bg-surface-700 rounded-lg shadow-xl w-96">
    <h1 class="mb-4 text-2xl font-bold text-center text-blue-300">Simple Splitwise Clone</h1>

    <div class="mb-4">
      <input
        bind:value={newFriend}
        placeholder="Add new friend"
        class="w-3/4 p-2 mr-2 border rounded bg-surface-600 text-gray-100 border-gray-600 placeholder-gray-400"
      />
      <button
        on:click={addFriend}
        class="w-1/4 p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </div>

    {#if $friends.length > 0}
      <div class="mb-4">
        <input
          bind:value={description}
          placeholder="Expense description"
          class="w-full p-2 mb-2 border rounded bg-surface-600 text-gray-100 border-gray-600 placeholder-gray-400"
        />
        <input
          type="number"
          bind:value={amount}
          placeholder="Amount"
          class="w-full p-2 mb-2 border rounded bg-surface-600 text-gray-100 border-gray-600 placeholder-gray-400"
        />
        <select bind:value={paidBy} class="w-full p-2 mb-2 border rounded bg-surface-600 text-gray-100 border-gray-600">
          <option value="">Who paid?</option>
          {#each $friends as friend}
            <option value={friend}>{friend}</option>
          {/each}
        </select>
        <div class="mb-2">Split with:</div>
        {#each $friends as friend}
          <label class="block">
            <input type="checkbox" bind:group={splitWith} value={friend} class="mr-2 bg-surface-600 border-gray-600" />
            {friend}
          </label>
        {/each}
      </div>

      <button
        on:click={addExpense}
        class="w-full p-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>

      <h2 class="mb-2 text-xl font-bold text-blue-300">Expenses</h2>
      {#each $expenses as expense}
        <div class="mb-2 p-2 border rounded border-gray-600 bg-surface-600">
          <p><strong>{expense.description}</strong> - ${expense.amount}</p>
          <p>Paid by: {expense.paidBy}</p>
          <p>Split with: {expense.splitWith.join(', ')}</p>
        </div>
      {/each}

      <h2 class="mb-2 text-xl font-bold text-blue-300">Balances</h2>
      {#each Object.entries($balances) as [friend, balance]}
        <p>
          {friend}: ${balance.toFixed(2)}
          {#if balance > 0}
            <span class="text-green-400">(to receive)</span>
          {:else if balance < 0}
            <span class="text-red-400">(to pay)</span>
          {/if}
        </p>
      {/each}
    {:else}
      <p class="text-center text-gray-400">Add friends to start splitting expenses!</p>
    {/if}
  </div>
</div>