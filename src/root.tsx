import { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useLocation,
  useNavigationType,
  useRouteError,
  type MetaFunction,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import bigShouldersLatinExtUrl from '@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-ext-wght-normal.woff2?url';
import bigShouldersLatinUrl from '@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2?url';
import bricolageLatinExtUrl from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-ext-wght-normal.woff2?url';
import bricolageLatinUrl from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url';
import hankenLatinExtUrl from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-ext-wght-normal.woff2?url';
import hankenLatinUrl from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url';
import './i18n';
import './index.css';
import { BottomNav } from './components/layout/BottomNav';
import { DesktopRail } from './components/layout/DesktopRail';
import { HeaderControls } from './components/layout/HeaderControls';
import { Snake } from './components/icons/Snake';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { IS_NATIVE_BUILD } from './native/platform';
import { useNativeStatusBar } from './native/useNativeStatusBar';
import { TipSheet } from './components/support/TipSheet';
import { THEME_COLORS, THEME_INIT_SCRIPT } from './theme/colorMode';
import { FAVORITE_TOOLS_INIT_SCRIPT } from './theme/favoriteTools';
import { AppErrorPage } from './pages/ErrorPage';
import { BUILD_LANG, CURRENT_SEO, canonicalUrl, hreflangLinks } from './seo/config';

const APP_ICON_VERSION = '2026-06-18';
const VIEWPORT_CONTENT = IS_NATIVE_BUILD
  ? 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
  : 'width=device-width, initial-scale=1.0, viewport-fit=cover';
const CRITICAL_FONT_PRELOADS = [
  bigShouldersLatinUrl,
  bigShouldersLatinExtUrl,
  bricolageLatinUrl,
  bricolageLatinExtUrl,
  hankenLatinUrl,
  hankenLatinExtUrl,
];

// Default per-page meta (title/description/canonical/og/twitter). Routes that
// export their own `meta` (e.g. content Entry pages) override these.
export const meta: MetaFunction = () => [
  { title: CURRENT_SEO.title },
  { name: 'description', content: CURRENT_SEO.description },
  { tagName: 'link', rel: 'canonical', href: canonicalUrl('/') },
  ...hreflangLinks({ en: '/', pl: '/' }),
  { property: 'og:title', content: CURRENT_SEO.ogTitle },
  { property: 'og:url', content: canonicalUrl('/') },
  { property: 'og:description', content: CURRENT_SEO.ogDescription },
  { name: 'twitter:title', content: CURRENT_SEO.ogTitle },
  { name: 'twitter:description', content: CURRENT_SEO.twitterDescription },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const siteOrigin = canonicalUrl('/').replace(/\/$/, '');
  const ogImageUrl = `${siteOrigin}/${CURRENT_SEO.ogImage}`;

  return (
    <html lang={BUILD_LANG} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" sizes="any" href={`/favicon.ico?v=${APP_ICON_VERSION}`} />
        <link rel="icon" type="image/svg+xml" href={`/icon.svg?v=${APP_ICON_VERSION}`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`/pwa-192x192.png?v=${APP_ICON_VERSION}`} />
        <link rel="manifest" href={`/manifest.${BUILD_LANG}.webmanifest`} />
        <meta name="viewport" content={VIEWPORT_CONTENT} />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={THEME_COLORS.light} data-app-theme-color />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: FAVORITE_TOOLS_INIT_SCRIPT }} />

        <meta name="author" content="Przemek K." />
        {CRITICAL_FONT_PRELOADS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}

        {/* Open Graph (global; per-page title/url/description come from route meta) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={CURRENT_SEO.siteName} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:logo" content={`${siteOrigin}/apple-touch-icon.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={CURRENT_SEO.ogImageAlt} />
        <meta property="og:locale" content={CURRENT_SEO.locale} />
        <meta property="og:locale:alternate" content={CURRENT_SEO.alternateLocale} />

        {/* Twitter / X Card (global) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={CURRENT_SEO.twitterImageAlt} />

        {/* PWA / Mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={CURRENT_SEO.appleTitle} />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${APP_ICON_VERSION}`} />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { i18n, t } = useTranslation();
  // The launcher (`/`) renders its own full ink masthead (wordmark + snake + controls),
  // so the global header is suppressed there to avoid a redundant, near-empty bar.
  const isLauncher = useLocation().pathname === '/';

  useEffect(() => {
    document.title = t('app.title');
  }, [i18n.language, t]);

  if (isLauncher) return null;

  return (
    <header className="bg-surface-2 border-b-2 border-ink px-4 pb-2.5 pt-[calc(env(safe-area-inset-top)+0.625rem)] flex items-center justify-between gap-3 sticky top-0 z-40 lg:hidden">
      <Link to="/" className="flex items-center gap-2.5 group min-w-0" aria-label="Home">
        <span className="grid place-items-center w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-brand-50 border-2 border-ink transition-transform duration-150 ease-[var(--ease-out-soft)] group-active:scale-90">
          <Snake size={22} color="var(--color-ink)" eye="var(--color-brand-500)" />
        </span>
        <span className="flex flex-col leading-none min-w-0">
          <span className="font-display font-bold text-ink text-base leading-tight truncate">
            {t('app.title')}
          </span>
          <span className="text-[11px] text-ink-muted italic leading-tight mt-1 truncate">
            <span className="sm:hidden">by Przemek K.</span>
            <span className="hidden sm:inline">created by Przemek K.</span>
          </span>
        </span>
      </Link>
      <HeaderControls tone="ink" />
    </header>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== 'POP') {
      document.querySelector('main')?.scrollTo({ top: 0 });
    }
  }, [pathname, navType]);
  return null;
}

function AppFrame({ children }: { children: React.ReactNode }) {
  useNativeStatusBar();
  return (
    <>
      <ScrollToTop />
      <div className="flex h-dvh bg-transparent overflow-hidden">
        <DesktopRail />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto relative" style={{ scrollbarGutter: 'stable' }}>
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
      {/* Site only — the App uses privacy-first Aptabase (src/native/init.ts). */}
      {/* Analytics = visit/page-view counts; SpeedInsights = Core Web Vitals (page speed). */}
      {!IS_NATIVE_BUILD && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      {/* App only — the global in-app tip jar host. */}
      {IS_NATIVE_BUILD && <TipSheet />}
    </>
  );
}

export default function Root() {
  return (
    <AppFrame>
      <Outlet />
    </AppFrame>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const statusCode = isRouteErrorResponse(error) ? error.status : undefined;
  const variant = statusCode === 404 ? 'not-found' : 'crash';

  return (
    <AppFrame>
      <AppErrorPage variant={variant} statusCode={statusCode} />
    </AppFrame>
  );
}
