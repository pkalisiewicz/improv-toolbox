export const SUPPORTED_LANGS = ['en', 'pl', 'cs'] as const;
export const SITE_LANGS = ['en', 'pl'] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];
export type SiteLang = (typeof SITE_LANGS)[number];

export const DEFAULT_APP_LANG = 'en' satisfies Lang;
export const DEFAULT_SITE_LANG = 'pl' satisfies SiteLang;

export const LANG_META: Record<Lang, { flag: string; name: string; short: string; locale: string }> = {
  en: { flag: '🇬🇧', name: 'English', short: 'EN', locale: 'en_US' },
  pl: { flag: '🇵🇱', name: 'Polski', short: 'PL', locale: 'pl_PL' },
  cs: { flag: '🇨🇿', name: 'Čeština', short: 'CS', locale: 'cs_CZ' },
};

export function isSupportedLang(value: unknown): value is Lang {
  return typeof value === 'string' && SUPPORTED_LANGS.includes(value as Lang);
}

export function isSiteLang(value: unknown): value is SiteLang {
  return typeof value === 'string' && SITE_LANGS.includes(value as SiteLang);
}

export function resolveSupportedLang(value: unknown, fallback: Lang): Lang {
  return isSupportedLang(value) ? value : fallback;
}

export function resolveSupportedLanguageTag(value: string | null | undefined): Lang | null {
  const baseLang = value?.toLowerCase().split('-')[0];
  return isSupportedLang(baseLang) ? baseLang : null;
}

export function nextSupportedLang(lang: Lang, availableLangs: readonly Lang[] = SUPPORTED_LANGS): Lang {
  const currentIndex = availableLangs.indexOf(lang);
  return availableLangs[(currentIndex + 1) % availableLangs.length];
}
