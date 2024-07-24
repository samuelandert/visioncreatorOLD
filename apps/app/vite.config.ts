import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import autoImport from 'composer';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';


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
		SvelteKitPWA({
			srcDir: 'src',
			outDir: '.svelte-kit/output/client',
			mode: 'production',
			strategies: 'generateSW',
			filename: 'service-worker.js',
			scope: '/',
			base: '/',
			manifest: {
				short_name: "VC",
				name: "Visioncreator",
				start_url: "/",
				scope: "/",
				display: "standalone",
				theme_color: "#000000",
				background_color: "#ffffff",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png"
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png"
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
				globIgnores: ['**/node_modules/**/*', '**/chrome-extension://**/*']
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/'
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		})

	],
	assetsInclude: ['**/*.txt'],
	define: {
		'import.meta.env.BASE_PATH': JSON.stringify('/src/')
	},
	build: {
		rollupOptions: {
			preserveEntrySignatures: 'strict'
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		host: true
	},
});


