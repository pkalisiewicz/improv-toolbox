import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Warmup Generator', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/warmup');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Warmup Generator' })).toBeVisible();
  });

  test('displays a game card with a name', async ({ page }) => {
    // The game card title should not be empty
    const card = page.locator('[class*="font-bold"]').first();
    await expect(card).not.toBeEmpty();
  });

  test('Pick Random button changes the displayed game', async ({ page }) => {
    // Button label translates to "Random!" with a dice emoji
    const pickBtn = page.getByRole('button', { name: /Random!|🎲/i });
    // Use h2 specifically to get the game title (not the page h1 heading)
    const titleEl = page.locator('h2').first();
    const before = await titleEl.textContent();

    let changed = false;
    for (let i = 0; i < 15; i++) {
      await pickBtn.click();
      const after = await titleEl.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('category filter chips are visible', async ({ page }) => {
    // Category filter buttons (Physical, Vocal, Focus, etc.)
    for (const label of ['Physical', 'Vocal', 'Focus', 'Ensemble', 'Storytelling', 'Character']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('selecting a category filter updates the category pill on the card', async ({ page }) => {
    await page.getByRole('button', { name: 'Vocal' }).click();
    // After filtering, badge/pill should show "vocal"
    await expect(page.locator('[class*="rounded"]', { hasText: /vocal/i }).first()).toBeVisible();
  });

  test('level filters (Beginner, Intermediate, Advanced) are visible', async ({ page }) => {
    for (const label of ['Beginner', 'Intermediate', 'Advanced']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('player count filter chips are visible', async ({ page }) => {
    for (const label of ['Any', '2+', '4+', '6+']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('clicking All resets category filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Vocal' }).click();
    await page.getByRole('button', { name: /^All$/ }).first().click();
    // All category button should be active
    const allBtn = page.getByRole('button', { name: /^All$/ }).first();
    await expect(allBtn).toHaveClass(/bg-/);
  });
});
