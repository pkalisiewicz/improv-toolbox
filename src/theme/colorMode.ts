export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'improv-toolbox-theme';
export const THEME_CHANGE_EVENT = 'improv-toolbox-theme-change';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#f4fbf6',
  dark: '#060c08',
};

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredThemePreference(preference: ThemePreference) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private browsing and locked-down embeds can reject localStorage writes.
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
}

export function resolveThemePreference(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function applyResolvedTheme(theme: ResolvedTheme, preference: ThemePreference = theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"][data-app-theme-color]')
    ?.setAttribute('content', THEME_COLORS[theme]);
}

export function applyThemePreference(preference: ThemePreference) {
  applyResolvedTheme(resolveThemePreference(preference), preference);
}

export const THEME_INIT_SCRIPT = `(function(){var k='${THEME_STORAGE_KEY}',q='${THEME_MEDIA_QUERY}',c=${JSON.stringify(THEME_COLORS)},d=document.documentElement;function m(){return window.matchMedia&&window.matchMedia(q).matches?'dark':'light'}function a(t,p){d.dataset.theme=t;d.dataset.themePreference=p;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;var e=document.querySelector('meta[name="theme-color"][data-app-theme-color]');if(e)e.setAttribute('content',c[t]);}try{var p=localStorage.getItem(k);if(p!=='light'&&p!=='dark'&&p!=='system')p='light';a(p==='system'?m():p,p);}catch(e){a('light','light');}})();`;
