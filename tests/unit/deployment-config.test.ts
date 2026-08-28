import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticWebAppsConfig = {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers?: Record<string, string> }>;
};

const root = resolve(import.meta.dirname, '../..');
const config = JSON.parse(readFileSync(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as StaticWebAppsConfig;

describe('Azure Static Web Apps response policy', () => {
  it('caches content-hashed assets immutably while revalidating documents and the worker', () => {
    expect(config.globalHeaders['Cache-Control']).toBe('no-cache, max-age=0, must-revalidate');
    expect(config.routes).toContainEqual({
      route: '/assets/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
    expect(config.routes).toContainEqual({
      route: '/sw.js',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
  });

  it('uses a restrictive self-only content security policy', () => {
    const policy = config.globalHeaders['Content-Security-Policy'];
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self'");
    expect(policy).toContain("style-src 'self'");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("worker-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("'unsafe-inline'");
    expect(readFileSync(resolve(root, 'src/main.ts'), 'utf8')).not.toContain('style=');
  });

  it('ships only content-hashed immutable files below the asset route', () => {
    const names = readdirSync(resolve(root, 'public/assets'));
    expect(names).toHaveLength(5);
    for (const name of names) {
      const bytes = readFileSync(resolve(root, 'public/assets', name));
      const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
      expect(name).toMatch(new RegExp(`-${digest}\\.(avif|webp|svg)$`));
    }
  });
});
