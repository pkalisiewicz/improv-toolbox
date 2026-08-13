import { describe, expect, it } from 'vitest';
import en from '../locales/en/translation.json';
import pl from '../locales/pl/translation.json';
import cs from '../locales/cs/translation.json';

type FlatLocale = Record<string, unknown>;

function flatten(value: object, prefix = '', result: FlatLocale = {}): FlatLocale {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object') {
      flatten(child, path, result);
    } else {
      result[path] = child;
    }
  }
  return result;
}

function interpolationVariables(value: FlatLocale[string]): string[] {
  return [...String(value).matchAll(/{{\s*([^}]+?)\s*}}/g)]
    .map((match) => match[1])
    .sort();
}

const locales = { en: flatten(en), pl: flatten(pl), cs: flatten(cs) };

describe('translation locales', () => {
  for (const [language, locale] of Object.entries(locales)) {
    it(`${language} has the same keys and interpolation variables as English`, () => {
      expect(Object.keys(locale).sort()).toEqual(Object.keys(locales.en).sort());

      const interpolationMismatches = Object.entries(locales.en)
        .filter(([key, sourceValue]) =>
          interpolationVariables(locale[key]).join('|') !== interpolationVariables(sourceValue).join('|'))
        .map(([key]) => key);
      const lineBreakMismatches = Object.entries(locales.en)
        .filter(([key, sourceValue]) =>
          String(locale[key]).split('\n').length !== String(sourceValue).split('\n').length)
        .map(([key]) => key);

      expect(interpolationMismatches).toEqual([]);
      expect(lineBreakMismatches).toEqual([]);
    });
  }

  it('does not contain invisible zero-width characters', () => {
    const invalidEntries = Object.entries(locales).flatMap(([language, locale]) =>
      Object.entries(locale)
        .filter(([, value]) => /[\u200B-\u200D\uFEFF]/.test(String(value)))
        .map(([key]) => `${language}:${key}`),
    );

    expect(invalidEntries).toEqual([]);
  });
});
