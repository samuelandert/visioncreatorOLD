import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { vcTheme } from './vc-theme'

export default {
	darkMode: 'selector',
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
					vcTheme
				],
			},

		}),
	],
} satisfies Config;
