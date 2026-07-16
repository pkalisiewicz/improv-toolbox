import type { MetaFunction } from 'react-router';
import { BUILD_LANG, canonicalUrl, hreflangLinksForPath } from '../seo/config';
import type { Lang } from '../languages';

const COPY = {
  en: {
    title: 'Contact | Improv Toolbox',
    description: 'Send feedback, report a problem, or suggest a new improv tool for Improv Toolbox.',
  },
  pl: {
    title: 'Kontakt | Skrzynka Improwizatora',
    description: 'Prześlij opinię, zgłoś problem lub zaproponuj nowe narzędzie do Skrzynki Improwizatora.',
  },
} satisfies Record<Lang, { title: string; description: string }>;

export const meta: MetaFunction = () => {
  const copy = COPY[BUILD_LANG];
  return [
    { title: copy.title },
    { name: 'description', content: copy.description },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl('/contact') },
    ...hreflangLinksForPath('/contact'),
    { property: 'og:title', content: copy.title },
    { property: 'og:url', content: canonicalUrl('/contact') },
    { property: 'og:description', content: copy.description },
    { name: 'twitter:title', content: copy.title },
    { name: 'twitter:description', content: copy.description },
  ];
};

export { ContactPage as default } from '../pages/ContactPage';
