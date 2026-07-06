import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Error pages', () => {
  test('unknown routes render the playful 404 page', async ({ page }) => {
    await goTo(page, '/missing-cue');

    await expect(page.getByRole('heading', { name: 'OHO, you got lost!' })).toBeVisible();
    await expect(page.getByText('404').first()).toBeVisible();

    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page).toHaveURL('/');
  });
});
