// Server-side code (e.g., in your API route file)
import { env } from '$env/dynamic/private';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { json } from '@sveltejs/kit';

const anthropic = new Anthropic({
  apiKey: env.SECRET_ANTHROPIC_API_KEY,
});

const CLAUDE_FILE_PATH = path.resolve('src/lib/components/Claude.svelte');

async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Error reading file');
  }
}

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
    const existingComponent = await readFileContent(CLAUDE_FILE_PATH);

    const systemMessage = `You are a Svelte component engineer AI assistant. You can create, modify, and explain Svelte components. When asked to create or modify a component, always wrap the Svelte code in \`\`\`svelte code blocks. Here is the existing Claude.svelte component:\n\n\`\`\`svelte\n${existingComponent}\n\`\`\``;

    const processedMessages = [];
    let lastRole = 'assistant';  

    for (const message of messages) {
      if (message.role !== lastRole) {
        processedMessages.push(message);
        lastRole = message.role;
      } else if (message.role === 'user') {
        processedMessages.push({ role: 'assistant', content: 'Understood. Please continue.' });
        processedMessages.push(message);
        lastRole = 'user';
      }
    }

    if (processedMessages[0]?.role !== 'user') {
      processedMessages.unshift({ role: 'user', content: 'Hello, I need help with a Svelte component.' });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: processedMessages,
      system: systemMessage,
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