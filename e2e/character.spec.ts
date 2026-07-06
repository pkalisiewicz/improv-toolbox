import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Character Builder', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/character');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Character Builder' })).toBeVisible();
  });

  test('shows six trait sections', async ({ page }) => {
    for (const label of ['Occupation', 'Want / need', 'Physical quirk', 'Speech pattern', 'Emotional baseline', 'Status']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('all traits have non-empty values', async ({ page }) => {
    // Each trait card has a <p> with the translated text
    const traitValues = page.locator('p[class*="leading-snug"]');
    const count = await traitValues.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      await expect(traitValues.nth(i)).not.toBeEmpty();
    }
  });

  test('"New character" button changes at least one trait', async ({ page }) => {
    const first = page.locator('p[class*="leading-snug"]').first();
    const before = await first.textContent();

    let changed = false;
    for (let i = 0; i < 15; i++) {
      await page.getByRole('button', { name: 'New character' }).click();
      const after = await first.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('individual 🎲 reroll buttons exist for each trait', async ({ page }) => {
    const rerollBtns = page.locator('button[class*="w-8"][class*="h-8"]');
    await expect(rerollBtns).toHaveCount(6);
  });

  test('individual reroll changes only that trait', async ({ page }) => {
    // Read all traits
    const traits = page.locator('p[class*="leading-snug"]');
    const allBefore = await traits.allTextContents();
    // Click the first individual reroll (Occupation)
    await page.locator('button[class*="w-8"][class*="h-8"]').first().click();
    const allAfter = await traits.allTextContents();
    // Other traits should remain the same
    for (let i = 1; i < allBefore.length; i++) {
      expect(allAfter[i]).toBe(allBefore[i]);
    }
  });

  test('status shows a number between 1 and 10', async ({ page }) => {
    const statusVal = page.locator('[class*="text-xl font-bold text-rose-500"]');
    const text = await statusVal.textContent();
    const num = parseInt(text ?? '');
    expect(num).toBeGreaterThanOrEqual(1);
    expect(num).toBeLessThanOrEqual(10);
  });
});
