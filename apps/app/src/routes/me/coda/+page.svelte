<script lang="ts">
	import { createQuery } from '$lib/wundergraph';

	const getTodos = createQuery({
		operationName: 'listTodos'
	});
</script>

<div class="m-10">
	<div class="space-y-4">
		{#if $getTodos.isLoading}
			<p>Loading todos...</p>
		{:else if $getTodos.error}
			<p>Error: {$getTodos.error?.message}</p>
		{:else if $getTodos.data}
			{#each $getTodos.data.items as todo}
				<div
					style="background-color: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1rem; margin-bottom: 1rem;"
				>
					<div style="font-size: 1.125rem; font-weight: 600;">{todo.name}</div>
					<p>ID: {todo.id}</p>
					<p>Created At: {todo.createdAt}</p>
					<p>Updated At: {todo.updatedAt}</p>
					<a
						href={todo.browserLink}
						style="color: #3B82F6; text-decoration: none; hover:text-decoration: underline;"
						>View in Browser</a
					>
					<div style="margin-top: 0.5rem;">
						<p>Status: {todo.values['c-CbKIDPh9ou']}</p>
						<p>Details: {todo.values['c-RCQLvQkjDW']}</p>
					</div>
				</div>
			{/each}
		{:else}
			<p>No todos found.</p>
		{/if}
	</div>
</div>
