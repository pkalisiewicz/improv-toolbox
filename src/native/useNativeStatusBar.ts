import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { IS_NATIVE_BUILD } from './platform';
import { useTheme } from '../hooks/useTheme';

/**
 * Keeps the native status-bar glyphs legible as the surface beneath them
 * changes. Capacitor's enum is famously inverted: Style.Dark = LIGHT glyphs
 * (for dark backgrounds), Style.Light = DARK glyphs (for light backgrounds).
 *
 *   - Launcher ("/"): always the dark ink masthead -> light glyphs.
 *   - Other routes: the slim header is `surface-2`, which follows the theme ->
 *     dark glyphs in light mode, light glyphs in dark mode.
 *
 * No-op on the Site (the import is dead-code-eliminated there).
 */
export function useNativeStatusBar(): void {
  const { pathname } = useLocation();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!IS_NATIVE_BUILD) return;
    const wantsLightGlyphs = pathname === '/' || resolvedTheme === 'dark';
    let cancelled = false;
    void (async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        if (cancelled) return;
        await StatusBar.setStyle({ style: wantsLightGlyphs ? Style.Dark : Style.Light });
      } catch {
        /* not native / unsupported */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, resolvedTheme]);
}
