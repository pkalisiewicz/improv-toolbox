import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const pub = join(root, 'public');
const iconSource = join(root, 'assets/brand/app-icon-source.png');

const TARGET_W = 1200;
const TARGET_H = 630;
const INK = '#16211A';
const PAPER = '#F6FCF8';
const SURFACE = '#FCFEFC';
const ACCENT = '#71C883';
const FOREST = '#2F6640';
const LINE = '#D8E6DC';

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function buildIconSvg(iconHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Improv Toolbox">
  <image href="${iconHref}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

function textLines(lines, x, y, size, color, weight = 500, lineHeight = 1.28) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Hanken Grotesk, Inter, system-ui, Arial, sans-serif" font-size="${size}" font-weight="${weight}">
    ${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineHeight}">${escapeXml(line)}</tspan>`).join('\n')}
  </text>`;
}

function chip(text, x, y, width) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="44" rx="10" fill="${SURFACE}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${x + 22}" cy="${y + 22}" r="5" fill="${ACCENT}"/>
    <text x="${x + 40}" y="${y + 28}" fill="${INK}" font-family="Hanken Grotesk, Inter, system-ui, Arial, sans-serif" font-size="16" font-weight="800">${escapeXml(text)}</text>
  `;
}

function buildOgSvg(copy, iconHref) {
  const titleSize = copy.title.length > 18 ? 58 : 72;
  const subtitle = copy.subtitleLines;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TARGET_W}" height="${TARGET_H}" viewBox="0 0 ${TARGET_W} ${TARGET_H}">
  <defs>
    <filter id="hard-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="10" dy="10" stdDeviation="0" flood-color="${INK}" flood-opacity="1"/>
    </filter>
    <clipPath id="icon-clip">
      <rect x="810" y="108" width="294" height="294" rx="58"/>
    </clipPath>
  </defs>

  <rect width="${TARGET_W}" height="${TARGET_H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${TARGET_W}" height="106" fill="${INK}"/>
  <rect x="0" y="106" width="${TARGET_W}" height="7" fill="${ACCENT}"/>

  <text x="64" y="73" fill="${SURFACE}" font-family="Arial Narrow, Impact, sans-serif" font-size="72" font-weight="900" letter-spacing="1">IMPROV</text>
  <text x="353" y="68" fill="#C9D8CF" font-family="Hanken Grotesk, Inter, system-ui, Arial, sans-serif" font-size="18" font-style="italic">${escapeXml(copy.masthead)}</text>

  <g transform="translate(64 170)">
    <text x="0" y="0" fill="${INK}" font-family="Arial Narrow, Impact, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="0.5">${escapeXml(copy.title)}</text>
    ${textLines(subtitle, 2, 66, 27, INK, 700, 1.18)}
    <rect x="0" y="178" width="${copy.ctaWidth}" height="62" rx="13" fill="${ACCENT}" stroke="${INK}" stroke-width="3"/>
    <text x="30" y="218" fill="${INK}" font-family="Hanken Grotesk, Inter, system-ui, Arial, sans-serif" font-size="23" font-weight="900">${escapeXml(copy.cta)}</text>

    <g transform="translate(0 286)">
      ${chip(copy.chips[0], 0, 0, copy.chipWidths[0])}
      ${chip(copy.chips[1], copy.chipWidths[0] + 14, 0, copy.chipWidths[1])}
      ${chip(copy.chips[2], 0, 58, copy.chipWidths[2])}
    </g>
  </g>

  <g filter="url(#hard-shadow)">
    <rect x="774" y="72" width="366" height="452" rx="32" fill="${SURFACE}" stroke="${INK}" stroke-width="4"/>
    <rect x="798" y="96" width="318" height="318" rx="68" fill="${ACCENT}" stroke="${INK}" stroke-width="4"/>
    <image href="${iconHref}" x="810" y="108" width="294" height="294" preserveAspectRatio="xMidYMid slice" clip-path="url(#icon-clip)"/>
    <rect x="798" y="96" width="318" height="318" rx="68" fill="none" stroke="${INK}" stroke-width="4"/>
    <rect x="810" y="438" width="294" height="20" rx="10" fill="${INK}"/>
    <rect x="810" y="472" width="174" height="16" rx="8" fill="${FOREST}"/>
  </g>

  <path d="M64 575H1136" stroke="${LINE}" stroke-width="2"/>
  <text x="64" y="606" fill="${FOREST}" font-family="Hanken Grotesk, Inter, system-ui, Arial, sans-serif" font-size="16" font-weight="800">${escapeXml(copy.footer)}</text>
</svg>`;
}

const pwa512 = await sharp(iconSource)
  .resize(512, 512, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(pwa512)
  .resize(192, 192, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(join(pub, 'pwa-192x192.png'));

writeFileSync(join(pub, 'pwa-512x512.png'), pwa512);

await sharp(pwa512)
  .resize(180, 180, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(join(pub, 'apple-touch-icon.png'));

const iconDataHref = `data:image/png;base64,${pwa512.toString('base64')}`;
writeFileSync(join(pub, 'icon.svg'), buildIconSvg(iconDataHref));

const images = [
  {
    svg: 'og-image.svg',
    png: 'og-image.png',
    copy: {
      title: 'Improv Toolbox',
      masthead: 'free, offline-ready stage toolkit',
      subtitleLines: ['A fast mobile toolkit for warmups,', 'scene prompts, characters and longform shows.'],
      cta: 'Spin the archetype wheel',
      ctaWidth: 330,
      chips: ['26 focused tools', 'works offline', 'English + Polish'],
      chipWidths: [198, 166, 194],
      footer: 'Built for improvisers, teachers, troupe hosts and jam leaders.',
    },
  },
  {
    svg: 'og-image-pl.svg',
    png: 'og-image-pl.png',
    copy: {
      title: 'Skrzynka Improwizatora',
      masthead: 'darmowe narzędzia do impro',
      subtitleLines: ['Szybki mobilny zestaw do rozgrzewek,', 'scen, postaci i struktur longform.'],
      cta: 'Zakręć kołem archetypów',
      ctaWidth: 340,
      chips: ['26 narzędzi', 'działa offline', 'po polsku i angielsku'],
      chipWidths: [154, 158, 232],
      footer: 'Dla improwizatorów, trenerów, grup i prowadzących jamy.',
    },
  },
];

for (const { svg, png, copy } of images) {
  writeFileSync(join(pub, svg), buildOgSvg(copy, iconDataHref));
  await sharp(Buffer.from(buildOgSvg(copy, iconDataHref)))
    .resize(TARGET_W, TARGET_H, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(join(pub, png));
  console.log(`${png} generated`);
}

console.log('PWA icons generated');
