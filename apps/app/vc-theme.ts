import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const vcTheme: CustomThemeConfig = {
    name: 'vc-theme',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `'Rethink', sans-serif`,
        "--theme-font-family-heading": `'VisioncreatorFamily', sans-serif`,
        "--theme-font-color-base": "var(--color-surface-800)",
        "--theme-font-color-dark": "var(--color-tertiary-300)",
        "--theme-rounded-base": "9999px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "var(--color-surface-800)",
        "--on-secondary": "var(--color-surface-800)",
        "--on-tertiary": "var(--color-surface-800)",
        "--on-success": "var(--color-surface-800)",
        "--on-warning": "var(--color-surface-800)",
        "--on-error": "var(--color-tertiary-300)",
        "--on-surface": "var(--color-tertiary-300)",
        // =~= Theme Colors  =~=
        // primary | #e9c96e 
        "--color-primary-50": "252 247 233", // #fcf7e9
        "--color-primary-100": "251 244 226", // #fbf4e2
        "--color-primary-200": "250 242 219", // #faf2db
        "--color-primary-300": "246 233 197", // #f6e9c5
        "--color-primary-400": "240 217 154", // #f0d99a
        "--color-primary-500": "233 201 110", // #e9c96e
        "--color-primary-600": "210 181 99", // #d2b563
        "--color-primary-700": "175 151 83", // #af9753
        "--color-primary-800": "140 121 66", // #8c7942
        "--color-primary-900": "114 98 54", // #726236
        // secondary | #40b7c8 
        "--color-secondary-50": "226 244 247", // #e2f4f7
        "--color-secondary-100": "217 241 244", // #d9f1f4
        "--color-secondary-200": "207 237 241", // #cfedf1
        "--color-secondary-300": "179 226 233", // #b3e2e9
        "--color-secondary-400": "121 205 217", // #79cdd9
        "--color-secondary-500": "64 183 200", // #40b7c8
        "--color-secondary-600": "58 165 180", // #3aa5b4
        "--color-secondary-700": "48 137 150", // #308996
        "--color-secondary-800": "38 110 120", // #266e78
        "--color-secondary-900": "31 90 98", // #1f5a62
        // tertiary | #dad3be 
        "--color-tertiary-50": "249 248 245", // #f9f8f5
        "--color-tertiary-100": "248 246 242", // #f8f6f2
        "--color-tertiary-200": "246 244 239", // #f6f4ef
        "--color-tertiary-300": "240 237 229", // #f0ede5
        "--color-tertiary-400": "229 224 210", // #e5e0d2
        "--color-tertiary-500": "218 211 190", // #dad3be
        "--color-tertiary-600": "196 190 171", // #c4beab
        "--color-tertiary-700": "164 158 143", // #a49e8f
        "--color-tertiary-800": "131 127 114", // #837f72
        "--color-tertiary-900": "107 103 93", // #6b675d
        // success | #7dc07c 
        "--color-success-50": "236 246 235", // #ecf6eb
        "--color-success-100": "229 242 229", // #e5f2e5
        "--color-success-200": "223 239 222", // #dfefde
        "--color-success-300": "203 230 203", // #cbe6cb
        "--color-success-400": "164 211 163", // #a4d3a3
        "--color-success-500": "125 192 124", // #7dc07c
        "--color-success-600": "113 173 112", // #71ad70
        "--color-success-700": "94 144 93", // #5e905d
        "--color-success-800": "75 115 74", // #4b734a
        "--color-success-900": "61 94 61", // #3d5e3d
        // warning | #d79a60 
        "--color-warning-50": "249 240 231", // #f9f0e7
        "--color-warning-100": "247 235 223", // #f7ebdf
        "--color-warning-200": "245 230 215", // #f5e6d7
        "--color-warning-300": "239 215 191", // #efd7bf
        "--color-warning-400": "227 184 144", // #e3b890
        "--color-warning-500": "215 154 96", // #d79a60
        "--color-warning-600": "194 139 86", // #c28b56
        "--color-warning-700": "161 116 72", // #a17448
        "--color-warning-800": "129 92 58", // #815c3a
        "--color-warning-900": "105 75 47", // #694b2f
        // error | #b05e7b 
        "--color-error-50": "243 231 235", // #f3e7eb
        "--color-error-100": "239 223 229", // #efdfe5
        "--color-error-200": "235 215 222", // #ebd7de
        "--color-error-300": "223 191 202", // #dfbfca
        "--color-error-400": "200 142 163", // #c88ea3
        "--color-error-500": "176 94 123", // #b05e7b
        "--color-error-600": "158 85 111", // #9e556f
        "--color-error-700": "132 71 92", // #84475c
        "--color-error-800": "106 56 74", // #6a384a
        "--color-error-900": "86 46 60", // #562e3c
        // surface | #1a2366 
        "--color-surface-50": "221 222 232", // #dddee8
        "--color-surface-100": "209 211 224", // #d1d3e0
        "--color-surface-200": "198 200 217", // #c6c8d9
        "--color-surface-300": "163 167 194", // #a3a7c2
        "--color-surface-400": "95 101 148", // #5f6594
        "--color-surface-500": "26 35 102", // #1a2366
        "--color-surface-600": "23 32 92", // #17205c
        "--color-surface-700": "20 26 77", // #141a4d
        "--color-surface-800": "16 21 61", // #10153d
        "--color-surface-900": "13 17 50", // #0d1132
    }
}