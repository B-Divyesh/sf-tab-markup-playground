import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('@claim:clean-build uses Node 20 or newer and produces the static entry point', () => {
  expect(Number(process.versions.node.split('.')[0])).toBeGreaterThanOrEqual(20);
  expect(existsSync(resolve(import.meta.dirname, '../dist/index.html'))).toBe(true);
});
