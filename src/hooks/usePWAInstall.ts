import { useState, useEffect } from 'react';
import { IS_NATIVE_BUILD } from '../native/platform';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallState {
  /** Captured native install prompt (Android/Chrome). Null when unavailable. */
  installPrompt: BeforeInstallPromptEvent | null;
  /** True when running in standalone mode (already installed). */
  isInstalled: boolean;
  /** True on iOS Safari where manual "Add to Home Screen" is required. */
  isIOS: boolean;
  /** Trigger the native install dialog (Android/Chrome). */
  install: () => Promise<void>;
}

export function usePWAInstall(): PWAInstallState {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // Guard browser-only globals: these initializers also run during build-time
  // prerendering (Node), where `window`/`navigator` are undefined. Safe defaults
  // (false) are corrected client-side on hydration via the effect below.
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).standalone === true),
  );
  const [isIOS] = useState(() =>
    typeof window !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !('MSStream' in window),
  );

  useEffect(() => {

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // The native App is already installed — never surface web "add to home screen"
  // affordances. Reported as installed so install UI (button + iOS modal) hides.
  if (IS_NATIVE_BUILD) {
    return { installPrompt: null, isInstalled: true, isIOS: false, install: async () => {} };
  }

  return { installPrompt, isInstalled, isIOS, install };
}
