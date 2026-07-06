import { useCallback, useEffect, useState } from 'react';
import {
  applyThemePreference,
  getStoredThemePreference,
  resolveThemePreference,
  setStoredThemePreference,
  THEME_CHANGE_EVENT,
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '../theme/colorMode';

interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

function readThemeState(): ThemeState {
  const preference = getStoredThemePreference();
  return {
    preference,
    resolvedTheme: resolveThemePreference(preference),
  };
}

export function useTheme() {
  const [state, setState] = useState<ThemeState>(() => readThemeState());

  useEffect(() => {
    const sync = () => {
      const next = readThemeState();
      applyThemePreference(next.preference);
      setState(next);
    };

    sync();

    const media = window.matchMedia?.(THEME_MEDIA_QUERY);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) sync();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    media?.addEventListener?.('change', sync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, sync);
      media?.removeEventListener?.('change', sync);
    };
  }, []);

  const setPreference = useCallback((preference: ThemePreference) => {
    setStoredThemePreference(preference);
    applyThemePreference(preference);
    setState(readThemeState());
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(state.resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [setPreference, state.resolvedTheme]);

  return {
    ...state,
    setPreference,
    toggleTheme,
  };
}
