import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from './locales/pl/translation.json';
import en from './locales/en/translation.json';
import { BUILD_LANG } from './seo/config';
import { IS_NATIVE_BUILD } from './native/platform';
import { resolveInitialLang } from './native/lang';

if (IS_NATIVE_BUILD) {
  // App: one bilingual binary. Bundle BOTH locales and choose at runtime from
  // the device locale / a remembered choice (docs/adr/0003).
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    lng: resolveInitialLang(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
} else {
  // Site: one language baked at build time, one build per domain (docs/adr/0001).
  // The unused locale is tree-shaken because BUILD_LANG folds to a literal.
  i18n.use(initReactI18next).init({
    resources: BUILD_LANG === 'en' ? { en: { translation: en } } : { pl: { translation: pl } },
    lng: BUILD_LANG,
    fallbackLng: BUILD_LANG,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
