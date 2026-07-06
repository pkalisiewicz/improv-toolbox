import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Format Library', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/formats');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Format Library' })).toBeVisible();
  });

  test('displays a list of formats', async ({ page }) => {
    // Format cards should be visible
    const cards = page.locator('[class*="rounded"][class*="border"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(3);
  });

  test('difficulty filter buttons are visible', async ({ page }) => {
    for (const label of ['All', 'Beginner', 'Intermediate', 'Advanced']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('filtering by Beginner reduces the list', async ({ page }) => {
    const allCount = await page.locator('[class*="rounded"][class*="border"]').count();
    await page.getByRole('button', { name: 'Beginner' }).click();
    const filteredCount = await page.locator('[class*="rounded"][class*="border"]').count();
    expect(filteredCount).toBeLessThanOrEqual(allCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('filtering then resetting to All restores full list', async ({ page }) => {
    const allCount = await page.locator('[class*="rounded"][class*="border"]').count();
    await page.getByRole('button', { name: 'Advanced' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const restoredCount = await page.locator('[class*="rounded"][class*="border"]').count();
    expect(restoredCount).toBe(allCount);
  });

  test('clicking a format card opens detail view', async ({ page }) => {
    // Click the first format card
    await page.locator('[class*="cursor-pointer"]').first().click();
    // A detail view or expanded section should appear (e.g. rules / close button)
    await expect(
      page.getByRole('button', { name: /close|✕|×/i }).or(page.getByText(/Players|players/)).first()
    ).toBeVisible();
  });
});
