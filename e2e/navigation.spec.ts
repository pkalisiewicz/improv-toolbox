import { test, expect } from '@playwright/test';
import { goTo } from './helpers';

test.describe('Bottom navigation', () => {
  test('renders 5 navigation tabs', async ({ page }) => {
    await goTo(page, '/');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    const buttons = nav.getByRole('button');
    await expect(buttons).toHaveCount(5);
  });

  test('navigates to /wheel via tab', async ({ page }) => {
    await goTo(page, '/');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button').nth(0).click();
    await expect(page).toHaveURL(/\/wheel/);
    await expect(page.getByRole('heading', { name: 'Archetype Wheel' })).toBeVisible();
  });

  test('navigates to /scene via tab', async ({ page }) => {
    await goTo(page, '/');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button').nth(1).click();
    await expect(page).toHaveURL(/\/scene/);
    await expect(page.getByRole('heading', { name: 'Random Scene' })).toBeVisible();
  });

  test('navigates to /warmup via tab', async ({ page }) => {
    await goTo(page, '/');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button').nth(2).click();
    await expect(page).toHaveURL(/\/warmup/);
    await expect(page.getByRole('heading', { name: 'Warmup Generator' })).toBeVisible();
  });

  test('navigates to /facts via tab', async ({ page }) => {
    await goTo(page, '/');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button').nth(3).click();
    await expect(page).toHaveURL(/\/facts/);
    await expect(page.getByRole('heading', { name: 'Improv Facts' })).toBeVisible();
  });

  test('home link in header navigates to /', async ({ page }) => {
    await goTo(page, '/wheel');
    await page.locator('header a').first().click();
    await expect(page).toHaveURL('/');
  });

  test('header shows app title', async ({ page }) => {
    await goTo(page, '/');
    await expect(page.locator('header').getByText('Improv Toolbox')).toBeVisible();
  });

  test('language toggle button is present', async ({ page }) => {
    await goTo(page, '/');
    const langBtn = page.locator('header').getByRole('button', { name: /PL|EN/i });
    await expect(langBtn).toBeVisible();
  });
});

test.describe('Deep link routing', () => {
  const routes = [
    { path: '/wheel',      heading: 'Archetype Wheel' },
    { path: '/scene',      heading: 'Random Scene' },
    { path: '/warmup',     heading: 'Warmup Generator' },
    { path: '/facts',      heading: 'Improv Facts' },
    { path: '/timer',      heading: 'Workshop Timer' },
    { path: '/character',  heading: 'Character Builder' },
    { path: '/prompts',    heading: 'Prompt Cards' },
    { path: '/suggestions',heading: 'Audience Suggestions' },
    { path: '/formats',    heading: 'Format Library' },
    { path: '/reflection', heading: 'Reflection Prompts' },
    { path: '/soundscape', heading: 'Soundscape' },
    { path: '/status',     heading: 'Status Randomizer' },
    { path: '/spine',      heading: 'Story Spine' },
    { path: '/jam',        heading: 'Jam Caller Board' },
    { path: '/principles', heading: 'Improv Principles' },
    { path: '/monologue',  heading: 'Monologue Seeds' },
    { path: '/genres',     heading: 'Genre Style Cards' },
    { path: '/emotion',    heading: 'Emotion Wheel' },
    { path: '/constraints',heading: 'Scene Constraint Cards' },
    { path: '/metronome',  heading: 'BPM Metronome' },
    { path: '/variants',   heading: 'Game Variant Generator' },
    { path: '/replay',     heading: 'Scene Replay Cards' },
    { path: '/contact',    heading: 'Contact' },
  ];

  for (const { path, heading } of routes) {
    test(`${path} renders correct heading`, async ({ page }) => {
      await goTo(page, path);
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    });
  }
});
