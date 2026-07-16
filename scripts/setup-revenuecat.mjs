// Provision the RevenueCat side of the tip jar (docs/adr/0002) via REST API v2.
//
// Creates, idempotently, in the project the secret key belongs to:
//   - the App Store app (bundle id com.improvtoolbox.app)
//   - three consumable tip products per store app (coffee / round / jam)
//   - a "default" offering with one package per tier, products attached
//   - marks the offering current (what Purchases.getOfferings() returns)
//
// Safe to re-run: everything is looked up before it is created. Also covers a
// play_store app and the built-in Test Store app when they exist in the
// project, so Android and local dev testing pick up the same offering later.
//
// Usage:
//   REVENUECAT_SECRET_KEY=sk_... node scripts/setup-revenuecat.mjs [--project <proj_id>] [--dry-run]
//
// The key can also live in .env.local (never committed). Generate one at
// app.revenuecat.com → Project settings → API keys → "New" secret key, with
// read/write on Project configuration.
//
// What this CANNOT do (dashboard/App Store Connect only):
//   - upload the In-App Purchase Key (.p8) — required for purchase validation
//   - create the App Store Connect IAP products themselves
//   - mint the public SDK key (it prints it when the API exposes it)

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const API = 'https://api.revenuecat.com/v2';
const BUNDLE_ID = 'com.improvtoolbox.app';
const APP_NAME = 'Improv Toolbox';
const OFFERING = { lookup_key: 'default', display_name: 'Tip Jar' };

