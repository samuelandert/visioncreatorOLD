<script lang="ts">
	import { onMount } from 'svelte';
	import { Ollama } from 'ollama/browser';
	import systemPromptText from '$lib/prompts/artifacts.txt?raw';

	let messages: { role: string; content: string }[] = [];
	let inputMessage = '';
	let ollama: Ollama;
	let streamingMessage = '';
	let isStreaming = false;
	let systemPrompt = systemPromptText;

	onMount(() => {
		ollama = new Ollama({ host: 'https://ollama-demo.fly.dev' });
	});

	async function sendMessage() {
		if (!inputMessage.trim()) return;

		const userMessage = { role: 'user', content: inputMessage };
		messages = [...messages, userMessage];
		inputMessage = '';
		isStreaming = true;
		streamingMessage = '';

		try {
			const stream = await ollama.chat({
				model: 'llama3',
				messages: [{ role: 'system', content: systemPrompt }, ...messages],
				stream: true
			});

			for await (const chunk of stream) {
				streamingMessage += chunk.message.content;
			}

			const assistantMessage = { role: 'assistant', content: streamingMessage };
			messages = [...messages, assistantMessage];
		} catch (error) {
			console.error('Error communicating with Ollama:', error);
			messages = [
				...messages,
				{ role: 'assistant', content: 'Sorry, there was an error processing your request.' }
			];
		} finally {
			isStreaming = false;
			streamingMessage = '';
		}
	}
</script>

<div class="flex flex-col w-screen h-screen overflow-hidden">
	<div class="flex-grow p-4 space-y-4 overflow-y-auto">
		{#each messages as message}
			<div
				class="card p-4 {message.role === 'user'
					? 'variant-soft-primary ml-auto'
					: 'variant-soft-surface mr-auto'} max-w-[70%]"
			>
				<p class="font-bold">{message.role}:</p>
				<p>{message.content}</p>
			</div>
		{/each}
		{#if isStreaming}
			<div class="card p-4 variant-soft-surface mr-auto max-w-[70%]">
				<p class="font-bold">assistant:</p>
				<p>{streamingMessage}</p>
			</div>
		{/if}
	</div>
	<div class="p-4 bg-surface-100-800-token">
		<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
			<input
				class="bg-transparent border-0 ring-0 focus:ring-0"
				type="text"
				bind:value={inputMessage}
				on:keypress={(e) => e.key === 'Enter' && !isStreaming && sendMessage()}
				placeholder="Type your message..."
				disabled={isStreaming}
			/>
			<button class="variant-filled-primary" on:click={sendMessage} disabled={isStreaming}>
				{isStreaming ? 'Streaming...' : 'Send'}
			</button>
		</div>
	</div>
</div>
