import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMoreSubPath } from './moreNav';
import { IconArrowLeft } from '../icons';

/**
 * In-frame "back to More" affordance. Renders only on the 21 More sub-pages
 * (recognition over recall: the BottomNav "More" tab stays lit on a sub-page,
 * but gives no way back). A quiet outline pill — subordinate to the page title
 * it sits above. Returns null everywhere else, so it's safe to mount globally.
 */
export function BackToMore({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!isMoreSubPath(pathname)) return null;

  return (
    <button
      type="button"
      onClick={() => navigate('/more')}
      className={`inline-flex items-center gap-1.5 h-9 pl-2 pr-3.5 rounded-full border-2 border-line text-sm font-bold text-ink-muted bg-surface cursor-pointer transition-[color,border-color,transform] duration-150 ease-[var(--ease-out)] hover:border-ink hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 ${className}`}
    >
      <IconArrowLeft size={17} />
      {t('nav.more')}
    </button>
  );
}
