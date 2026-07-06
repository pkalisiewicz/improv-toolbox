import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Workshop Timer', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/timer');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Workshop Timer' })).toBeVisible();
  });

  test('shows all preset buttons', async ({ page }) => {
    for (const label of ['30s', '1 min', '2 min', '3 min', '5 min', '10 min']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('initial display shows 02:00', async ({ page }) => {
    await expect(page.getByText('02:00')).toBeVisible();
  });

  test('clicking 30s preset changes display to 00:30', async ({ page }) => {
    await page.getByRole('button', { name: '30s' }).click();
    await expect(page.getByText('00:30')).toBeVisible();
  });

  test('clicking 1 min preset changes display to 01:00', async ({ page }) => {
    await page.getByRole('button', { name: '1 min' }).click();
    await expect(page.getByText('01:00')).toBeVisible();
  });

  test('Start button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /▶.*Start/i })).toBeVisible();
  });

  test('Start changes button to Pause', async ({ page }) => {
    await page.getByRole('button', { name: /▶.*Start/i }).click();
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible();
  });

  test('Pause stops the timer', async ({ page }) => {
    await page.getByRole('button', { name: '30s' }).click();
    await page.getByRole('button', { name: /▶.*Start/i }).click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Pause/i }).click();
    const display = await page.getByText(/\d{2}:\d{2}/).textContent();
    await page.waitForTimeout(1500);
    const displayAfter = await page.getByText(/\d{2}:\d{2}/).textContent();
    expect(display).toBe(displayAfter); // frozen
  });

  test('Reset button restores original time', async ({ page }) => {
    await page.getByRole('button', { name: '30s' }).click();
    await page.getByRole('button', { name: /▶.*Start/i }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: '↩' }).click();
    await expect(page.getByText('00:30')).toBeVisible();
  });

  test('fullscreen button enters fullscreen overlay', async ({ page }) => {
    await page.getByRole('button', { name: '⛶' }).click();
    // Fullscreen overlay contains the timer in large text and exit button
    await expect(page.getByRole('button', { name: /✕.*Exit/i })).toBeVisible();
  });

  test('can exit fullscreen', async ({ page }) => {
    await page.getByRole('button', { name: '⛶' }).click();
    await page.getByRole('button', { name: /✕.*Exit/i }).click();
    await expect(page.getByRole('heading', { name: 'Workshop Timer' })).toBeVisible();
  });

  test('custom input sets a custom duration', async ({ page }) => {
    // The placeholder translates to "sec…" (not "custom")
    const input = page.locator('input[type="number"]');
    await input.fill('45');
    await input.press('Enter');
    await expect(page.getByText('00:45')).toBeVisible();
  });
});
