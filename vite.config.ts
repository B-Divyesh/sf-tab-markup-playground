import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const staticWebAppConfig = JSON.parse(
  readFileSync(resolve(import.meta.dirname, 'public/staticwebapp.config.json'), 'utf8')
) as { globalHeaders: Record<string, string> };

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html')
      }
    }
  },
  preview: {
    headers: staticWebAppConfig.globalHeaders
  },
  test: {
    include: ['tests/unit/**/*.test.ts']
  }
});
