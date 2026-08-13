import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useTheme } from '../../hooks/useTheme';
import { IconChevronDown, IconDownload, IconGlobe, IconMail, IconMoon, IconSun } from '../icons';
import { PWAInstallModal } from '../ui/PWAInstallBanner';
import { BUILD_LANG, origin } from '../../seo/config';
import { IS_NATIVE_BUILD } from '../../native/platform';
import { persistLang } from '../../native/lang';
import {
  LANG_META,
  SITE_LANGS,
  SUPPORTED_LANGS,
  isSiteLang,
  nextSupportedLang,
  resolveSupportedLang,
  type Lang,
} from '../../languages';

interface HeaderControlsProps {
  /** `ink` = controls on app surfaces; `paper` = controls on the dark masthead. */
  tone?: 'ink' | 'paper';
  /** Mobile app header only: one-tap access to the contact screen. */
  contactShortcut?: boolean;
}

/**
 * The always-reachable app controls: language selector + theme + (when
 * available) install. Shared by the global header and the launcher's ink
 * masthead so the install / iOS-instructions logic lives in exactly one place.
 */
export function HeaderControls({ tone = 'ink', contactShortcut = false }: HeaderControlsProps) {
  const { t, i18n } = useTranslation();
  const { installPrompt, isInstalled, isIOS, install } = usePWAInstall();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const setLang = (lng: Lang) => {
    if (IS_NATIVE_BUILD) {
      // App: switch at runtime and remember it — there is no other domain to
      // navigate to, and a cross-domain hop would eject the user to a browser.
      if (i18n.language === lng) return;
      void i18n.changeLanguage(lng);
      void persistLang(lng);
      return;
    }
    // Site: each language lives on its own domain; switch by navigating there.
    if (lng === BUILD_LANG || !isSiteLang(lng)) return;
    const path =
      typeof window === 'undefined'
        ? '/'
        : `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(`${origin(lng)}${path}`);
  };

  // Which segment reads as active: the live i18n language in the App, the baked
  // language on the Site.
  const activeLang: string = IS_NATIVE_BUILD ? i18n.language : BUILD_LANG;
  const currentLang = resolveSupportedLang(activeLang, BUILD_LANG);
  const availableLangs: readonly Lang[] = IS_NATIVE_BUILD ? SUPPORTED_LANGS : SITE_LANGS;
  const nextLang = nextSupportedLang(currentLang, availableLangs);

  const showInstallButton = !isInstalled && (isIOS || !!installPrompt);
  const handleInstallClick = () => (isIOS ? setShowIOSModal(true) : install());
  const useOneTapLanguage = availableLangs.length === 2 && (IS_NATIVE_BUILD || isIOS);
  const ThemeIcon = resolvedTheme === 'dark' ? IconSun : IconMoon;
  const themeLabel = t(resolvedTheme === 'dark' ? 'theme.switchToLight' : 'theme.switchToDark');

  const onPaper = tone === 'paper';
  const ring = onPaper ? 'focus-visible:ring-[var(--color-on-ink)]' : 'focus-visible:ring-brand-500';
  const ringOffset = onPaper
    ? 'focus-visible:ring-offset-[var(--color-ink-fill)]'
    : 'focus-visible:ring-offset-[var(--color-surface-2)]';
  // Header icon buttons (install + theme).
  const iconCtrl = onPaper
    ? 'border-[var(--color-on-ink)]/35 text-[var(--color-on-ink)] bg-white/10 hover:bg-white/20'
    : 'border-ink text-ink bg-surface hover:bg-surface-3';
  const selectCtrl = onPaper
    ? 'border-[var(--color-on-ink)]/35 text-[var(--color-on-ink)] bg-white/10 hover:bg-white/20'
    : 'border-ink text-ink bg-surface hover:bg-surface-3';
  const chevron = onPaper ? 'text-[var(--color-on-ink)]/80' : 'text-ink-muted';

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        {contactShortcut && (
          <NavLink
            to="/contact"
            aria-label={t('contact.quickAction')}
            title={t('contact.quickAction')}
            className={({ isActive }) => `grid h-11 w-11 place-items-center rounded-[var(--radius-md)] border-2 active:scale-95 transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${ring} ${ringOffset} ${
              isActive ? 'border-ink bg-brand-500 text-ink' : iconCtrl
            }`}
          >
            <IconMail size={19} />
          </NavLink>
        )}

        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            aria-label={t('install.button')}
            className={`grid place-items-center w-11 h-11 rounded-[var(--radius-md)] border-2 ${iconCtrl} active:scale-95 transition-[background-color,transform] duration-150 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${ring} ${ringOffset}`}
          >
            <IconDownload size={19} />
          </button>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
          className={`grid place-items-center w-11 h-11 rounded-[var(--radius-md)] border-2 ${iconCtrl} active:scale-95 transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${ring} ${ringOffset}`}
        >
          <ThemeIcon size={19} />
        </button>

        {useOneTapLanguage ? (
          <button
            type="button"
            onClick={() => setLang(nextLang)}
            aria-label={`${t('app.chooseLanguage')}: ${LANG_META[nextLang].name}`}
            title={`${t('app.chooseLanguage')}: ${LANG_META[nextLang].name}`}
            className={`inline-flex h-11 min-w-[76px] touch-manipulation items-center justify-center gap-1.5 rounded-[var(--radius-md)] border-2 px-3 text-sm font-bold cursor-pointer transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${selectCtrl} ${ring} ${ringOffset}`}
          >
            <IconGlobe size={16} />
            <span>{LANG_META[nextLang].short}</span>
          </button>
        ) : (
          <label className="relative block shrink-0">
            <span className="sr-only">{t('app.chooseLanguage')}</span>
            <select
              value={currentLang}
              onChange={(event) => setLang(event.target.value as Lang)}
              aria-label={t('app.chooseLanguage')}
              className={`h-11 min-w-[88px] appearance-none rounded-[var(--radius-md)] border-2 py-0 pl-3 pr-8 text-sm font-bold cursor-pointer transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${selectCtrl} ${ring} ${ringOffset}`}
            >
              {availableLangs.map((lng) => (
                <option key={lng} value={lng}>
                  {LANG_META[lng].flag} {LANG_META[lng].short} · {LANG_META[lng].name}
                </option>
              ))}
            </select>
            <IconChevronDown
              size={16}
              aria-hidden="true"
              className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${chevron}`}
            />
          </label>
        )}
      </div>
      {showIOSModal && <PWAInstallModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}
