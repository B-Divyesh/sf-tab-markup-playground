import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/build-claim.test.ts'] }
});
