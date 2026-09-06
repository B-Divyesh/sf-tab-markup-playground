import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sampleTitle = 'Four-bar G warmup';

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(new RegExp(sampleTitle));
}

async function expectMinimumTargets(page: import('@playwright/test').Page): Promise<void> {
  const controls = page.locator('a[href], button, select, summary, textarea, [tabindex="0"]').filter({ visible: true });
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const control = controls.nth(index);
    const box = await control.boundingBox();
    const label = await control.evaluate((element) => element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName);
    expect(box, `${label} should have a layout box`).not.toBeNull();
    expect(box!.width, `${label} should be at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${label} should be at least 44px tall`).toBeGreaterThanOrEqual(44);
  }
}

test('@claim:demo-sample loads a populated four-bar exercise with chord, tab, and theory output', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('4 chords mapped')).toBeVisible();
  await expect(page.locator('#panel-chords .chord-card')).toHaveCount(4);
  await expect(page.locator('[aria-label="Tab preview"]')).toContainText('e|--3');
  await expect(page.locator('[aria-label="Tab preview"]')).toContainText('E|--3');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
});

test('@claim:demo-isolation keeps sample edits out of the real draft', async ({ page }) => {
  await page.goto('/');
  const realDraft = '@title Private real draft\n@key D\n| D | G | A7 | D |';
  await page.getByLabel('Exercise markup').fill(realDraft);
  await openDemo(page);
  await page.getByLabel('Exercise markup').fill('@title Changed demo\n@key G\n| G | C | G | D7 |');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(new RegExp(sampleTitle));
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#workbench$/);
  await expect(page.getByLabel('Exercise markup')).toHaveValue(realDraft);
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('tab-playbook:draft:v1');
  expect(keys).not.toContain('tab-playbook:demo:draft:v1');
});

test('@claim:theory-views renders chord, fretboard, interval, and scale views from markup', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('#panel-chords')).toContainText('G');
  await page.getByRole('tab', { name: 'Fretboard' }).click();
  await expect(page.locator('#panel-fretboard')).toContainText('across the neck');
  await page.getByRole('tab', { name: 'Intervals' }).click();
  await expect(page.locator('#panel-intervals')).toContainText('I');
  await page.getByRole('tab', { name: 'Scale' }).click();
  await expect(page.locator('#panel-scale')).toContainText('G major map');
});

test('@claim:chord-forms supports the documented chord qualities and slash bass notes', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Exercise markup').fill('@key C\n| C | Cm | C7 | Cmaj7 | Cm7 | Cdim | Caug | Csus2 | Csus4 | C/E |');
  await expect(page.getByText('10 chords mapped')).toBeVisible();
  const names = await page.locator('#panel-chords .chord-name').allTextContents();
  expect(names).toEqual(['C', 'Cm', 'C7', 'Cmaj7', 'Cm7', 'Cdim', 'Caug', 'Csus2', 'Csus4', 'C/E']);
});

test('@claim:transpose-keeps-tab transposes chord text and keeps tab fret numbers', async ({ page }) => {
  await openDemo(page);
  const source = '@key D\n| D | Bm7 | G | A7 |\ne|--2--0--3--5--|';
  await page.getByLabel('Exercise markup').fill(source);
  await page.getByLabel('Transpose exercise').selectOption('2');
  await expect(page.locator('#panel-chords')).toContainText('KEY E');
  await page.getByRole('button', { name: 'Apply to text' }).click();
  await expect(page.getByLabel('Exercise markup')).toHaveValue('@key E\n| E | C♯m7 | A | B7 |\ne|--2--0--3--5--|');
});

test('@claim:share-link reloads the exercise from a URL fragment', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openDemo(page);
  const shared = '@title Shared loop\n@key D\n| D | Bm7 | G | A7 |';
  await page.getByLabel('Exercise markup').fill(shared);
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(url).hash).toContain('exercise=');
  const reader = await browser.newContext();
  const readerPage = await reader.newPage();
  await readerPage.goto(url);
  await expect(readerPage.getByLabel('Exercise markup')).toHaveValue(shared);
  await expect(readerPage.getByText('4 chords mapped')).toBeVisible();
  await reader.close();
});

test('@claim:share-privacy keeps exercise text out of network requests', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  for (const request of requests) {
    const url = new URL(request);
    expect(url.origin).toBe(origin);
    expect(url.searchParams.has('exercise')).toBe(false);
    expect(url.hash).toBe('');
  }
});

test('@claim:draft-persistence keeps a demo draft after reload', async ({ page }) => {
  await openDemo(page);
  const draft = '@title Saved sample edit\n@key A\n| A | D | E7 | A |';
  await page.getByLabel('Exercise markup').fill(draft);
  await page.reload();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(draft);
  await expect(page.getByText('4 chords mapped')).toBeVisible();
});

test('@claim:clear-undo removes a draft and restores it in the same session', async ({ page }) => {
  await openDemo(page);
  const before = await page.getByLabel('Exercise markup').inputValue();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByText('Empty draft')).toBeVisible();
  await page.getByRole('button', { name: 'Undo clear' }).click();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(before);
});

