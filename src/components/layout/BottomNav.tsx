import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { FEATURES } from '../../theme/features';
import { isPrimaryNavItemActive, PRIMARY_NAV_ITEMS } from './toolNavigation';

export function BottomNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="bg-surface border-t-2 border-ink flex z-40 shrink-0 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {PRIMARY_NAV_ITEMS.map((tab) => {
        const theme = FEATURES[tab.id];
        const Icon = theme.Icon;
        const isActive = isPrimaryNavItemActive(tab, location.pathname);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            aria-label={t(tab.labelKey)}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex-1 touch-manipulation flex flex-col items-center justify-center gap-1 pt-2.5 pb-1.5 min-h-[58px] cursor-pointer transition-colors ${
              isActive ? '' : 'text-ink-faint hover:text-ink-muted'
            }`}
          >
            {/* Active marquee tick — a struck bar on the top edge of the live tab. */}
            <span
              aria-hidden
              className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-b-full transition-[width,opacity] duration-200 ease-[var(--ease-out)] ${
                isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
              }`}
              style={{ backgroundColor: theme.accent }}
            />
            <span
              className="grid place-items-center w-12 h-7 rounded-full transition-[background-color] duration-200"
              style={{
                backgroundColor: isActive ? theme.soft : 'transparent',
                color: isActive ? theme.accent : 'inherit',
              }}
            >
              <Icon size={23} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            <span
              className={`text-[11px] leading-none ${isActive ? 'font-extrabold' : 'font-medium'}`}
              style={{ color: isActive ? theme.ink : 'inherit' }}
            >
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
