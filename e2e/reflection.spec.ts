import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Reflection Prompts', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/reflection');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Reflection Prompts' })).toBeVisible();
  });

  test('displays a prompt question', async ({ page }) => {
    // Question is in a p with text-xl font-bold; filter for meaningful text (5+ word chars)
    const question = page.locator('p[class*="text-"], blockquote, [class*="font-bold"]').filter({ hasText: /\w{5,}/ }).first();
    await expect(question).toBeVisible();
  });

  test('Next question button advances to the next prompt', async ({ page }) => {
    const textEl = page.locator('p[class*="text-xl"]').first();
    const before = await textEl.textContent();
    await page.getByRole('button', { name: /Next question/i }).click();
    const after = await textEl.textContent();
    // Content should eventually change
    expect(after).not.toBe(before);
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const cat of ['All', 'Game', 'Crow', 'Ensemble', 'Edit', 'Character']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering by Game category works', async ({ page }) => {
    await page.getByRole('button', { name: 'Game' }).click();
    await expect(page.getByRole('button', { name: 'Game' })).toHaveClass(/bg-/);
  });
});
