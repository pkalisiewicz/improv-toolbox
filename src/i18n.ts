import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from './locales/pl/translation.json';
import en from './locales/en/translation.json';
import cs from './locales/cs/translation.json';
import { BUILD_LANG } from './seo/config';
import { IS_NATIVE_BUILD } from './native/platform';
import { resolveInitialLang } from './native/lang';
import { DEFAULT_APP_LANG, type Lang } from './languages';

const RESOURCES = {
  en: { translation: en },
  pl: { translation: pl },
  cs: { translation: cs },
} satisfies Record<Lang, { translation: object }>;

if (IS_NATIVE_BUILD) {
  // App: one multilingual binary. Bundle every supported locale and choose at runtime from
  // the device locale / a remembered choice (docs/adr/0003).
  i18n.use(initReactI18next).init({
    resources: RESOURCES,
    lng: resolveInitialLang(),
    fallbackLng: DEFAULT_APP_LANG,
    interpolation: { escapeValue: false },
  });
} else {
  // Site: one language baked at build time, one build per domain (docs/adr/0001).
  i18n.use(initReactI18next).init({
    resources: { [BUILD_LANG]: RESOURCES[BUILD_LANG] },
    lng: BUILD_LANG,
    fallbackLng: BUILD_LANG,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
