# Add a crawlable, bilingual content surface (Entries) for SEO reach

---
Status: accepted
---

To grow reach, we add a second surface alongside the interactive **Tools**: build-time-rendered, indexable **Entry** pages for our content corpus (warmup games, formats, principles), plus **Aggregate Entries** for thin Pools (scene Elements, emotions, suggestions). Today the app is a client-only SPA (`<div id="root">`, no SSR/sitemap), so its ~5,700 lines of bilingual content are invisible to search engines despite being exactly what people google. We render Entries at build time with **vite-react-ssg** and serve the two languages from two owned domains — `improv-toolbox.com` (EN) and `skrzynka-improwizatora.pl` (PL) — cross-linked with `hreflang`.

## Considered Options

- **Render mechanism.** Chose `vite-react-ssg` (true build-time SSG; `getStaticPaths` maps cleanly to `/warmups/:slug`). Rejected **snapshot/headless prerender** (lower-risk, router-agnostic, but ships+hydrates the full bundle) and **migrating to Astro** (best content-SEO — zero-JS pages — but a disproportionate rewrite of a mature 26-page app).
- **Bilingual URLs.** Chose **domain-per-language** over a single domain with `/en` + `/pl` prefixes. Rationale: both domains are already owned and branded, and EN/PL queries don't compete in the same SERP, so splitting SEO authority across two language-domains costs little here.
- **Slugs.** Chose **localized path segment + real-usage item slug** (`skrzynka-improwizatora.pl/rozgrzewki/freeze`), with an explicit `{ en, pl }` slug pair per Entry. Rejected fully-translated Polish slugs (over-translates borrowed improv jargon nobody searches in Polish) and English-everywhere (forfeits the high-volume Polish *category* head terms and reads as half-localized on a Polish-branded domain).
- **Index scope / granularity.** Chose **adaptive granularity, split-by-data**: per-item Entries for content with enough unique text; one Aggregate Entry per thin Pool; promote aggregates to per-item only when Search Console shows demand. Rejected literal per-item pages for everything (thin/doorway pages can demote the whole site).
- **Content depth.** Chose **PL-first, ship lean**: ~50–70-word Entries rank in low-competition Polish but not in crowded English; expand English depth later, only where Search Console shows page-2/3 proximity.

## Consequences

- **Build-time browser-API guards required.** SSG renders in Node, so render/mount-time use of `canvas` (`WheelCanvas`), Web Audio (`useMetronome`), `HTMLAudioElement` (`useSoundscape`), and `localStorage` (`useDeconstruction`, `useFavoriteTools`, i18n bootstrap, `PWAInstallBanner`) must be guarded (`import.meta.env.SSR` / `ClientOnly`) or the build fails.
- **React Router version spike needed.** `vite-react-ssg` documents RR v6; the app is on `react-router-dom` v7. Adopting it means routing through vite-react-ssg's router layer and converting the declarative `<Routes>` tree to a `routes` config — verify in a spike before committing.
- **i18n moves from runtime to build time.** Language is currently chosen at runtime from `window.location.hostname` + `localStorage`; SSG bakes one language per build, so we produce two per-language builds, one per domain.
- **301 slug-form redirects.** Each domain 301-redirects the foreign slug form to its canonical local form (e.g. PL domain: `/warmups/freeze` → `/rozgrzewki/freeze`), generated from the `{ en, pl }` slug map. Distinct from `hreflang`, which links the EN ↔ PL language alternates.
- **Measurement dependency.** The "split-by-data" and "expand-EN-by-data" decisions require **Google Search Console** verification on both domains; the existing `@vercel/analytics` gives traffic, not search-query data.
