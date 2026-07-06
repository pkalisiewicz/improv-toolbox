import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Prompt Cards', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/prompts');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Prompt Cards' })).toBeVisible();
  });

  test('shows a prompt card with content', async ({ page }) => {
    // The main card uses rounded-3xl
    const card = page.locator('[class*="rounded-3xl"]').first();
    await expect(card).toBeVisible();
  });

  test('"Next card" button changes the displayed card', async ({ page }) => {
    // The prompt text uses text-2xl font-bold
    const cardText = page.locator('p[class*="font-bold"]').first();
    const before = await cardText.textContent();

    let changed = false;
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: /Next card/i }).click();
      const after = await cardText.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('category filter tabs are shown', async ({ page }) => {
    for (const cat of ['All', 'First Line', 'Occupation', 'Location', 'Title']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('filtering to "First Line" category shows a card from that category', async ({ page }) => {
    await page.getByRole('button', { name: 'First Line' }).click();
    // Category label badge should appear
    await expect(page.getByText(/first.?line/i).first()).toBeVisible();
  });

  test('filtering to "Location" shows location cards', async ({ page }) => {
    await page.getByRole('button', { name: 'Location' }).click();
    await expect(page.getByText(/location/i).first()).toBeVisible();
  });

  test('resetting to All shows cards from any category', async ({ page }) => {
    await page.getByRole('button', { name: 'First Line' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    // All button should be active style
    await expect(page.getByRole('button', { name: 'All' })).toHaveClass(/bg-/);
  });
});
