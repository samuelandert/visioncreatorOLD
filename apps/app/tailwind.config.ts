import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { slubeTheme } from './slube-theme'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			fontSize: {
				xxs: ['10px', '16px'],
			},
			gridTemplateColumns: {
				'16': 'repeat(16, minmax(0, 1fr))',
			},
			maxHeight: {
				'128': '32rem',
			}
		},
	},
	plugins: [
		forms,
		typography,
		require('@tailwindcss/aspect-ratio'),
		skeleton({
			themes: {
				custom: [
					slubeTheme
				],
				// preset: [
				// 	{
				// 		name: 'wintry',
				// 		enhancements: true,
				// 	},
				// ],
			},

		}),
	],
} satisfies Config;
