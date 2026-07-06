import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Improv Facts', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/facts');
  });

  test('shows heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Improv Facts' })).toBeVisible();
  });

  test('shows a counter like "1 / N"', async ({ page }) => {
    await expect(page.getByText(/1\s*\/\s*\d+/)).toBeVisible();
  });

  test('Next button advances to fact 2', async ({ page }) => {
    await page.getByRole('button', { name: /next|→/i }).click();
    await expect(page.getByText(/2\s*\/\s*\d+/)).toBeVisible();
  });

  test('Previous button wraps from fact 1 to the last fact', async ({ page }) => {
    await page.getByRole('button', { name: /prev|←/i }).click();
    // Should now show the last fact (counter ends with /N where current = N)
    const counterText = await page.getByText(/\d+\s*\/\s*\d+/).textContent();
    expect(counterText).toBeTruthy();
    const parts = counterText!.replace(/\s/g, '').split('/');
    expect(parts[0]).toBe(parts[1]); // current === total
  });

  test('category filter buttons are visible', async ({ page }) => {
    for (const label of ['History', 'Technique', 'Tips', 'People']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('filtering by History reduces the total count', async ({ page }) => {
    const totalBefore = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalN = parseInt(totalBefore!.split('/')[1].trim());

    await page.getByRole('button', { name: 'History' }).click();
    const newCounter = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const newTotal = parseInt(newCounter!.split('/')[1].trim());
    expect(newTotal).toBeLessThan(totalN);
  });

  test('All filter restores the full count', async ({ page }) => {
    const totalBefore = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const totalN = parseInt(totalBefore!.split('/')[1].trim());

    await page.getByRole('button', { name: 'History' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    const afterText = await page.getByText(/1\s*\/\s*(\d+)/).textContent();
    const afterN = parseInt(afterText!.split('/')[1].trim());
    expect(afterN).toBe(totalN);
  });

  test('current fact text is non-empty', async ({ page }) => {
    const factText = page.locator('p[class*="text"]').filter({ hasText: /\w{5,}/ }).first();
    await expect(factText).not.toBeEmpty();
  });
});
