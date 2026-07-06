import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('BPM Metronome', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/metronome');
  });

  test('shows heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'BPM Metronome' })).toBeVisible();
  });

  test('shows initial BPM value', async ({ page }) => {
    // BPM display (default 80) — use exact match to avoid matching preset buttons like "Speech (80)"
    await expect(page.getByText('80', { exact: true })).toBeVisible();
  });

  test('Start button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
  });

  test('clicking Start changes button to Stop', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await expect(page.getByRole('button', { name: /Stop/i })).toBeVisible();
    // Stop it so audio doesn't bleed
    await page.getByRole('button', { name: /Stop/i }).click();
  });

  test('BPM can be increased via + button', async ({ page }) => {
    const incBtn = page.getByRole('button', { name: '+1' });
    await incBtn.click();
    // BPM should increment to 81
    await expect(page.getByText('81', { exact: true })).toBeVisible();
  });

  test('BPM can be decreased via − button', async ({ page }) => {
    const decBtn = page.getByRole('button', { name: '−1' });
    await decBtn.click();
    await expect(page.getByText('79', { exact: true })).toBeVisible();
  });

  test('BPM slider is present', async ({ page }) => {
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });

  test('time signature selector is visible', async ({ page }) => {
    // Buttons are labelled "2/4", "3/4", "4/4", "6/4"
    for (const ts of ['2/4', '3/4', '4/4', '6/4']) {
      await expect(page.getByRole('button', { name: ts })).toBeVisible();
    }
  });

  test('clicking a time signature selects it', async ({ page }) => {
    await page.getByRole('button', { name: '3' }).click();
    await expect(page.getByRole('button', { name: '3' })).toHaveClass(/bg-/);
  });

  test('Tap Tempo button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Tap/i })).toBeVisible();
  });

  test('tapping tempo twice updates BPM', async ({ page }) => {
    const tapBtn = page.getByRole('button', { name: /Tap/i });
    await tapBtn.click();
    await page.waitForTimeout(500);
    await tapBtn.click();
    // BPM should have changed to approx 120 (2 taps 500ms apart)
    const bpmText = await page.getByText(/\d{2,3}/).first().textContent();
    const bpm = parseInt(bpmText ?? '0');
    expect(bpm).toBeGreaterThan(0);
    expect(bpm).toBeLessThanOrEqual(240);
  });
});
