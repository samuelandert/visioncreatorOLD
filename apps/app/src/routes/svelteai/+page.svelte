<script lang="ts">
	import { chatWithClaude } from '$lib/api';
	import SvelteMarkdown from 'svelte-markdown';
	import Preview from '$lib/Preview.svelte';

	interface Message {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}

	let messages: Message[] = [];
	let userInput = '';
	let isLoading = false;
	let componentCode = '';
	let showSidebar = true; // Boolean to control sidebar visibility

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

			componentCode = extractSvelteCode(assistantResponse);

			await writeSvelteCodeToFile(componentCode);
		} catch (error) {
			console.error('Error:', error);
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
				body: JSON.stringify({ messages, hardcodedContent: svelteCode })
			});

			const data = await response.json();
			console.log(data.content);
		} catch (error) {
			console.error('Error writing Svelte code to file:', error);
		}
	}

	function toggleSidebar() {
		showSidebar = !showSidebar;
	}
</script>

<main class="flex flex-col w-screen h-screen">
	<div class="flex items-center p-4">
		<button on:click={toggleSidebar} class="p-2 text-white bg-blue-500 rounded">
			{showSidebar ? 'Hide' : 'Show'}
		</button>
		<h1 class="ml-2 text-2xl font-bold">SvelteAI</h1>
	</div>
	<div class="flex flex-1 space-x-4">
		{#if showSidebar}
			<div class="flex flex-col w-1/3 p-4">
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
		{/if}

		<div class="flex flex-col {showSidebar ? 'w-2/3' : 'w-full'}">
			<Preview />
		</div>
	</div>
</main>
