import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'dist-ssr/**',
    'build/**',
    '.react-router/**',
    '.claude/**',
    '.agents/**',
    '.gemini/**',
    '.cursor/**',
    '.impeccable/**',
    'tmp/**',
    'test-results/**',
    'playwright-report/**',
    'ios/App/App/public/**',
    'ios/App/Pods/**',
    'ios/App/DerivedData/**',
    'ios/DerivedData/**',
    'android/app/src/main/assets/public/**',
    'android/.gradle/**',
    'android/build/**',
    'android/app/build/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // Test and E2E files: disable HMR-only rules that are irrelevant outside the app bundle
  {
    files: ['src/test/**/*.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // React Router route modules intentionally export framework APIs such as
  // `meta` alongside components; they are not Fast Refresh-only component files.
  {
    files: ['src/root.tsx', 'src/routes/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // The wheel animation is kicked off by a parent prop and legitimately derives
  // transient animation state in an effect.
  {
    files: ['src/components/wheel/WheelCanvas.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
