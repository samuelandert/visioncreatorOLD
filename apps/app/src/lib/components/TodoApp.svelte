<script lang="ts">
  import { fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let todos = [
    { id: 1, text: 'Learn Svelte', completed: false },
    { id: 2, text: 'Build a Svelte app', completed: false },
    { id: 3, text: 'Deploy the Svelte app', completed: false },
  ];

  let newTodo = '';

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, { id: todos.length + 1, text: newTodo.trim(), completed: false }];
      newTodo = '';
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  function toggleTodo(todo) {
    todo.completed = !todo.completed;
    todos = todos;
  }

  function deleteTodo(todo) {
    todos = todos.filter((t) => t !== todo);
  }
</script>

<div class="w-full h-full flex justify-center">
  <div class="m-8 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-surface-800">Todo App</h1>
    <div class="mb-4">
      <input
        class="w-full px-3 py-2 text-surface-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
        type="text"
        placeholder="Add a new todo..."
        bind:value={newTodo}
        on:keydown={handleKeyDown}
      />
      <button
        class="mt-2 px-4 py-2 bg-primary-500 text-surface-800 rounded-md hover:bg-primary-400 transition-colors duration-200"
        on:click={addTodo}
      >
        Add Todo
      </button>
    </div>
    {#each todos as todo (todo.id)}
      <div
        class="flex items-center mb-2 px-4 py-2 bg-gray-100 rounded-md transition-all duration-200"
        in:fade={{ delay: 100, duration: 200, easing: quintOut }}
        out:fade={{ duration: 100 }}
      >
        <input
          type="checkbox"
          class="mr-2 text-surface-800 focus:ring-primary-600"
          bind:checked={todo.completed}
          on:change={() => toggleTodo(todo)}
        />
        <span class="flex-grow text-surface-800" class:line-through={todo.completed}>{todo.text}</span>
        <button
          class="ml-2 text-surface-800 hover:text-red-700 transition-colors duration-200"
          on:click={() => deleteTodo(todo)}
        >
          <svg
            class="w-4 h-4 fill-current"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/each}
  </div>
</div>