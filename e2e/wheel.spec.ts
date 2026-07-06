import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Wheel page — setup phase', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/wheel');
  });

  test('shows heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Archetype Wheel' })).toBeVisible();
    await expect(page.getByText('Spin to assign an archetype to each person')).toBeVisible();
  });

  test('shows player count selector buttons (2–8)', async ({ page }) => {
    for (const n of [2, 3, 4, 5, 6, 7, 8]) {
      await expect(page.getByRole('button', { name: String(n) })).toBeVisible();
    }
  });

  test('Start button is disabled until a player count is selected', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /Start spinning/i });
    await expect(startBtn).toBeDisabled();
  });

  test('selecting a player count enables the Start button', async ({ page }) => {
    await page.getByRole('button', { name: '3' }).click();
    const startBtn = page.getByRole('button', { name: /Start spinning/i });
    await expect(startBtn).toBeEnabled();
  });

  test('uses all archetypes by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All archetypes' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.getByText('All 12 archetypes are in the wheel')).toBeVisible();
  });

  test('custom pool starts empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Custom pool' }).click();
    await expect(page.getByText('0/12')).toBeVisible();
  });

  test('can add archetypes to a custom pool', async ({ page }) => {
    await page.getByRole('button', { name: 'Custom pool' }).click();
    await page.getByRole('button', { name: 'Hero' }).click();
    await expect(page.getByText('1/12')).toBeVisible();
  });

  test('select-all toggle fills the custom pool', async ({ page }) => {
    await page.getByRole('button', { name: 'Custom pool' }).click();
    await page.getByRole('button', { name: /Select all/i }).click();
    await expect(page.getByText(/12\/12/)).toBeVisible();
  });

  test('custom pool controls which archetypes appear on the wheel', async ({ page }) => {
    await page.getByRole('button', { name: 'Custom pool' }).click();
    await page.getByRole('button', { name: 'Hero' }).click();
    await page.getByRole('button', { name: 'Fool' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: /Start spinning/i }).click();

    await expect(page.locator('.wheel-stage')).toBeVisible();
    await expect(page.getByText('Hero')).toBeVisible();
    await expect(page.getByText('Fool')).toBeVisible();
    await expect(page.getByText('Villain')).toBeHidden();
  });
});

test.describe('Wheel page — spinning phase', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/wheel');
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: /Start spinning/i }).click();
  });

  test('transitions to spinning phase with the wheel', async ({ page }) => {
    await expect(page.locator('.wheel-stage')).toBeVisible();
  });

  test('shows Spin button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Spin!/i })).toBeVisible();
  });
});

test.describe('Wheel page — reset flow', () => {
  test('can reset back to setup from results', async ({ page }) => {
    await goTo(page, '/wheel');
    await page.getByRole('button', { name: '2' }).click();
    const startBtn = page.getByRole('button', { name: /Start spinning/i });
    await expect(startBtn).toBeEnabled();
    await startBtn.click();
    await expect(page.locator('.wheel-stage')).toBeVisible();
  });
});
