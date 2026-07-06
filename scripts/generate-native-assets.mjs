// Build the source assets that @capacitor/assets consumes (assets/icon.png,
// assets/splash.png) from the gold brand master. Then run:
//   npx @capacitor/assets generate --ios --android
// to fan them out into ios/ and android/ native icon + splash sets.
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const master = join(root, 'assets/brand/app-icon-source.png');
const assets = join(root, 'assets');

// Launch background — must match capacitor.config.ts SplashScreen.backgroundColor
// so the native splash blends into the dark masthead the app opens onto.
const LAUNCH_BG = '#0B0E0B';

// 1) App icon — 1024 square, fully opaque (iOS forbids alpha on app icons).
await sharp(master)
  .resize(1024, 1024, { fit: 'cover' })
  .flatten({ background: LAUNCH_BG })
  .png()
  .toFile(join(assets, 'icon.png'));
console.log('assets/icon.png (1024x1024)');

// 2) Splash — the icon as a rounded tile, centered on the dark launch bg.
const CANVAS = 2732;
const TILE = 820;
const RADIUS = 184;

const roundedMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}">` +
    `<rect width="${TILE}" height="${TILE}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff"/></svg>`,
);

const tile = await sharp(master)
  .resize(TILE, TILE, { fit: 'cover' })
  .composite([{ input: roundedMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: LAUNCH_BG },
  })
    .composite([{ input: tile, gravity: 'center' }])
    .png()
    .toFile(join(assets, name));
  console.log(`assets/${name} (${CANVAS}x${CANVAS})`);
}
