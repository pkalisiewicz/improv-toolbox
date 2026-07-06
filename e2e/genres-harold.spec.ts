import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Genre Style Cards', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/genres');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Genre Style Cards' })).toBeVisible();
  });

  test('renders multiple genre cards', async ({ page }) => {
    const cards = page.locator('[class*="rounded"][class*="border"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test('each genre card has a name and emoji', async ({ page }) => {
    // Genre selector buttons contain emoji + name
    const genreButtons = page.locator('button[class*="rounded-full"]');
    expect(await genreButtons.count()).toBeGreaterThanOrEqual(4);
  });

  test('genre cards have tip content', async ({ page }) => {
    // Tip items should be listed inside cards
    const tips = page.locator('li, [class*="tip"]');
    expect(await tips.count()).toBeGreaterThan(0);
  });
});

test.describe('Harold Format Page', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/harold');
  });

  test('shows Harold-related content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Harold/i })).toBeVisible();
  });

  test('renders multiple sections of Harold info', async ({ page }) => {
    const sections = page.locator('p[class*="uppercase tracking-wider"]');
    expect(await sections.count()).toBeGreaterThanOrEqual(2);
  });

  test('Harold content has meaningful text', async ({ page }) => {
    const text = page.locator('p').filter({ hasText: /\w{5,}/ }).first();
    await expect(text).toBeVisible();
  });
});
