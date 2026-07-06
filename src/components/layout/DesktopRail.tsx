import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../../theme/features';
import { Snake } from '../icons/Snake';
import { HeaderControls } from './HeaderControls';
import {
  isPrimaryNavItemActive,
  PRIMARY_NAV_ITEMS,
} from './toolNavigation';

export function DesktopRail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const appTitle = t('app.title');

  return (
    <aside className="hidden w-[20rem] shrink-0 flex-col border-r-2 border-ink bg-surface lg:flex xl:w-[20.5rem] 2xl:w-[21rem]">
      <header className="h-[12.25rem] border-b-2 border-ink px-5 py-5">
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label="Home"
          >
            <span className="grid h-13 w-13 shrink-0 place-items-center rounded-[var(--radius-md)] border-2 border-ink bg-brand-50 transition-transform duration-150 ease-[var(--ease-out)] group-active:scale-95">
              <Snake size={28} color="var(--color-ink)" eye="var(--color-brand-500)" />
            </span>
            <span className="flex h-[6.05rem] min-w-0 flex-col justify-center">
              <span className="block font-display text-[2.05rem] font-extrabold leading-[1.02] text-ink break-words [overflow-wrap:anywhere] xl:text-[2.15rem]">
                {appTitle}
              </span>
              <span className="mt-1.5 block text-sm italic leading-tight text-ink-muted break-words [overflow-wrap:anywhere]">
                created by Przemek K.
              </span>
            </span>
          </Link>
          <div className="flex justify-start">
            <HeaderControls tone="ink" />
          </div>
        </div>
      </header>

      <nav aria-label={t('app.title')} className="px-3 py-4">
        <div className="grid gap-1.5">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const theme = FEATURES[item.id];
            const Icon = theme.Icon;
            const active = isPrimaryNavItemActive(item, pathname);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`group flex min-h-13 w-full items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2 text-left text-base font-extrabold transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface xl:text-lg ${
                  active
                    ? 'bg-brand-500 text-ink'
                    : 'text-ink-muted hover:bg-brand-50 hover:text-ink active:scale-[0.99]'
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] transition-colors ${
                    active ? 'bg-ink-fill text-brand-500' : 'bg-surface-3 text-ink-muted group-hover:text-brand-700'
                  }`}
                  style={active ? { ['--icon-accent' as string]: 'var(--color-on-ink)' } : undefined}
                >
                  <Icon size={21} strokeWidth={active ? 2.6 : 2.2} />
                </span>
                <span className="min-w-0 leading-tight break-words [overflow-wrap:anywhere]">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </aside>
  );
}
