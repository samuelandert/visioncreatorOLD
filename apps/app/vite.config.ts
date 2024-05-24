import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import autoImport from 'composer';

export default defineConfig({
	plugins: [
		autoImport({
			include: ['**/*.(svelte)'],
			components: [
				'./src/lib/components',
			],
			mapping: {
				testMe: `import testMe from '$lib/composables/testMe.ts'`,
				UserSchema: `import { UserSchema } from '$lib/composables/UserSchema'`,
				Icon: `import Icon from '@iconify/svelte';`,
			},
			module: {
				svelte: ['onMount']
			},
		}),
		sveltekit(),
		purgeCss(),
	],
	build: {
		rollupOptions: {
			preserveEntrySignatures: 'strict'
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});


