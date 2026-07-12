import i18n from '../i18n';
import { persistLang, readDurableLang } from './lang';
import { configureTipJar } from './tipJar';
import { DEFAULT_APP_LANG, resolveSupportedLang } from '../languages';

const NATIVE_BOOT_TIMEOUT_MS = 1_500;
const SPLASH_HIDE_TIMEOUT_MS = 1_000;

/**
 * Native App bootstrap, run once after hydration (entry.client.tsx). Every
 * Capacitor plugin is dynamically imported so the Site build never pulls them
 * in. Native setup is best-effort: the splash screen is hidden after a short
 * deadline even if a plugin bridge call never settles.
 */
export async function initNative(): Promise<void> {
  await settleWithin(runNativeSetup(), NATIVE_BOOT_TIMEOUT_MS);
  await settleWithin(hideSplash(), SPLASH_HIDE_TIMEOUT_MS);
}

async function runNativeSetup(): Promise<void> {
  // 1) Reconcile language against the durable store (survives WebView storage
  //    eviction, where localStorage would have been lost and i18n fell back to
  //    the device locale). Do this before hiding the splash to avoid a flash.
  try {
    const durable = await readDurableLang();
    if (durable && durable !== i18n.language) {
      await i18n.changeLanguage(durable);
    } else if (!durable) {
      // First launch — capture whatever i18n resolved to.
      await persistLang(resolveSupportedLang(i18n.language, DEFAULT_APP_LANG));
    }
  } catch {
    /* ignore */
  }

  // 2) Status bar: the App opens on the dark masthead, which wants LIGHT glyphs.
  //    Capacitor's enum is inverted — Style.Dark = light glyphs. After this first
  //    frame, useNativeStatusBar keeps it in sync per route/theme.
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    /* not native / unsupported */
  }

  // 3) Privacy-first analytics — anonymous, no device identifiers (Aptabase).
  //    No-ops until a key is provided via VITE_APTABASE_KEY.
  const aptabaseKey = import.meta.env.VITE_APTABASE_KEY;
  if (aptabaseKey) {
    try {
      const { init, trackEvent } = await import('@aptabase/web');
      init(aptabaseKey);
      void trackEvent('app_opened');
    } catch {
      /* ignore */
    }
  }

  // 4) Configure the tip jar up front so offerings are warm when a card is
  //    tapped. Best-effort: no-ops without a RevenueCat key.
  void configureTipJar();
}

async function hideSplash(): Promise<void> {
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    /* ignore */
  }
}

async function settleWithin<T>(promise: Promise<T>, timeoutMs: number): Promise<T | undefined> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise.catch(() => undefined),
      new Promise<undefined>((resolve) => {
        timeoutId = setTimeout(() => resolve(undefined), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
