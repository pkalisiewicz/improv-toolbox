import { IS_NATIVE_BUILD } from './platform';

/**
 * Language handling for the native App. Unlike the Site (one language baked per
 * build, switched by domain — see docs/adr/0001), the App carries both locales
 * and chooses at runtime (docs/adr/0003).
 */
export type AppLang = 'en' | 'pl';

// Reuse i18next's conventional key so a value written by either path is read by
// the other. Synchronous storage (localStorage) is what lets i18n.ts seed the
// initial language with zero flash; Capacitor Preferences mirrors it durably.
const LS_KEY = 'i18nextLng';

/**
 * The language to open in, resolved synchronously at i18n init:
 *   1. an explicit prior choice (localStorage), else
 *   2. the device locale — Polish speakers get Polish, everyone else English.
 * Runs during build-time prerender too (Node), where the guards fall through to
 * English; the real device value is read again when the bundle runs on-device.
 */
export function resolveInitialLang(): AppLang {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored === 'en' || stored === 'pl') return stored;
  } catch {
    /* no localStorage (prerender) */
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('pl')) {
      return 'pl';
    }
  } catch {
    /* no navigator (prerender) */
  }
  return 'en';
}

/** Persist the user's choice to both synchronous (localStorage) and durable
 * (Capacitor Preferences) stores. The Preferences write is tree-shaken from the
 * Site build by the IS_NATIVE_BUILD guard. */
export async function persistLang(lang: AppLang): Promise<void> {
  try {
    localStorage.setItem(LS_KEY, lang);
  } catch {
    /* ignore */
  }
  if (!IS_NATIVE_BUILD) return;
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key: LS_KEY, value: lang });
  } catch {
    /* plugin unavailable */
  }
}

/** Read the durable Preferences value (used by the launch reconcile). */
export async function readDurableLang(): Promise<AppLang | null> {
  if (!IS_NATIVE_BUILD) return null;
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: LS_KEY });
    return value === 'en' || value === 'pl' ? value : null;
  } catch {
    return null;
  }
}
