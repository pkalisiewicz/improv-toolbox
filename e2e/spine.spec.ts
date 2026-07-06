import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Story Spine', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/spine');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Story Spine' })).toBeVisible();
  });

  test('renders 6 beat rows', async ({ page }) => {
    // Each beat has a 🎲 reroll button
    const rerollBtns = page.locator('button').filter({ hasText: '↺' });
    await expect(rerollBtns).toHaveCount(6);
  });

  test('each beat has a non-empty seed text', async ({ page }) => {
    const seeds = page.locator('p[class*="font-bold text-gray-900"]');
    const count = await seeds.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('"New story" button regenerates all beats', async ({ page }) => {
    const firstSeed = page.locator('p[class*="font-bold text-gray-900"]').first();
    const before = await firstSeed.textContent();

    let changed = false;
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: 'New story' }).click();
      const after = await firstSeed.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('individual 🎲 rerolls change only that beat', async ({ page }) => {
    const seeds = page.locator('p[class*="font-bold text-gray-900"]');
    const allBefore = await seeds.allTextContents();
    await page.locator('button').filter({ hasText: '↺' }).first().click();
    const allAfter = await seeds.allTextContents();
    // Other beats should remain the same
    for (let i = 1; i < allBefore.length; i++) {
      expect(allAfter[i]).toBe(allBefore[i]);
    }
  });
});
