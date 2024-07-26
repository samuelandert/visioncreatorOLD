<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Preview from '$lib/Preview.svelte';
	import { onMount } from 'svelte';

	interface Message {
		role: 'user' | 'assistant' | 'system';
		content: string;
		image?: string;
	}

	let messages: Message[] = [];
	let userInput = '';
	let isLoading = false;
	let componentCode = '';
	let showSidebar = true;
	let messageContainer: HTMLDivElement;
	let imageFile: File | null = null;

	function extractSvelteCode(text: string): string {
		const codeMatch = text.match(/```svelte\n([\s\S]*?)\n```/);
		return codeMatch ? codeMatch[1].trim() : '';
	}

	async function handleSubmit() {
		if (!userInput.trim() && !imageFile) return;

		let userMessage: Message = { role: 'user', content: userInput };

		if (imageFile) {
			const base64Image = await fileToBase64(imageFile);
			userMessage.image = base64Image;
		}

		messages = [...messages, userMessage];
		isLoading = true;

		userInput = '';
		imageFile = null;
		const textarea = document.querySelector('textarea');
		if (textarea) {
			textarea.style.height = 'auto';
		}

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			const assistantResponse = data.content;
			messages = [...messages, { role: 'assistant', content: assistantResponse }];

			componentCode = extractSvelteCode(assistantResponse);

			await writeSvelteCodeToFile(componentCode);
		} catch (error) {
			console.error('Error:', error);
		}

		isLoading = false;
	}

	async function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	async function writeSvelteCodeToFile(svelteCode: string) {
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ hardcodedContent: svelteCode })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

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

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			imageFile = target.files[0];
		}
	}
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
								{#if message.image}
									<img src={message.image} alt="Uploaded image" class="h-auto max-w-full mb-2" />
								{/if}
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

					<form on:submit|preventDefault={handleSubmit} class="sticky bottom-0 flex flex-col">
						<div class="flex mb-2">
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
						</div>
						<div class="flex items-center">
							<input
								type="file"
								accept="image/*"
								on:change={handleFileChange}
								class="flex-grow p-2 border-0 rounded text-tertiary-200 bg-surface-700"
							/>
							{#if imageFile}
								<span class="ml-2 text-tertiary-200">{imageFile.name}</span>
							{/if}
						</div>
					</form>
				</div>
			{/if}
		</div>
		<div class="flex flex-col flex-1 overflow-y-auto bg-tertiary-200">
			<Preview />
		</div>
	</div>
</main>
