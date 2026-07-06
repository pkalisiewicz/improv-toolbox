// Each language is a monolingual build deployed to its own domain.
export const SITE_ORIGINS = {
  en: 'https://www.improv-toolbox.com',
  pl: 'https://www.skrzynka-improwizatora.pl',
} as const;

export type Lang = keyof typeof SITE_ORIGINS;

const BUILD_LANG_VALUE = import.meta.env.VITE_BUILD_LANG;

// The language this build is prerendered/baked for. Set via VITE_BUILD_LANG at
// build time (one build per domain); defaults to Polish. Vite statically
// replaces import.meta.env.VITE_BUILD_LANG, so this is a compile-time constant.
export const BUILD_LANG: Lang =
  BUILD_LANG_VALUE === 'en' || BUILD_LANG_VALUE === 'pl' ? BUILD_LANG_VALUE : 'pl';

export const SEO = {
  en: {
    siteName: 'Improv Toolbox',
    appTitle: 'Improv Toolbox',
    appleTitle: 'Improv Toolbox',
    title: 'Improv Toolbox - Free App for Improvisers | Archetype Wheel, Scene Generator & 60+ Warmups',
    description:
      'Improv Toolbox is a free web app for improvisers. Spin the archetype wheel, generate scene prompts, explore 60+ warmup games, build characters, browse the improv glossary & more - works offline.',
    ogTitle: 'Improv Toolbox - Free App for Improvisers',
    ogDescription:
      'Your all-in-one improv toolkit: archetype wheel, scene generator, 60+ warmup games, character builder, improv glossary, Harold guide & more - free, mobile-friendly, works offline.',
    ogImage: 'og-image.png',
    ogImageAlt:
      'Improv Toolbox - free improv app: archetype wheel, scene generator, warmup games and 20+ more tools',
    twitterDescription:
      'Free improv toolkit: archetype wheel, scene generator, 60+ warmup games, character builder, improv glossary & more. Works offline on mobile.',
    twitterImageAlt: 'Improv Toolbox - free improv app screenshot',
    locale: 'en_US',
    alternateLocale: 'pl_PL',
  },
  pl: {
    siteName: 'Skrzynka Improwizatora',
    appTitle: 'Skrzynka Improwizatora',
    appleTitle: 'Skrzynka Impro',
    title:
      'Skrzynka Improwizatora - bezpłatna aplikacja dla improwizatorów | Koło archetypów, generator scen i 60+ rozgrzewek',
    description:
      'Skrzynka Improwizatora to bezpłatna aplikacja dla improwizatorów: koło archetypów, generator scen, 60+ gier rozgrzewkowych, kreator postaci, słownik impro i więcej. Działa offline.',
    ogTitle: 'Skrzynka Improwizatora - bezpłatna aplikacja dla improwizatorów',
    ogDescription:
      'Kompletny zestaw narzędzi dla improwizatorów: koło archetypów, generator scen, 60+ rozgrzewek, kreator postaci, słownik impro, przewodnik po Haroldzie i więcej. Bezpłatna, mobilna, działa offline.',
    ogImage: 'og-image-pl.png',
    ogImageAlt:
      'Skrzynka Improwizatora - bezpłatna aplikacja dla improwizatorów: koło archetypów, generator scen, rozgrzewki i 20+ narzędzi',
    twitterDescription:
      'Bezpłatna aplikacja dla improwizatorów: koło archetypów, generator scen, 60+ rozgrzewek, kreator postaci i słownik impro. Działa offline.',
    twitterImageAlt: 'Skrzynka Improwizatora - zrzut ekranu bezpłatnej aplikacji dla improwizatorów',
    locale: 'pl_PL',
    alternateLocale: 'en_US',
  },
} as const;

export const CURRENT_SEO = SEO[BUILD_LANG];

export function origin(lang: Lang): string {
  return SITE_ORIGINS[lang];
}

export function canonicalUrl(path = '/', lang: Lang = BUILD_LANG): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return SITE_ORIGINS[lang] + normalizedPath;
}

/**
 * hreflang alternate links for a page that exists in both languages.
 * `paths` holds the per-language absolute path (they can differ once PL slugs
 * are localized). x-default points at the English page.
 */
export function hreflangLinks(paths: Record<Lang, string>) {
  return [
    { tagName: 'link' as const, rel: 'alternate', hrefLang: 'en', href: SITE_ORIGINS.en + paths.en },
    { tagName: 'link' as const, rel: 'alternate', hrefLang: 'pl', href: SITE_ORIGINS.pl + paths.pl },
    { tagName: 'link' as const, rel: 'alternate', hrefLang: 'x-default', href: SITE_ORIGINS.en + paths.en },
  ];
}
