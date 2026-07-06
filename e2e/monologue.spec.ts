import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Monologue Seeds', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/monologue');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monologue Seeds' })).toBeVisible();
  });

  test('shows a seed card with text', async ({ page }) => {
    const seed = page.locator('[class*="font-medium"], [class*="text-lg"], p').filter({ hasText: /\w{5,}/ }).first();
    await expect(seed).toBeVisible();
  });

  test('shows a counter', async ({ page }) => {
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
  });

  test('Next → button advances the seed', async ({ page }) => {
    await page.getByRole('button', { name: /Next →/i }).click();
    await expect(page.getByText(/2\s*\/\s*\d+/)).toBeVisible();
  });

  test('← Previous button wraps from first to last', async ({ page }) => {
    await page.getByRole('button', { name: /← Previous/i }).click();
    const text = await page.getByText(/\d+\s*\/\s*\d+/).textContent();
    const parts = text!.replace(/\s/g, '').split('/');
    expect(parts[0]).toBe(parts[1]);
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Embarrassment', 'Surprise', 'Pride', 'Fear', 'Work']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering by category resets to index 1', async ({ page }) => {
    await page.getByRole('button', { name: /Next →/i }).click();
    await page.getByRole('button', { name: 'Fear' }).click();
    await expect(page.getByText(/1\s*\/\s*\d+/)).toBeVisible();
  });

  test('All filter restores full seed list', async ({ page }) => {
    const fullText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const fullTotal = parseInt(fullText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Pride' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const restoredText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    expect(parseInt(restoredText!.split('/')[1].trim())).toBe(fullTotal);
  });
});
