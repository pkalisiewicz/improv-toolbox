export const SUPPORTED_LANGS = ['en', 'pl'] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_APP_LANG: Lang = 'en';
export const DEFAULT_SITE_LANG: Lang = 'pl';

export const LANG_META: Record<Lang, { flag: string; name: string; short: string; locale: string }> = {
  en: { flag: '🇬🇧', name: 'English', short: 'EN', locale: 'en_US' },
  pl: { flag: '🇵🇱', name: 'Polski', short: 'PL', locale: 'pl_PL' },
};

export function isSupportedLang(value: unknown): value is Lang {
  return typeof value === 'string' && SUPPORTED_LANGS.includes(value as Lang);
}

export function resolveSupportedLang(value: unknown, fallback: Lang): Lang {
  return isSupportedLang(value) ? value : fallback;
}

export function resolveSupportedLanguageTag(value: string | null | undefined): Lang | null {
  const baseLang = value?.toLowerCase().split('-')[0];
  return isSupportedLang(baseLang) ? baseLang : null;
}

export function nextSupportedLang(lang: Lang): Lang {
  const currentIndex = SUPPORTED_LANGS.indexOf(lang);
  return SUPPORTED_LANGS[(currentIndex + 1) % SUPPORTED_LANGS.length];
}
