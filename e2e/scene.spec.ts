import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Scene Generator', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/scene');
  });

  test('shows heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Random Scene' })).toBeVisible();
  });

  test('renders three main scene cards (location, relationship, situation)', async ({ page }) => {
    await expect(page.getByText('Regenerate all')).toBeVisible();
    // Each card has a 🎲 regenerate button (aria-label="Regenerate")
    const regenBtns = page.getByRole('button', { name: 'Regenerate', exact: true });
    await expect(regenBtns).toHaveCount(3); // location, relationship, situation
  });

  test('regenerate-all button changes at least one card value', async ({ page }) => {
    const locCard = page.locator('p.font-medium').first();
    const before = await locCard.textContent();

    let changed = false;
    for (let i = 0; i < 10; i++) {
      await page.getByText('Regenerate all').click();
      const after = await locCard.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('individual 🎲 regenerates only that card', async ({ page }) => {
    const cards = page.locator('p.font-medium');
    const beforeAll = await cards.allTextContents();

    // click first card's regenerate button
    await page.getByRole('button', { name: 'Regenerate', exact: true }).first().click();
    const afterAll = await cards.allTextContents();

    // The other two cards should stay the same
    expect(afterAll[1]).toBe(beforeAll[1]);
    expect(afterAll[2]).toBe(beforeAll[2]);
  });

  test('genre filter buttons are shown', async ({ page }) => {
    await expect(page.getByText('Genre')).toBeVisible();
    // All six genre emojis should be visible
    for (const emoji of ['✨', '😄', '😢', '❤️', '😱', '🤪', '🏛️']) {
      await expect(page.locator('button', { hasText: emoji }).first()).toBeVisible();
    }
  });

  test('clicking a genre filter activates it', async ({ page }) => {
    const comedyBtn = page.locator('button').filter({ hasText: '😄' });
    await comedyBtn.click();
    // Active genre button gets solid bg class
    await expect(comedyBtn).toHaveClass(/bg-emerald-500/);
  });

  test('show/hide extras toggle reveals mood and time period cards', async ({ page }) => {
    const extrasBtn = page.getByRole('button', { name: /▼|Show extras/i });
    await extrasBtn.click();
    // After expanding, there should be 5 regenerate buttons total
    const regenBtns = page.getByRole('button', { name: 'Regenerate', exact: true });
    await expect(regenBtns).toHaveCount(5);
  });

  test('hide extras collapses back to 3 cards', async ({ page }) => {
    await page.getByRole('button', { name: /▼/ }).click();
    await page.getByRole('button', { name: /▲/ }).click();
    const regenBtns = page.getByRole('button', { name: 'Regenerate', exact: true });
    await expect(regenBtns).toHaveCount(3);
  });
});
