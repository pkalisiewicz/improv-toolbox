// Store screenshots for the native App, captured from the bilingual native build
// via Chromium (the App is this same web UI in a WebView). Run against a dev
// server started with VITE_BUILD_TARGET=native:
//   VITE_BUILD_TARGET=native npm run dev   (in another shell)
//   node scripts/screenshots.mjs
// Output: tmp/store-screenshots/<size>/<lang>/<name>.png
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const BASE = process.env.SHOTS_BASE || 'http://localhost:5173';
const OUT = 'tmp/store-screenshots';

// Apple wants tall 6.9" iPhone (1320x2868). Google Play rejects >2:1, so phone
// shots are 9:16 (1080x1920). deviceScaleFactor multiplies the logical viewport.
const SIZES = [
  { id: 'ios-6.9', width: 440, height: 956, dsf: 3 }, // 1320 x 2868
  { id: 'android-phone', width: 360, height: 640, dsf: 3 }, // 1080 x 1920
];
const LANGS = ['en', 'pl'];
const SCREENS = [
  { name: '01-home', path: '/' },
  { name: '02-wheel', path: '/wheel' },
  { name: '03-scene', path: '/scene' },
  { name: '04-warmup', path: '/warmup' },
  { name: '05-timer', path: '/timer' },
  { name: '06-character', path: '/character' },
  { name: '07-prompts', path: '/prompts' },
];

const browser = await chromium.launch();
let count = 0;
for (const size of SIZES) {
  for (const lang of LANGS) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: size.dsf,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce', // freeze animations for clean frames
    });
    // The native build seeds language from localStorage['i18nextLng']; force a
    // light theme for consistent marketing shots.
    await context.addInitScript((lng) => {
      localStorage.setItem('i18nextLng', lng);
      localStorage.setItem('improv-toolbox-theme', 'light');
    }, lang);
    const page = await context.newPage();
    for (const screen of SCREENS) {
      await page.goto(BASE + screen.path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700);
      const dir = join(OUT, size.id, lang);
      await mkdir(dir, { recursive: true });
      await page.screenshot({ path: join(dir, `${screen.name}.png`) });
      count++;
      console.log(`${size.id}/${lang}/${screen.name}.png`);
    }
    await context.close();
  }
}
await browser.close();
console.log(`\nDone — ${count} screenshots in ${OUT}/`);
