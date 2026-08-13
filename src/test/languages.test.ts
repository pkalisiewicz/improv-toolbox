import { describe, expect, it } from 'vitest';
import {
  SITE_LANGS,
  SUPPORTED_LANGS,
  isSiteLang,
  nextSupportedLang,
  resolveSupportedLanguageTag,
} from '../languages';

describe('language configuration', () => {
  it('supports Czech in the native app without exposing it as a site domain', () => {
    expect(SUPPORTED_LANGS).toEqual(['en', 'pl', 'cs']);
    expect(SITE_LANGS).toEqual(['en', 'pl']);
    expect(isSiteLang('cs')).toBe(false);
  });

  it('resolves Czech device locales', () => {
    expect(resolveSupportedLanguageTag('cs-CZ')).toBe('cs');
    expect(resolveSupportedLanguageTag('CS')).toBe('cs');
  });

  it('cycles through all native app languages', () => {
    expect(nextSupportedLang('en')).toBe('pl');
    expect(nextSupportedLang('pl')).toBe('cs');
    expect(nextSupportedLang('cs')).toBe('en');
  });
});