test('@claim:offline-after-first-visit reloads the sample and keeps editing available offline', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The service-worker claim runs once in a dedicated desktop context.');
  const context = await browser.newContext();
  const page = await context.newPage();
  await openDemo(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  const workerState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { controlled: Boolean(navigator.serviceWorker.controller), waiting: Boolean(registration.waiting), caches: await caches.keys() };
  });
  expect(workerState.controlled).toBe(true);
  expect(workerState.waiting).toBe(false);
  expect(workerState.caches).toEqual(['tab-playbook-v3']);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(new RegExp(sampleTitle));
  await expect(page.locator('#network-label')).toContainText(/offline/i);
  await page.getByLabel('Exercise markup').fill('@key C\n| C | F | G | C |');
  await expect(page.getByText('4 chords mapped')).toBeVisible();
  await context.close();
});

test('@claim:local-first has no account, upload, advertising, analytics, or third-party requests', async ({ page }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await openDemo(page);
  await page.getByRole('tab', { name: 'Fretboard' }).click();
  await page.getByLabel('Exercise markup').fill('@key C\n| C | Am | F | G |');
  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((request) => new URL(request.url).origin === origin)).toBe(true);
  expect(requests.every((request) => request.method === 'GET')).toBe(true);
  await expect(page.locator('input[type="password"], input[type="file"], form, [data-payment]')).toHaveCount(0);
});

test('@claim:scope has no audio playback, song catalog, or score engraving controls', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('audio, video, [role="application"], [data-score], [data-audio], a[href*="catalog"]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'What this tool does not do' })).toBeVisible();
});

test('@claim:size-limit permits 8000 characters and gives a recovery message for 8001', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openDemo(page);
  const prefix = '@key C\n| C |';
  const withinLimit = `${prefix}${' '.repeat(8000 - prefix.length)}`;
  await page.getByLabel('Exercise markup').fill(withinLimit);
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText('Share link copied')).toBeVisible();
  await page.getByLabel('Exercise markup').fill(`${withinLimit} `);
  await expect(page.getByText('Keep exercises under 8,000 characters')).toBeVisible();
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText('Fix the markup and add at least one chord before sharing.')).toBeVisible();
});

test('@claim:free-core starts the sample without a payment or account step', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByLabel('Exercise markup')).toBeEditable();
  await expect(page.locator('[href*="checkout"], [data-payment], input[type="password"], input[type="email"]')).toHaveCount(0);
});

test('handles invalid markup, keyboard tabs, and share recovery', async ({ page }) => {
  await openDemo(page);
  await page.getByLabel('Exercise markup').fill('@key H\n| Nope |');
  await expect(page.locator('#parse-status')).toContainText('not a supported key');
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText('Fix the markup and add at least one chord before sharing.')).toBeVisible();
  await expect(page.getByLabel('Exercise markup')).toBeFocused();
  await page.getByLabel('Exercise markup').fill('@key C\n| C | Am | F | G |');
  const chords = page.getByRole('tab', { name: 'Chords' });
  await chords.focus();
  await chords.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Fretboard' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Fretboard' }).press('End');
  await expect(page.getByRole('tab', { name: 'Scale' })).toBeFocused();
});

test('focuses the editor workbench from the skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to editor')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#workbench')).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('@claim:deployment-policy serves titled routes, policy headers, immutable assets, and a designed 404', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  const routes = [
    ['/', 'Tab Playbook — write guitar exercises'],
    ['/demo', 'Demo — Tab Playbook'],
    ['/demo/', 'Demo — Tab Playbook'],
    ['/privacy/', 'Privacy — Tab Playbook'],
    ['/terms/', 'Terms — Tab Playbook']
  ];
  for (const [route, title] of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(await page.title()).toBe(title);
    expect(await page.locator('h1').count()).toBe(1);
    expect(await page.locator('link[rel="canonical"]').count()).toBe(1);
    expect(response?.headers()['content-security-policy']).toContain("default-src 'self'");
  }
  const asset = await page.request.get('/assets/social-26b2b6387016.png');
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  const worker = await page.request.get('/sw.js');
  expect(worker.headers()['cache-control']).toBe('no-cache, no-store, must-revalidate');
  const missing = await page.goto('/does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the editor' })).toBeVisible();
  expect(consoleErrors.filter((message) => !message.includes('the server responded with a status of 404'))).toEqual([]);
});

test('links point to reachable product pages', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean));
  for (const href of new Set(hrefs)) {
    if (href?.startsWith('#')) continue;
    const response = await page.request.get(href!);
    expect(response.status(), `${href} should be reachable`).toBe(200);
  }
});

test('keeps every interactive target usable and pages axe-clean', async ({ page }) => {
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/does-not-exist']) {
    await page.goto(route);
    await expectMinimumTargets(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('uses reduced motion and avoids desktop or phone page overflow', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDemo(page);
  await page.getByRole('tab', { name: 'Scale' }).click();
  await expect.poll(() => page.locator('#panel-scale').evaluate((element) => parseFloat(getComputedStyle(element).animationDuration))).toBeLessThanOrEqual(0.0001);
  if (testInfo.project.name === 'mobile') {
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  }
});
