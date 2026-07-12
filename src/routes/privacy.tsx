import type { MetaFunction } from 'react-router';
import { BUILD_LANG, canonicalUrl, hreflangLinksForPath } from '../seo/config';
import type { Lang } from '../languages';

// Per-language meta — one build per domain, so BUILD_LANG picks the copy.
const COPY = {
  en: {
    title: 'Privacy Policy | Improv Toolbox',
    description:
      "How Improv Toolbox handles your data: no accounts, anonymous analytics, and in-app tips processed by Apple and Google. We don't sell your data or run ads.",
  },
  pl: {
    title: 'Polityka prywatności | Skrzynka Improwizatora',
    description:
      'Jak Skrzynka Improwizatora obchodzi się z Twoimi danymi: bez kont, anonimowe statystyki i napiwki obsługiwane przez Apple i Google. Nie sprzedajemy danych ani nie wyświetlamy reklam.',
  },
} satisfies Record<Lang, { title: string; description: string }>;

export const meta: MetaFunction = () => {
  const copy = COPY[BUILD_LANG];
  return [
    { title: copy.title },
    { name: 'description', content: copy.description },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl('/privacy') },
    ...hreflangLinksForPath('/privacy'),
    { property: 'og:title', content: copy.title },
    { property: 'og:url', content: canonicalUrl('/privacy') },
    { property: 'og:description', content: copy.description },
    { name: 'twitter:title', content: copy.title },
    { name: 'twitter:description', content: copy.description },
  ];
};

export { PrivacyPage as default } from '../pages/PrivacyPage';
