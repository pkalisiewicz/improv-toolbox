import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Jam Caller Board — build mode', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/jam');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Jam Caller Board' })).toBeVisible();
  });

  test('empty queue shows placeholder text', async ({ page }) => {
    await expect(page.getByText(/empty|add/i).first()).toBeVisible();
  });

  test('Start Show button is hidden when queue is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Start Show/i })).not.toBeVisible();
  });

  test('can add a custom item via text input', async ({ page }) => {
    await page.getByPlaceholder(/add|game|name/i).fill('Harold');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('p[class*="truncate"]').filter({ hasText: 'Harold' })).toBeVisible();
  });

  test('can add a custom item by pressing Enter', async ({ page }) => {
    const input = page.getByPlaceholder(/add|game|name/i);
    await input.fill('Montage');
    await input.press('Enter');
    await expect(page.locator('p[class*="truncate"]').filter({ hasText: 'Montage' })).toBeVisible();
  });

  test('Start Show button appears after adding an item', async ({ page }) => {
    await page.getByPlaceholder(/add|game|name/i).fill('Harold');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('button', { name: /Start Show/i })).toBeVisible();
  });

  test('can add a format via quick-add chips', async ({ page }) => {
    // Find any quick-add chip and click it
    const chips = page.locator('[class*="rounded-full"][class*="border-purple"]');
    await chips.first().click();
    // Queue should have 1 item now
    await expect(page.getByRole('button', { name: /Start Show/i })).toBeVisible();
  });

  test('can remove an item from the queue', async ({ page }) => {
    await page.getByPlaceholder(/add|game|name/i).fill('Test Game');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: '✕' }).click();
    // Item should be gone
    await expect(page.getByText('Test Game')).not.toBeVisible();
  });

  test('shows item numbers in queue', async ({ page }) => {
    await page.getByPlaceholder(/add|game|name/i).fill('Game A');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByPlaceholder(/add|game|name/i).fill('Game B');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
  });
});

test.describe('Jam Caller Board — show mode', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/jam');
    await page.getByPlaceholder(/add|game|name/i).fill('Test Format');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: /Start Show/i }).click();
  });

  test('enters show mode with a full-screen purple overlay', async ({ page }) => {
    await expect(page.locator('[class*="bg-purple-900"]')).toBeVisible();
  });

  test('shows the item name in large text', async ({ page }) => {
    await expect(page.getByText('Test Format')).toBeVisible();
  });

  test('shows progress indicator (1 / N)', async ({ page }) => {
    await expect(page.getByText(/1\s*\/\s*1/)).toBeVisible();
  });

  test('Next button advances and shows done screen after last item', async ({ page }) => {
    await page.getByRole('button', { name: /Next/i }).click();
    await expect(page.locator('[class*="text-7xl"]')).toBeVisible(); // 🎉 emoji
  });

  test('Exit button leaves show mode', async ({ page }) => {
    await page.getByRole('button', { name: /Exit/i }).click();
    await expect(page.getByRole('heading', { name: 'Jam Caller Board' })).toBeVisible();
  });

  test('Back button navigates to previous item from show mode', async ({ page }) => {
    // With only 1 item, Back should be disabled
    const backBtn = page.getByRole('button', { name: /Back|←/i });
    await expect(backBtn).toBeDisabled();
  });
});
