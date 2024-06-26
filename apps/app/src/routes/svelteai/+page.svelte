<script lang="ts">
	import { chatWithClaude } from '$lib/api';
	import SvelteMarkdown from 'svelte-markdown';
	import Preview from '$lib/Preview.svelte';

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

			// Send the extracted Svelte code to the API to write to the file
			await writeSvelteCodeToFile(componentCode);
		} catch (error) {
			console.error('Error:', error);
			messages = [...messages, { role: 'assistant', content: 'Sorry, an error occurred.' }];
		}

		isLoading = false;
		userInput = '';
	}

	async function writeSvelteCodeToFile(svelteCode: string) {
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ svelteCode })
			});

			const data = await response.json();
			console.log(data.content);
		} catch (error) {
			console.error('Error writing Svelte code to file:', error);
		}
	}
</script>

<main class="flex flex-col w-screen h-screen">
	<div class="flex flex-1 space-x-4">
		<div class="flex flex-col w-1/2 p-4">
			<h1 class="mb-4 text-2xl font-bold">SvelteAI</h1>

			<div
				class="flex-1 p-4 mb-4 overflow-y-auto max-h-[calc(100vh-200px)] rounded bg-tertiary-300 text-surface-700"
			>
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
					class="flex-grow p-2 rounded-l text-surface-800"
				/>
				<button type="submit" class="p-2 text-white rounded-r bg-primary-500">Send</button>
			</form>
		</div>

		<div class="flex flex-col w-1/2">
			<Preview />
		</div>
	</div>
</main>
