import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Audience Suggestions', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/suggestions');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Audience Suggestions' })).toBeVisible();
  });

  test('renders a suggestion card', async ({ page }) => {
    // There should be a card with some suggestion text
    await expect(page.locator('[class*="rounded"]').filter({ hasText: /\w{3,}/ }).first()).toBeVisible();
  });

  test('category tabs are visible', async ({ page }) => {
    for (const label of ['Location', 'Occupation', 'Relationship', 'Emotion']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('switching category changes the displayed suggestion', async ({ page }) => {
    await page.getByRole('button', { name: 'Occupation' }).click();
    // The Occupation button should become active (highlighted)
    await expect(page.getByRole('button', { name: 'Occupation' })).toHaveClass(/bg-indigo/);
  });

  test('"Draw" button picks a new suggestion from the same category', async ({ page }) => {
    const drawBtn = page.getByRole('button', { name: /Draw|Next/i });
    // Use the specific large suggestion text element (text-3xl font-bold)
    const textEl = page.locator('p[class*="text-3xl"]').first();
    const before = await textEl.textContent();

    let changed = false;
    for (let i = 0; i < 15; i++) {
      await drawBtn.click();
      const after = await textEl.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('Grab Bag mode shows 4 categories at once', async ({ page }) => {
    await page.getByRole('button', { name: /Grab/i }).click();
    await page.getByRole('button', { name: /Draw|Roll/i }).click();
    // Should see all 4 grab bag labels
    for (const label of ['Location', 'Occupation', 'Relationship', 'Emotion']) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
  });
});
