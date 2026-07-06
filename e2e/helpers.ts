import type { Page } from '@playwright/test';

/** English is selected by the Playwright web server's VITE_BUILD_LANG env. */
export async function setEnglish(page: Page) {
  void page;
}

/** Navigate to a route with English forced. */
export async function goTo(page: Page, path: string) {
  await setEnglish(page);
  await page.goto(path);
}
