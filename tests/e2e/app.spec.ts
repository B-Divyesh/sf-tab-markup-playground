import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function expectMinimumTargets(page: import('@playwright/test').Page): Promise<void> {
  const controls = page.locator('a[href], button, select, summary, textarea, [tabindex="0"]');
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const control = controls.nth(index);
    const box = await control.boundingBox();
    expect(box, `interactive control ${index} should have a layout box`).not.toBeNull();
    expect(box!.width, `interactive control ${index} should be at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `interactive control ${index} should be at least 44px tall`).toBeGreaterThanOrEqual(44);
  }
}

test('authors, analyzes, transposes, and shares an exercise', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByLabel('Exercise markup').fill('@title Test loop\n@key D\n| D | Bm7 | G | A7 |');
  await expect(page.getByText('4 chords mapped')).toBeVisible();
  await page.getByRole('tab', { name: 'Intervals' }).click();
  await expect(page.locator('#panel-intervals').getByText('vi⁷')).toBeVisible();
  await page.getByLabel('Transpose exercise').selectOption('2');
  await expect(page.locator('#panel-intervals').getByText('KEY E')).toBeVisible();
  await page.getByRole('button', { name: 'Apply to text' }).click();
  await expect(page.getByLabel('Exercise markup')).toHaveValue(/@key E/);
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page.getByText(/Share link copied/)).toBeVisible();
});

test('supports tabs by keyboard and has no serious axe violations', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto('/');
  const chords = page.getByRole('tab', { name: 'Chords' });
  await chords.focus();
  await chords.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Fretboard' })).toHaveAttribute('aria-selected', 'true');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('mobile layout keeps controls usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const share = page.getByRole('button', { name: 'Copy share link' });
  const box = await share.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('tab', { name: 'Scale' }).click();
  await expect(page.getByText(/major map/)).toBeVisible();
});

test('keeps every interactive target at least 44px on the app and legal pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Fretboard' }).click();
  await expectMinimumTargets(page);

  for (const route of ['/privacy/', '/terms/']) {
    await page.goto(route);
    await expectMinimumTargets(page);
  }
});

test('reloads from the offline shell', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make the neck');
  await expect(page.locator('#network-label')).toContainText(/offline/i);
});
