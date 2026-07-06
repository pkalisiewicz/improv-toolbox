// Regenerate the raster app icons from the GPT Images 2 brand master.
// PWA manifest + apple-touch reference the PNGs, not the SVG favicon.
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const source = join(root, 'assets/brand/app-icon-source.png');

const targets = [
  { png: 'pwa-192x192.png', size: 192 },
  { png: 'pwa-512x512.png', size: 512 },
  { png: 'apple-touch-icon.png', size: 180 },
];

const faviconSizes = [16, 32, 48];

function buildIconSvg(iconHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Improv Toolbox">
  <image href="${iconHref}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

const pwa512 = await sharp(source)
  .resize(512, 512, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(join(pub, 'icon.svg'), buildIconSvg(`data:image/png;base64,${pwa512.toString('base64')}`));

for (const { png, size } of targets) {
  await sharp(pwa512)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(join(pub, png));
  console.log(`${png} (${size}x${size})`);
}

const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(pwa512)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

writeFileSync(join(pub, 'favicon.ico'), buildIco(faviconPngs, faviconSizes));
console.log(`favicon.ico (${faviconSizes.join(', ')}px)`);

function buildIco(images, sizes) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + images.length * entrySize;
  const totalSize = directorySize + images.reduce((sum, image) => sum + image.length, 0);
  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(images.length, 4);

  let imageOffset = directorySize;
  images.forEach((image, index) => {
    const size = sizes[index];
    const entryOffset = headerSize + index * entrySize;

    ico.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    ico.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(image.length, entryOffset + 8);
    ico.writeUInt32LE(imageOffset, entryOffset + 12);

    image.copy(ico, imageOffset);
    imageOffset += image.length;
  });

  return ico;
}
