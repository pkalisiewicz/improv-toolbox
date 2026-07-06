# Ship the App to the App Store and Google Play via Capacitor with a product-matched native layer

---
Status: accepted
---

To reach phone users through the stores, we wrap the existing web build in **Capacitor** — one native binary per store, loading our React Router client bundle from the on-device filesystem (`capacitor://localhost`) — rather than rewriting in React Native or shipping a thin web view. Because Apple's **Guideline 4.2.2** rejects "web clippings" (a wrapper indistinguishable from Safari), we deliberately add a **product-matched native layer** — Haptics on every Draw, the native Share sheet for prompts/scenes, a Local Notification for the Timer, native status bar and splash — so the App reads as a genuine app, not a bookmark. This is a second distribution of the same **Tools**, alongside the **Site** (see [0001](./0001-seo-content-surface.md)); the web codebase stays the single source.

## Considered Options

- **Wrapper technology.** Chose **Capacitor for both platforms**: the app is already offline, backend-free, and `fetch`-free, so a WebView shell runs it verbatim and native plugins cover the 4.2 gap. Rejected **React Native** (a multi-week rewrite of 26 Tools that discards the web app), **TWA-on-Android + Capacitor-on-iOS** (two offline mechanisms to maintain, and TWA needs the disabled PWA re-enabled), and **submitting the raw PWA** (Google tolerates it; Apple effectively does not).
- **4.2 strategy.** Chose a **product-matched native layer** over a thin wrapper. Real rejections show that even push + Core Location + Share can be deemed "not robust enough," so we lean on what genuinely fits improv: tactile Haptics, sharing draws, a Timer that notifies when the room's time is up. Rejected **minimal-wrap-and-iterate** (likely multiple multi-week reject cycles) and **maximal native** (widgets/Siri — work beyond what v1 users need).
- **Monetization.** **Free, no ads, with an optional consumable IAP "tip jar"** (StoreKit on iOS, Play Billing on Android). We ship worldwide, and an external "buy me a coffee" web link is only permitted on iOS in the US storefront (May 2025 change) — it stays restricted on the Polish/EU and most non-US storefronts, where tips/donations are excluded from the external-link entitlement. So in-app tipping must go through IAP to be compliant everywhere. The existing external "support the creator" link is hidden on iOS and may remain on Android/web.

## Consequences

- **Two offline mechanisms now exist.** The Site uses a Workbox service worker; the App is offline because its assets are bundled on-device. The service worker (`registerSW`) is **disabled on native** — a SW inside the WebView fights Capacitor's bundle and causes stale-version bugs.
- **PWA-only UI is suppressed on native.** The install button / `PWAInstallModal` (`usePWAInstall`) is meaningless once installed and is hidden when `Capacitor.isNativePlatform()`.
- **A boot spike is required first.** The build is React Router 7 in `ssr:false` SPA mode, today served by Vercel with a `__spa-fallback.html` rewrite. We must confirm the client bundle boots and routes from the Capacitor local origin before investing in store work.
- **The critical path is Google's tester gate, not the code.** Personal Google Play accounts must run a closed test with ≥12 testers for 14 consecutive days before production — so enrollment and tester recruitment run in parallel with development.
- **Native projects live in this repo.** `ios/` and `android/` are committed (monorepo); build artifacts are gitignored.
