import { expect, test } from '@playwright/test';
import { setEnglish } from './helpers';

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

test('uses the masthead font at first paint on a normal refresh', async ({ page }) => {
  await setEnglish(page);

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const masthead = page.getByRole('heading', { name: 'Improv Toolbox' });
  await expect(masthead).toBeVisible();
  const before = await masthead.boundingBox();

  await page.evaluate(() => document.fonts.ready.then(() => true));
  const after = await masthead.boundingBox();

  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.width - before!.width)).toBeLessThan(1);
  expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
  expect(after!.height).toBeLessThan(70);
});

test('does not get stuck on fallback if fonts finish after first paint', async ({ page }) => {
  await setEnglish(page);
  await page.route(/\.woff2(\?|$)/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const masthead = page.getByRole('heading', { name: 'Improv Toolbox' });
  await expect(masthead).toBeVisible();

  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(150);
  const after = await masthead.boundingBox();

  expect(after).not.toBeNull();
  expect(after!.height).toBeLessThan(70);
});
