import { promises as fs } from 'fs';
import path from 'path';
import { json } from '@sveltejs/kit';

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
	const { name } = await request.json();
	const newFileName = `o-${name}.svelte`;
	const newFilePath = path.resolve(`src/lib/components/${newFileName}`);

	try {
		const content = await readFileContent(CLAUDE_FILE_PATH);
		await writeFileContent(newFilePath, content);
		return json({ message: 'Component saved successfully' });
	} catch (error) {
		console.error('Error saving component:', error);
		return json({ error: 'Error saving component' }, { status: 500 });
	}
}