// One consumable per tier. store_identifier must match the product id created
// in App Store Connect / Play Console EXACTLY. The user-facing title/price come
// from the store listing, not from these display names (dashboard-only).
const TIERS = [
  { lookup_key: 'coffee', store_identifier: `${BUNDLE_ID}.tip.coffee`, display_name: 'Tip — Coffee', position: 1 },
  { lookup_key: 'round', store_identifier: `${BUNDLE_ID}.tip.round`, display_name: 'Tip — Round of Applause', position: 2 },
  { lookup_key: 'jam', store_identifier: `${BUNDLE_ID}.tip.jam`, display_name: 'Tip — Whole Jam', position: 3 },
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const projectFlag = args.includes('--project') ? args[args.indexOf('--project') + 1] : undefined;

main().catch((error) => {
  console.error(`\n✖ ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const key = loadSecretKey();
  const project = await pickProject(key);
  console.log(`Project: ${project.name} (${project.id})`);

  const apps = await ensureApps(key, project.id);
  const products = await ensureProducts(key, project.id, apps);
  const offering = await ensureOffering(key, project.id);
  const packages = await ensurePackages(key, project.id, offering);
  await attachProducts(key, project.id, packages, products);
  await makeCurrent(key, project.id, offering);

  printSummary(apps);
}

// --- steps ---

async function pickProject(key) {
  const projects = await listAll(key, `/projects`);
  if (projectFlag) {
    const match = projects.find((p) => p.id === projectFlag);
    if (!match) throw new Error(`No project ${projectFlag}. Available: ${projects.map((p) => p.id).join(', ')}`);
    return match;
  }
  if (projects.length === 1) return projects[0];
  if (projects.length === 0) {
    throw new Error('The secret key has no visible project. Create one at app.revenuecat.com first.');
  }
  throw new Error(
    `Key sees ${projects.length} projects — pass --project <id>:\n` +
      projects.map((p) => `  ${p.id}  ${p.name}`).join('\n'),
  );
}

/** The App Store app is created if missing; play_store / test_store apps are
 * picked up only if they already exist (Android comes later). */
async function ensureApps(key, projectId) {
  const existing = await listAll(key, `/projects/${projectId}/apps`);
  const apps = existing.filter((a) => ['app_store', 'play_store', 'test_store'].includes(a.type));

  let ios = apps.find((a) => a.type === 'app_store' && a.app_store?.bundle_id === BUNDLE_ID);
  if (!ios) {
    ios = await create(key, `/projects/${projectId}/apps`, {
      name: `${APP_NAME} (iOS)`,
      type: 'app_store',
      app_store: { bundle_id: BUNDLE_ID },
    });
    if (ios) apps.push(ios);
    console.log(`  + created App Store app for ${BUNDLE_ID}`);
  } else {
    console.log(`  = App Store app exists (${ios.id})`);
  }
  return apps;
}

/** Ensure the three consumables exist for every store app in the project. */
async function ensureProducts(key, projectId, apps) {
  const existing = await listAll(key, `/projects/${projectId}/products`);
  const products = [];
  for (const app of apps) {
    if (!app?.id) continue;
    for (const tier of TIERS) {
      let product = existing.find(
        (p) => p.app_id === app.id && p.store_identifier === tier.store_identifier,
      );
      if (!product) {
        product = await create(key, `/projects/${projectId}/products`, {
          store_identifier: tier.store_identifier,
          app_id: app.id,
          type: 'consumable',
          display_name: `${tier.display_name} (${app.type})`,
        });
        console.log(`  + created product ${tier.store_identifier} on ${app.type}`);
      } else {
        console.log(`  = product ${tier.store_identifier} exists on ${app.type}`);
      }
      if (product) products.push({ ...product, tier: tier.lookup_key });
    }
  }
  return products;
}

async function ensureOffering(key, projectId) {
  const offerings = await listAll(key, `/projects/${projectId}/offerings`);
  const found = offerings.find((o) => o.lookup_key === OFFERING.lookup_key);
  if (found) {
    console.log(`  = offering "${OFFERING.lookup_key}" exists (${found.id})`);
    return found;
  }
  const created = await create(key, `/projects/${projectId}/offerings`, OFFERING);
  console.log(`  + created offering "${OFFERING.lookup_key}"`);
  return created;
}

async function ensurePackages(key, projectId, offering) {
  if (!offering?.id) return [];
  const existing = await listAll(key, `/projects/${projectId}/offerings/${offering.id}/packages`);
  const packages = [];
  for (const tier of TIERS) {
    let pkg = existing.find((p) => p.lookup_key === tier.lookup_key);
    if (!pkg) {
      pkg = await create(key, `/projects/${projectId}/offerings/${offering.id}/packages`, {
        lookup_key: tier.lookup_key,
        display_name: tier.display_name,
        position: tier.position,
      });
      console.log(`  + created package "${tier.lookup_key}"`);
    } else {
      console.log(`  = package "${tier.lookup_key}" exists`);
    }
    if (pkg) packages.push({ ...pkg, tier: tier.lookup_key });
  }
  return packages;
}

/** Attach each tier's products (one per store app) to that tier's package.
 * Attaching an already-attached product is treated as success. */
async function attachProducts(key, projectId, packages, products) {
  for (const pkg of packages) {
    const attached = await listAll(key, `/projects/${projectId}/packages/${pkg.id}/products`).catch(() => []);
    const attachedIds = new Set(attached.map((p) => p.product?.id ?? p.id));
    const wanted = products.filter((p) => p.tier === pkg.tier && !attachedIds.has(p.id));
    if (wanted.length === 0) {
      console.log(`  = package "${pkg.tier}" already fully attached`);
      continue;
    }
    try {
      await create(key, `/projects/${projectId}/packages/${pkg.id}/products`, {
        products: wanted.map((p) => ({ product_id: p.id, eligibility_criteria: 'all' })),
      });
      console.log(`  + attached ${wanted.length} product(s) to "${pkg.tier}"`);
    } catch (error) {
      if (/already/i.test(error.message)) {
        console.log(`  = products already attached to "${pkg.tier}"`);
      } else {
        throw error;
      }
    }
  }
}

async function makeCurrent(key, projectId, offering) {
  if (!offering?.id) return;
  if (offering.is_current) {
    console.log(`  = offering already current`);
    return;
  }
  // v2 updates use POST on the resource; fall back to PUT for older shapes.
  try {
    await create(key, `/projects/${projectId}/offerings/${offering.id}`, { is_current: true });
  } catch {
    await request(key, 'PUT', `/projects/${projectId}/offerings/${offering.id}`, { is_current: true });
  }
  console.log(`  + offering marked current`);
}

function printSummary(apps) {
  console.log('\nDone. RevenueCat is configured.');
  for (const app of apps) {
    const publicKey = findPublicKey(app);
    console.log(`  ${app.type}: ${app.id}${publicKey ? `  public key: ${publicKey}` : ''}`);
  }
  console.log(`
Remaining manual steps:
  1. App Store Connect → Monetization → In-App Purchases: create the 3
     consumables with EXACTLY these product ids (+ EN/PL localizations,
     price tier, review screenshot):
${TIERS.map((t) => `       ${t.store_identifier}`).join('\n')}
  2. App Store Connect → Users and Access → Integrations → In-App Purchase:
     generate an In-App Purchase Key (.p8) and upload it in the RevenueCat
     dashboard (project → Apps & providers → the App Store app).
  3. Copy the public Apple SDK key (appl_…) from the dashboard into
     .env.local as VITE_RC_IOS_KEY, then ship a new build (the key is
     inlined at build time).`);
}

// --- API helpers ---

function loadSecretKey() {
  if (!process.env.REVENUECAT_SECRET_KEY) {
    for (const file of ['.env', '.env.local']) {
      let contents;
      try {
        contents = readFileSync(resolve(root, file), 'utf8');
      } catch {
        continue;
      }
      const match = /^REVENUECAT_SECRET_KEY\s*=\s*("?)(.+)\1\s*$/m.exec(contents);
      if (match?.[2]) process.env.REVENUECAT_SECRET_KEY = match[2].trim();
    }
  }
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key || !key.startsWith('sk_')) {
    throw new Error(
      'Set REVENUECAT_SECRET_KEY (sk_…) in the environment or .env.local. ' +
        'Create one at app.revenuecat.com → Project settings → API keys (v2 secret key, ' +
        'read/write on Project configuration).',
    );
  }
  return key;
}

async function request(key, method, path, body) {
  if (dryRun && method !== 'GET') {
    console.log(`  (dry-run) ${method} ${path} ${body ? JSON.stringify(body) : ''}`);
    return undefined;
  }
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 429 && attempt < 3) {
      const wait = Number(response.headers.get('Retry-After') ?? 2) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    const text = await response.text();
    const json = text ? JSON.parse(text) : undefined;
    if (!response.ok) {
      throw new Error(`${method} ${path} → ${response.status}: ${json?.message ?? text}`);
    }
    return json;
  }
}

function create(key, path, body) {
  return request(key, 'POST', path, body);
}

/** Follow v2 list pagination ({items, next_page}). */
async function listAll(key, path) {
  const items = [];
  let next = `${path}${path.includes('?') ? '&' : '?'}limit=100`;
  while (next) {
    const page = await request(key, 'GET', next);
    items.push(...(page?.items ?? []));
    next = page?.next_page ? page.next_page.replace(/^\/v2/, '') : undefined;
  }
  return items;
}

/** The v2 App object exposes the public SDK key with a platform prefix
 * (appl_/goog_/test_); scan for it so we can print it without hardcoding the
 * field name across API revisions. */
function findPublicKey(app) {
  const match = /"(appl_[A-Za-z]+|goog_[A-Za-z]+|test_[A-Za-z]+)"/.exec(JSON.stringify(app ?? {}));
  return match?.[1];
}
