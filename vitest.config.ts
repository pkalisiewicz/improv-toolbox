import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/build/**',
      '**/.react-router/**',
      '**/.claude/**',
      '**/.agents/**',
      '**/.gemini/**',
      '**/.cursor/**',
      '**/.impeccable/**',
      '**/tmp/**',
      '**/test-results/**',
      '**/playwright-report/**',
      'e2e/**',
      'ios/App/App/public/**',
      'ios/App/Pods/**',
      'ios/App/DerivedData/**',
      'ios/DerivedData/**',
      'android/app/src/main/assets/public/**',
      'android/.gradle/**',
      'android/build/**',
      'android/app/build/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/hooks/**', 'src/data/**', 'src/components/**', 'src/pages/**'],
      exclude: ['src/test/**'],
    },
  },
});
