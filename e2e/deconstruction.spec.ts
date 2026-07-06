import { expect, test } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Deconstruction Notebook', () => {
  test.beforeEach(async ({ page }) => {
    await goTo(page, '/deconstruction');
  });

  test('keeps note drafts isolated per beat', async ({ page }) => {
    await page.locator('input').nth(0).fill('lighthouse');
    await page.locator('input').nth(1).fill('Mara');
    await page.locator('input').nth(2).fill('Jon');
    await page.getByRole('button', { name: /Start show/i }).click();

    const composer = page.locator('textarea');
    await expect(page.getByRole('heading', { name: /Opening Scene|Scena otwierająca/i })).toBeVisible();

    await composer.fill('opening draft only');
    await page.getByRole('button', { name: /^(Next|Dalej)$/i }).click();

    await expect(page.getByRole('heading', { name: /Thematic Scene A|Scena tematyczna A/i })).toBeVisible();
    await expect(composer).toHaveValue('');

    await composer.fill('theme draft only');
    await page.getByRole('button', { name: /^(Back|Wstecz)$/i }).click();

    await expect(page.getByRole('heading', { name: /Opening Scene|Scena otwierająca/i })).toBeVisible();
    await expect(composer).toHaveValue('opening draft only');

    await page.getByRole('button', { name: /^(Next|Dalej)$/i }).click();
    await expect(page.getByRole('heading', { name: /Thematic Scene A|Scena tematyczna A/i })).toBeVisible();
    await expect(composer).toHaveValue('theme draft only');
  });
});
