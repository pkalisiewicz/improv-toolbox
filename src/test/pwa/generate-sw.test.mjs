import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  computeBuildFingerprint,
  createServiceWorkerOptions,
} from '../../../scripts/generate-sw.mjs';

const temporaryDirectories = [];

async function createBuildFixture() {
  const directory = await mkdtemp(path.join(tmpdir(), 'improv-sw-test-'));
  temporaryDirectories.push(directory);
  await mkdir(path.join(directory, 'assets'));
  await writeFile(path.join(directory, 'index.html'), '<main>current build</main>');
  await writeFile(path.join(directory, '__spa-fallback.html'), '<main>app shell</main>');
  await writeFile(path.join(directory, 'assets', 'app.js'), 'console.log("current")');
  return directory;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, {
    recursive: true,
    force: true,
  })));
});

describe('service-worker cache versioning', () => {
  it('changes the cache version when a precached build file changes', async () => {
    const directory = await createBuildFixture();
    const firstFingerprint = await computeBuildFingerprint(directory);

    await writeFile(path.join(directory, 'assets', 'app.js'), 'console.log("updated")');

    expect(await computeBuildFingerprint(directory)).not.toBe(firstFingerprint);
  });

  it('ignores generated service-worker artifacts', async () => {
    const directory = await createBuildFixture();
    const firstFingerprint = await computeBuildFingerprint(directory);

    await writeFile(path.join(directory, 'sw.js'), 'generated worker');
    await writeFile(path.join(directory, 'sw.js.map'), 'generated source map');
    await writeFile(path.join(directory, 'workbox-runtime.js'), 'generated runtime');

    expect(await computeBuildFingerprint(directory)).toBe(firstFingerprint);
  });

  it('configures activation to replace the previous build cache', async () => {
    const directory = await createBuildFixture();
    const buildFingerprint = await computeBuildFingerprint(directory);
    const options = createServiceWorkerOptions(directory, buildFingerprint);

    expect(options.cacheId).toBe(`improv-toolbox-${buildFingerprint}`);
    expect(options.skipWaiting).toBe(true);
    expect(options.clientsClaim).toBe(true);
    expect(options.cleanupOutdatedCaches).toBe(true);
  });
});
