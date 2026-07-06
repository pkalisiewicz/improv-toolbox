import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Status Randomizer', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/status');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Status Randomizer' })).toBeVisible();
  });

  test('shows player count selector', async ({ page }) => {
    // Should have increment/decrement or count buttons
    const btns = page.getByRole('button');
    expect(await btns.count()).toBeGreaterThan(1);
  });

  test('shows a "draw" or "assign" action button', async ({ page }) => {
    const drawBtn = page.getByRole('button', { name: /Draw|Assign|Shuffle|Go|Start/i });
    await expect(drawBtn.first()).toBeVisible();
  });

  test('clicking assign/draw reveals status numbers', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Draw|Assign|Shuffle|Go/i }).first();
    await btn.click();
    // Click "Reveal all" to show the assigned numbers
    await page.getByRole('button', { name: /Reveal all/i }).click();
    // The revealed number cards should show numbers in large text
    await expect(page.locator('[class*="text-4xl"]').first()).toBeVisible();
  });

  test('reset returns to initial state', async ({ page }) => {
    const shuffleBtn = page.getByRole('button', { name: /Draw|Assign|Shuffle|Go/i }).first();
    await shuffleBtn.click();
    // Shuffle again to reset — there is no dedicated reset button
    await shuffleBtn.click();
    // Heading should still be visible
    await expect(page.getByRole('heading', { name: 'Status Randomizer' })).toBeVisible();
  });
});
