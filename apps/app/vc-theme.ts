import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const vcTheme: CustomThemeConfig = {
    name: 'vc-theme',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `'Poppins', sans-serif`,
        "--theme-font-family-heading": `'Poppins', sans-serif`,
        "--theme-font-color-base": "var(--color-surface-800)",
        "--theme-font-color-dark": "var(--color-tertiary-300)",
        "--theme-rounded-base": "9999px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "var(--color-surface-700)",
        "--on-secondary": "var(--color-surface-700)",
        "--on-tertiary": "var(--color-surface-700)",
        "--on-success": "var(--color-surface-700)",
        "--on-warning": "var(--color-surface-700)",
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
        // warning | #d69f6b 
        "--color-warning-50": "249 241 233", // #f9f1e9
        "--color-warning-100": "247 236 225", // #f7ece1
        "--color-warning-200": "245 231 218", // #f5e7da
        "--color-warning-300": "239 217 196", // #efd9c4
        "--color-warning-400": "226 188 151", // #e2bc97
        "--color-warning-500": "214 159 107", // #d69f6b
        "--color-warning-600": "193 143 96", // #c18f60
        "--color-warning-700": "161 119 80", // #a17750
        "--color-warning-800": "128 95 64", // #805f40
        "--color-warning-900": "105 78 52", // #694e34
        // error | #b45082 
        "--color-error-50": "244 229 236", // #f4e5ec
        "--color-error-100": "240 220 230", // #f0dce6
        "--color-error-200": "236 211 224", // #ecd3e0
        "--color-error-300": "225 185 205", // #e1b9cd
        "--color-error-400": "203 133 168", // #cb85a8
        "--color-error-500": "180 80 130", // #b45082
        "--color-error-600": "162 72 117", // #a24875
        "--color-error-700": "135 60 98", // #873c62
        "--color-error-800": "108 48 78", // #6c304e
        "--color-error-900": "88 39 64", // #582740
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