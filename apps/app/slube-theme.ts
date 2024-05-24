
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const slubeTheme: CustomThemeConfig = {
    name: 'slube-theme',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `'Poppins', sans-serif`,
        "--theme-font-family-heading": `'Poppins', sans-serif`,
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "16px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "255 255 255",
        "--on-secondary": "255 255 255",
        "--on-tertiary": "0 0 0",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "255 255 255",
        "--on-surface": "255 255 255",
        // =~= Theme Colors  =~=
        // primary | #00BFFF 
        "--color-primary-50": "217 245 255", // #d9f5ff
        "--color-primary-100": "204 242 255", // #ccf2ff
        "--color-primary-200": "191 239 255", // #bfefff
        "--color-primary-300": "153 229 255", // #99e5ff
        "--color-primary-400": "77 210 255", // #4dd2ff
        "--color-primary-500": "0 191 255", // #00BFFF
        "--color-primary-600": "0 172 230", // #00ace6
        "--color-primary-700": "0 143 191", // #008fbf
        "--color-primary-800": "0 115 153", // #007399
        "--color-primary-900": "0 94 125", // #005e7d
        // secondary | #074154 
        "--color-secondary-50": "218 227 229", // #dae3e5
        "--color-secondary-100": "205 217 221", // #cdd9dd
        "--color-secondary-200": "193 208 212", // #c1d0d4
        "--color-secondary-300": "156 179 187", // #9cb3bb
        "--color-secondary-400": "81 122 135", // #517a87
        "--color-secondary-500": "7 65 84", // #074154
        "--color-secondary-600": "6 59 76", // #063b4c
        "--color-secondary-700": "5 49 63", // #05313f
        "--color-secondary-800": "4 39 50", // #042732
        "--color-secondary-900": "3 32 41", // #032029
        // tertiary | #5B8DEF 
        "--color-tertiary-50": "230 238 253", // #e6eefd
        "--color-tertiary-100": "222 232 252", // #dee8fc
        "--color-tertiary-200": "214 227 251", // #d6e3fb
        "--color-tertiary-300": "189 209 249", // #bdd1f9
        "--color-tertiary-400": "140 175 244", // #8caff4
        "--color-tertiary-500": "91 141 239", // #5B8DEF
        "--color-tertiary-600": "82 127 215", // #527fd7
        "--color-tertiary-700": "68 106 179", // #446ab3
        "--color-tertiary-800": "55 85 143", // #37558f
        "--color-tertiary-900": "45 69 117", // #2d4575
        // success | #39D98A 
        "--color-success-50": "225 249 237", // #e1f9ed
        "--color-success-100": "215 247 232", // #d7f7e8
        "--color-success-200": "206 246 226", // #cef6e2
        "--color-success-300": "176 240 208", // #b0f0d0
        "--color-success-400": "116 228 173", // #74e4ad
        "--color-success-500": "57 217 138", // #39D98A
        "--color-success-600": "51 195 124", // #33c37c
        "--color-success-700": "43 163 104", // #2ba368
        "--color-success-800": "34 130 83", // #228253
        "--color-success-900": "28 106 68", // #1c6a44
        // warning | #FDAC42 
        "--color-warning-50": "255 243 227", // #fff3e3
        "--color-warning-100": "255 238 217", // #ffeed9
        "--color-warning-200": "255 234 208", // #ffead0
        "--color-warning-300": "254 222 179", // #fedeb3
        "--color-warning-400": "254 197 123", // #fec57b
        "--color-warning-500": "253 172 66", // #FDAC42
        "--color-warning-600": "228 155 59", // #e49b3b
        "--color-warning-700": "190 129 50", // #be8132
        "--color-warning-800": "152 103 40", // #986728
        "--color-warning-900": "124 84 32", // #7c5420
        // error | #FF5C5C 
        "--color-error-50": "255 231 231", // #ffe7e7
        "--color-error-100": "255 222 222", // #ffdede
        "--color-error-200": "255 214 214", // #ffd6d6
        "--color-error-300": "255 190 190", // #ffbebe
        "--color-error-400": "255 141 141", // #ff8d8d
        "--color-error-500": "255 92 92", // #FF5C5C
        "--color-error-600": "230 83 83", // #e65353
        "--color-error-700": "191 69 69", // #bf4545
        "--color-error-800": "153 55 55", // #993737
        "--color-error-900": "125 45 45", // #7d2d2d
        // surface | #495a8f 
        "--color-surface-50": "228 230 238", // #e4e6ee
        "--color-surface-100": "219 222 233", // #dbdee9
        "--color-surface-200": "210 214 227", // #d2d6e3
        "--color-surface-300": "182 189 210", // #b6bdd2
        "--color-surface-400": "128 140 177", // #808cb1
        "--color-surface-500": "73 90 143", // #495a8f
        "--color-surface-600": "66 81 129", // #425181
        "--color-surface-700": "55 68 107", // #37446b
        "--color-surface-800": "44 54 86", // #2c3656
        "--color-surface-900": "36 44 70", // #242c46

    }
}