import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Scene Constraint Cards', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/constraints');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Scene Constraint Cards' })).toBeVisible();
  });

  test('shows a constraint with text', async ({ page }) => {
    const text = page.locator('[class*="font-medium"], [class*="text-lg"]').filter({ hasText: /\w{5,}/ }).first();
    await expect(text).toBeVisible();
  });

  test('shows a counter', async ({ page }) => {
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
  });

  test('Next button advances to next constraint', async ({ page }) => {
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/2\s*\/\s*\d+/)).toBeVisible();
  });

  test('Previous button wraps from first to last', async ({ page }) => {
    await page.getByRole('button', { name: /Previous/i }).click();
    const text = await page.getByText(/\d+\s*\/\s*\d+/).textContent();
    const parts = text!.replace(/\s/g, '').split('/');
    expect(parts[0]).toBe(parts[1]);
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Speech', 'Physical', 'Structural', 'Relational']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering by Speech reduces the total', async ({ page }) => {
    const fullText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const fullTotal = parseInt(fullText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Speech' }).click();
    const filteredText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const filteredTotal = parseInt(filteredText!.split('/')[1].trim());
    expect(filteredTotal).toBeLessThan(fullTotal);
  });

  test('All filter restores full count', async ({ page }) => {
    const fullText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const fullTotal = parseInt(fullText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Physical' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const restoredText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    expect(parseInt(restoredText!.split('/')[1].trim())).toBe(fullTotal);
  });

  test('constraint category badge is displayed', async ({ page }) => {
    const badge = page.locator('[class*="rounded-full"]').filter({ hasText: /speech|physical|structural|relational/i });
    await expect(badge.first()).toBeVisible();
  });
});
