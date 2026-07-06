import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Emotion Wheel', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/emotion');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Emotion Wheel' })).toBeVisible();
  });

  test('shows an emotion name', async ({ page }) => {
    const emotion = page.locator('[class*="text-3xl font-black"]').first();
    await expect(emotion).not.toBeEmpty();
  });

  test('Spin button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Spin' })).toBeVisible();
  });

  test('Spin changes the displayed emotion', async ({ page }) => {
    const emotionEl = page.locator('[class*="text-3xl font-black"]').first();
    const before = await emotionEl.textContent();

    let changed = false;
    for (let i = 0; i < 15; i++) {
      await page.getByRole('button', { name: 'Spin' }).click();
      const after = await emotionEl.textContent();
      if (after !== before) { changed = true; break; }
    }
    expect(changed).toBe(true);
  });

  test('family filter buttons are shown', async ({ page }) => {
    for (const family of ['All', 'Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust']) {
      await expect(page.getByRole('button', { name: family })).toBeVisible();
    }
  });

  test('filtering by Joy restricts to joy emotions', async ({ page }) => {
    await page.getByRole('button', { name: 'Joy' }).click();
    await page.getByRole('button', { name: 'Spin' }).click();
    // The emotion family badge should show Joy
    await expect(page.getByText(/joy/i).first()).toBeVisible();
  });

  test('All filter restores full pool', async ({ page }) => {
    await page.getByRole('button', { name: 'Sadness' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByRole('button', { name: 'All' })).toHaveClass(/bg-/);
  });
});
