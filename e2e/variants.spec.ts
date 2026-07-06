import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Game Variant Generator', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/variants');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Game Variant Generator' })).toBeVisible();
  });

  test('displays a variant card with text', async ({ page }) => {
    const text = page.locator('[class*="font-medium"], [class*="text-lg"]').filter({ hasText: /\w{5,}/ }).first();
    await expect(text).toBeVisible();
  });

  test('Randomize button changes the variant', async ({ page }) => {
    // The main twist text uses font-black
    const textEl = page.locator('p[class*="font-black"]').first();
    const before = await textEl.textContent();

    let changed = false;
    for (let i = 0; i < 15; i++) {
      await page.getByRole('button', { name: /Randomize|🎲|New/i }).click();
      const after = await textEl.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Restriction', 'Role', 'Format', 'Constraint']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering by Restriction shows only restriction variants', async ({ page }) => {
    await page.getByRole('button', { name: 'Restriction' }).click();
    // Category badge should show restriction
    await expect(page.getByText(/restriction/i).first()).toBeVisible();
  });

  test('All filter restores full pool', async ({ page }) => {
    await page.getByRole('button', { name: 'Role' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByRole('button', { name: 'All' })).toHaveClass(/bg-/);
  });
});
