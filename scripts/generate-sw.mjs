// Post-build service-worker generation.
//
// Why a post-build script instead of vite-plugin-pwa: React Router framework
// mode (ssr: false) runs a multi-environment build and writes the prerendered
// HTML + SPA fallback AFTER any Vite plugin's build hooks have run. That means
// an in-build PWA plugin can't see index.html / __spa-fallback.html when it
// generates its precache manifest (vite-pwa issue #809, RR issue #12659).
//
// Running workbox-build (the same engine vite-plugin-pwa wraps) as a discrete
// step after `react-router build` sidesteps the ordering problem entirely: by
// now build/client holds every hashed asset, every prerendered page, and the
// SPA fallback, so the precache is complete and correct.
import { generateSW } from 'workbox-build';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(scriptsDir, '..', 'build', 'client');

const { count, size, warnings } = await generateSW({
  globDirectory: clientDir,
  swDest: path.join(clientDir, 'sw.js'),

  // Precache the app shell + hashed assets + prerendered pages. Exclude the
  // 61 MB sounds/ dir (streamed on demand, not part of the offline shell) and
  // the social-share images (only ever fetched by crawlers, never the app).
  globPatterns: ['**/*.{js,css,html,ico,svg,png,woff,woff2,webmanifest}'],
  globIgnores: ['**/sounds/**', '**/og-image*', 'sw.js'],

  // Anti-staleness: skipWaiting + clientsClaim make a freshly deployed SW take
  // control immediately; cleanupOutdatedCaches purges precaches from previous
  // SW revisions (including the old orphaned Workbox SW we're replacing).
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,

  // Client-side routing: any navigation that isn't a static file is served the
  // SPA shell from precache, then React Router renders the real route. The
  // denylist keeps asset/file requests off the navigation handler.
  navigateFallback: '/__spa-fallback.html',
  navigateFallbackDenylist: [/^\/assets\//, /\/sounds\//, /\.[^/]+$/],
});

warnings.forEach((w) => console.warn('[pwa]', w));
console.log(
  `[pwa] precached ${count} files (${(size / 1024 / 1024).toFixed(2)} MiB) -> build/client/sw.js`,
);
