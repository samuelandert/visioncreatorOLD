<script lang="ts">
	import { chatWithClaude } from '$lib/api';
	import SvelteMarkdown from 'svelte-markdown';
	import Preview from '$lib/Preview.svelte';
	import { onMount } from 'svelte';

	interface Message {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}

	let messages: Message[] = [];
	let userInput = '';
	let isLoading = false;
	let componentCode = '';
	let showSidebar = true; // Boolean to control sidebar visibility
	let messageContainer: HTMLDivElement;

	function extractSvelteCode(text: string): string {
		const codeMatch = text.match(/```svelte\n([\s\S]*?)\n```/);
		return codeMatch ? codeMatch[1].trim() : '';
	}

	async function handleSubmit() {
		if (!userInput.trim()) return;

		const userMessage: Message = { role: 'user', content: userInput };
		messages = [...messages, userMessage];
		isLoading = true;

		// Clear input field and reset its height immediately
		userInput = '';
		const textarea = document.querySelector('textarea');
		if (textarea) {
			textarea.style.height = 'auto';
		}

		try {
			const assistantResponse = await chatWithClaude(messages);
			messages = [...messages, { role: 'assistant', content: assistantResponse }];

			componentCode = extractSvelteCode(assistantResponse);

			await writeSvelteCodeToFile(componentCode);
		} catch (error) {
			console.error('Error:', error);
		}

		isLoading = false;
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

	function scrollToBottom() {
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}

	onMount(() => {
		scrollToBottom();
	});
</script>

<main class="flex flex-col w-screen h-screen">
	<div class="flex flex-1 overflow-hidden">
		<div class="flex flex-col w-1/4 h-full">
			<h1 class="px-4 pt-4 ml-2 text-2xl font-bold">SvelteAI</h1>
			{#if showSidebar}
				<div class="flex flex-col flex-1 p-4 overflow-hidden">
					<div
						class="flex-1 p-4 mb-4 overflow-y-auto rounded bg-surface-700 text-tertiary-200"
						bind:this={messageContainer}
						on:DOMNodeInserted={scrollToBottom}
					>
						{#each messages as message}
							<div class="mb-2">
								<strong>{message.role === 'user' ? 'You:' : 'Assistant:'}</strong>
								<SvelteMarkdown source={message.content} />
							</div>
						{/each}
						{#if isLoading}
							<div class="mb-2">
								<strong>Assistant:</strong>
								<p>Building...</p>
							</div>
						{/if}
					</div>

					<form on:submit|preventDefault={handleSubmit} class="sticky bottom-0 flex">
						<textarea
							bind:value={userInput}
							placeholder="Type your message..."
							class="flex-grow p-2 border-0 rounded-l resize-none text-tertiary-200 bg-surface-700"
							rows="1"
							on:input={(e) => {
								e.target.style.height = 'auto';
								e.target.style.height = e.target.scrollHeight + 'px';
							}}
							on:keydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
						/>
						<button
							type="submit"
							class="p-2 text-white rounded-r bg-primary-500"
							style="height: 40px;">Send</button
						>
					</form>
				</div>
			{/if}
		</div>
		<div class="flex flex-col flex-1 overflow-y-auto bg-tertiary-200">
			<Preview />
		</div>
	</div>
</main>
