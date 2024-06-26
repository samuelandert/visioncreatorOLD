import { env } from '$env/dynamic/private';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';

const anthropic = new Anthropic({
  apiKey: env.SECRET_ANTHROPIC_API_KEY,
});

const CLAUDE_FILE_PATH = path.resolve('src/lib/components/Claude.svelte');

async function writeFileContent(filePath, content) {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Error writing file:', error);
    throw new Error('Error writing file');
  }
}

export async function POST({ request }) {
  const { messages, hardcodedContent } = await request.json();

  if (hardcodedContent) {
    try {
      await writeFileContent(CLAUDE_FILE_PATH, hardcodedContent);
      return json({ content: 'File written successfully' });
    } catch (error) {
      console.error('Error writing hardcoded content:', error);
      return json({ error: 'Error writing hardcoded content' }, { status: 500 });
    }
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: messages,
      system: "You are a Svelte component engineer AI assistant. You can create, modify, and explain Svelte components. When asked to create a component, always wrap the Svelte code in ```svelte code blocks.",
    });

    const assistantMessage = response.content[0].text;
    const svelteCodeMatch = assistantMessage.match(/```svelte\n([\s\S]*?)\n```/);

    if (svelteCodeMatch) {
      const svelteCode = svelteCodeMatch[1].trim();
      await writeFileContent(CLAUDE_FILE_PATH, svelteCode);
    }

    return json({ content: assistantMessage });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}