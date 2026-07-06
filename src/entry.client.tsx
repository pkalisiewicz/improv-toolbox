// Ejected from React Router's built-in default so we can register the PWA
// service worker after hydration. The hydration block below is identical to
// RR's default client entry (root.tsx renders the full <html>, so we hydrate
// `document`).
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { registerSW } from './pwa/registerSW';
import { IS_NATIVE_BUILD } from './native/platform';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});

if (IS_NATIVE_BUILD) {
  // App: native bootstrap (splash, language reconcile, status bar, analytics).
  // Dynamically imported so the Capacitor code never enters the Site bundle.
  void import('./native/init').then(({ initNative }) => initNative());
} else {
  // Site: register the offline service worker.
  registerSW();
}
