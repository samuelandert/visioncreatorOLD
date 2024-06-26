<script lang="ts">
	import { chatWithClaude } from '$lib/api';
	import SvelteMarkdown from 'svelte-markdown';
	import ComponentList from '$lib/OLD.svelte';

	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let messages: Message[] = [];
	let userInput = '';
	let isLoading = false;
	let componentCode = '';

	function extractSvelteCode(text: string): string {
		const codeMatch = text.match(/```svelte\n([\s\S]*?)\n```/);
		return codeMatch ? codeMatch[1].trim() : '';
	}

	async function handleSubmit() {
		if (!userInput.trim()) return;

		const userMessage: Message = { role: 'user', content: userInput };
		messages = [...messages, userMessage];
		isLoading = true;

		try {
			const assistantResponse = await chatWithClaude(messages);
			messages = [...messages, { role: 'assistant', content: assistantResponse }];

			// Extract Svelte component code from the response
			componentCode = extractSvelteCode(assistantResponse);
		} catch (error) {
			console.error('Error:', error);
			messages = [...messages, { role: 'assistant', content: 'Sorry, an error occurred.' }];
		}

		isLoading = false;
		userInput = '';
	}
</script>

<main class="h-screen w-screen flex flex-col">
	<div class="flex flex-1 space-x-4">
		<div class="w-1/2 flex flex-col p-4">
			<h1 class="text-2xl font-bold mb-4">SvelteAI</h1>

			<div class="flex-1 bg-gray-100 p-4 overflow-y-auto mb-4 rounded">
				{#each messages as message}
					<div class="mb-4">
						<strong>{message.role === 'user' ? 'You:' : 'AI:'}</strong>
						<SvelteMarkdown source={message.content} />
					</div>
				{/each}
				{#if isLoading}
					<p>Loading...</p>
				{/if}
			</div>

			<form on:submit|preventDefault={handleSubmit} class="flex">
				<input
					type="text"
					bind:value={userInput}
					placeholder="Type your message..."
					class="flex-grow border p-2 rounded-l"
				/>
				<button type="submit" class="bg-blue-500 text-white p-2 rounded-r">Send</button>
			</form>
		</div>

		<div class="w-1/2 flex flex-col">
			<ComponentList />
		</div>
	</div>
</main>
