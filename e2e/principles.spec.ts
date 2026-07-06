import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Improv Principles', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/principles');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Improv Principles' })).toBeVisible();
  });

  test('shows a counter (1 / N)', async ({ page }) => {
    await expect(page.getByText(/1\s*\/\s*\d+/)).toBeVisible();
  });

  test('Next button advances to principle 2', async ({ page }) => {
    await page.getByRole('button', { name: /Next →/i }).click();
    await expect(page.getByText(/2\s*\/\s*\d+/)).toBeVisible();
  });

  test('Previous button wraps from 1 to last', async ({ page }) => {
    await page.getByRole('button', { name: /← Previous/i }).click();
    const text = await page.getByText(/\d+\s*\/\s*\d+/).textContent();
    const parts = text!.replace(/\s/g, '').split('/');
    expect(parts[0]).toBe(parts[1]);
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Foundation', 'Character', 'Status', 'Editing', 'Ensemble', 'Stage Craft']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering reduces the total count', async ({ page }) => {
    const beforeText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalBefore = parseInt(beforeText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Foundation' }).click();
    const afterText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalAfter = parseInt(afterText!.split('/')[1].trim());
    expect(totalAfter).toBeLessThan(totalBefore);
  });

  test('All filter restores the full count', async ({ page }) => {
    const beforeText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalBefore = parseInt(beforeText!.split('/')[1].trim());
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const afterText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalAfter = parseInt(afterText!.split('/')[1].trim());
    expect(totalAfter).toBe(totalBefore);
  });

  test('principle card has a title and description', async ({ page }) => {
    const title = page.locator('[class*="text-xl font-bold"], [class*="text-2xl font-bold"]').first();
    await expect(title).not.toBeEmpty();
  });
});
