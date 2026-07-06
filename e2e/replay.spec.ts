import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Scene Replay Cards', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/replay');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Scene Replay Cards' })).toBeVisible();
  });

  test('displays a replay card with text', async ({ page }) => {
    const text = page.locator('[class*="font-medium"], [class*="text-lg"]').filter({ hasText: /\w{5,}/ }).first();
    await expect(text).toBeVisible();
  });

  test('shows a counter', async ({ page }) => {
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
  });

  test('Next button advances the card', async ({ page }) => {
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.getByText(/2\s*\/\s*\d+/)).toBeVisible();
  });

  test('Prev button wraps from first to last', async ({ page }) => {
    await page.getByRole('button', { name: /Prev/i }).click();
    const text = await page.getByText(/\d+\s*\/\s*\d+/).textContent();
    const parts = text!.replace(/\s/g, '').split('/');
    expect(parts[0]).toBe(parts[1]);
  });

  test('Random card button is present and changes order', async ({ page }) => {
    // The random button uses the translation "Random card"
    const randomBtn = page.getByRole('button', { name: /Random card/i });
    await expect(randomBtn).toBeVisible();
    await randomBtn.click();
    // After random, we should be back at 1
    await expect(page.getByText(/1\s*\/\s*\d+/)).toBeVisible();
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Physicality', 'Genre', 'Emotional', 'Structural', 'Character']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering by Emotional reduces the total', async ({ page }) => {
    const fullText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const fullTotal = parseInt(fullText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Emotional' }).click();
    const filteredText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const filteredTotal = parseInt(filteredText!.split('/')[1].trim());
    expect(filteredTotal).toBeLessThan(fullTotal);
  });

  test('All filter restores full count', async ({ page }) => {
    const fullText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const fullTotal = parseInt(fullText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Genre' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const restoredText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    expect(parseInt(restoredText!.split('/')[1].trim())).toBe(fullTotal);
  });
});
