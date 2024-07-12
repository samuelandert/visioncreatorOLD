import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { vcTheme } from './src/lib/themes/vcTheme'

export default {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			fontSize: {
				'3xs': '8px',
				'2xs': '10px',
				'7xl': '5rem',
				'8xl': '6rem',
				'9xl': '7rem'
			},
			gridTemplateColumns: {
				'16': 'repeat(16, minmax(0, 1fr))',
			},
			maxHeight: {
				'128': '32rem',
			},
			letterSpacing: {
				tightest: '-.05em',
				tighter: '-.025em',
				tight: '-.01em',
				normal: '.01em',
				wide: '.025em',
				wider: '.05em',
				widest: '.1em',
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
				'6xl': '3rem',
				'7xl': '3.5rem',
			},
		},
	},
	plugins: [
		forms,
		typography,
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/container-queries'),
		skeleton({
			themes: {
				custom: [
					vcTheme
				],
			},

		}),
	],
} satisfies Config;
