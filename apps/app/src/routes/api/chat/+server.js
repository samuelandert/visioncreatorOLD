import { env } from '$env/dynamic/private'
import Anthropic from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';

const anthropic = new Anthropic({
  apiKey: env.SECRET_ANTHROPIC_API_KEY,
});

export async function POST({ request }) {
  const { messages } = await request.json();

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: messages,
      system: "You are a Svelte component engineer AI assistant. You can create, modify, and explain Svelte components. When asked to create a component, always wrap the Svelte code in ```svelte code blocks.",
    });

    return json({ content: response.content[0].text });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}