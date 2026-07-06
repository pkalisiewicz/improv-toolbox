# The native App is one bilingual binary, language chosen at runtime

---
Status: accepted
---

The **Site** ships one monolingual build per language on its own domain, with the language baked in at build time (see [0001](./0001-seo-content-surface.md)) and switched by navigating between domains. The native **App** has no domain to navigate to, so it deliberately diverges: **one binary carries both languages**, seeds its **Language** from the device locale on first launch, exposes an in-app switch (`i18n.changeLanguage`), and remembers the choice via Capacitor Preferences. We ship one App per store, not one per language.

## Considered Options

- **One bilingual binary** (chosen) — both translation JSONs bundled, device-locale default, in-app toggle. One App Store / Play listing, both audiences served.
- **Two native apps** (rejected) — mirrors the Site's per-domain model but doubles listings, screenshots, review cycles, and maintenance for a single product.
- **English-only native first** (rejected) — fastest to submit, but abandons the Polish audience (the primary `improv-app` domain) at launch.
- **Locale-locked, no toggle** (rejected) — a bilingual Polish user on an English phone could never reach Polish, and it discards the existing toggle UX.

## Consequences

- **`i18n.ts` branches by platform.** On the Site, `BUILD_LANG` stays a compile-time constant loading one locale. On native, both `en` and `pl` resources are bundled and the initial language comes from the device, not `VITE_BUILD_LANG`.
- **The language switcher branches.** `HeaderControls.setLang` keeps the cross-domain `window.location.assign` on the Site, but on native calls `i18n.changeLanguage` and persists — the domain hop would otherwise eject the user into a browser.
- **Home-screen name and store listings stay localized** (EN "Improv Toolbox" / PL "Skrzynka Improwizatora") on top of the single, brand-neutral bundle ID `com.improvtoolbox.app`.
- **The Site's SEO model is untouched** — this divergence is additive; nothing about per-domain monolingual builds changes.
