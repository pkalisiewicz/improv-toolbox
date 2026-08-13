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
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(scriptsDir, '..', 'build', 'client');

const PRECACHE_EXTENSIONS = new Set([
  '.js',
  '.css',
  '.html',
  '.ico',
  '.svg',
  '.png',
  '.woff',
  '.woff2',
  '.webmanifest',
]);

function isPrecachedBuildFile(relativePath) {
  if (relativePath === 'sw.js' || relativePath === 'sw.js.map') return false;
  if (path.basename(relativePath).startsWith('workbox-')) return false;
  if (relativePath.startsWith('sounds/')) return false;
  if (path.basename(relativePath).startsWith('og-image')) return false;
  return PRECACHE_EXTENSIONS.has(path.extname(relativePath));
}

/**
 * A content-derived cache version makes every distinct Site build use a new
 * Workbox precache. This works for Vercel, local builds, and manual deploys;
 * it does not depend on a provider-specific commit environment variable.
 */
export async function computeBuildFingerprint(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(directory, path.join(entry.parentPath, entry.name)))
    .filter(isPrecachedBuildFile)
    .sort();

  const hash = createHash('sha256');
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update('\0');
    hash.update(await readFile(path.join(directory, relativePath)));
    hash.update('\0');
  }

  return hash.digest('hex').slice(0, 16);
}

export function createServiceWorkerOptions(directory, buildFingerprint) {
  return {
    globDirectory: directory,
    swDest: path.join(directory, 'sw.js'),

    // Precache the app shell + hashed assets + prerendered pages. Exclude the
    // 61 MB sounds/ dir (streamed on demand, not part of the offline shell) and
    // the social-share images (only ever fetched by crawlers, never the app).
    globPatterns: ['**/*.{js,css,html,ico,svg,png,woff,woff2,webmanifest}'],
    globIgnores: ['**/sounds/**', '**/og-image*', 'sw.js'],

    // Give every distinct build a new cache. During activation Workbox keeps
    // this freshly installed cache and destroys every older precache for this
    // origin, including the unversioned cache used by previous releases.
    cacheId: `improv-toolbox-${buildFingerprint}`,

    // Anti-staleness: take control immediately, remove the old cache, and let
    // registerSW's controllerchange listener reload open clients onto this
    // build's freshly precached SPA shell.
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,

    // Client-side routing: any navigation that isn't a static file is served the
    // SPA shell from precache, then React Router renders the real route. The
    // denylist keeps asset/file requests off the navigation handler.
    navigateFallback: '/__spa-fallback.html',
    navigateFallbackDenylist: [/^\/assets\//, /\/sounds\//, /\.[^/]+$/],
  };
}

export async function generateServiceWorker(directory = clientDir) {
  const buildFingerprint = await computeBuildFingerprint(directory);

  const { count, size, warnings } = await generateSW(
    createServiceWorkerOptions(directory, buildFingerprint),
  );

  warnings.forEach((w) => console.warn('[pwa]', w));
  console.log(
    `[pwa] precached ${count} files (${(size / 1024 / 1024).toFixed(2)} MiB) in cache ${buildFingerprint} -> build/client/sw.js`,
  );

  return { buildFingerprint, count, size, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateServiceWorker();
}
