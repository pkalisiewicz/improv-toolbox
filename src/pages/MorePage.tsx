import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { FEATURES } from '../theme/features';
import { IconCoffee } from '../components/icons';
import { SupportCreatorButton } from '../components/support/SupportCreatorButton';
import {
  useFavoriteTools,
  type FavoriteToolName,
} from '../hooks/useFavoriteTools';

interface HubItem {
  name: FavoriteToolName;
  badge?: string;
}

const ITEMS: HubItem[] = [
  { name: 'timer' },
  { name: 'character' },
  { name: 'prompts' },
  { name: 'suggestions' },
  { name: 'formats' },
  { name: 'reflection' },
  { name: 'soundscape' },
  { name: 'status' },
  { name: 'spine' },
  { name: 'jam', badge: 'Alpha' },
  { name: 'principles' },
  { name: 'monologue' },
  { name: 'genres' },
  { name: 'harold' },
  { name: 'emotion' },
  { name: 'constraints' },
  { name: 'metronome', badge: 'Alpha' },
  { name: 'variants' },
  { name: 'replay' },
  { name: 'deconstruction' },
];

const TOOL_GRID_CLASS = 'grid grid-cols-2 gap-3 lg:gap-4';

export function MorePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavoriteTools();
  const regularItems = ITEMS;

  return (
    <PageContainer feature="more">
      <div>
        <PageHeader feature="more" title={t('more.title')} subtitle={t('more.subtitle')} />

        <div className="space-y-5">
            <section data-favorite-shelf>
                <div className="mb-2.5 flex items-center gap-2">
                  <h2 className="font-label text-sm font-extrabold text-ink leading-none lg:text-base">{t('favorites.title')}</h2>
                  <span aria-hidden className="h-0.5 flex-1 rounded-full bg-ink/20" />
                </div>

                <div className={TOOL_GRID_CLASS}>
                  {ITEMS.map(({ name }) => {
                    const Icon = FEATURES[name].Icon;
                    const title = t(`more.${name}.title`);
                    const favoriteLabel = t('favorites.remove', {
                      tool: title,
                      defaultValue: `Remove ${title} from favorites`,
                    });

                    return (
                      <div
                        key={name}
                        data-favorite-card={name}
                        data-tool-card={name}
                        data-tool-card-instance={`favorite:${name}`}
                        data-tool-card-zone="favorite"
                        className="relative"
                      >
                        <button
                          data-tool-name={name}
                          onClick={() => navigate(`/${name}`)}
                          className="group w-full min-h-[142px] text-left p-3.5 rounded-[var(--radius-lg)] bg-surface border border-line shadow-[var(--shadow-card)] hover:bg-brand-50/80 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(16,34,26,0.06),0_8px_18px_-10px_rgba(16,34,26,0.22)] active:bg-brand-100/70 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 lg:min-h-[176px] lg:p-5"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <span className="grid place-items-center w-10 h-10 rounded-[var(--radius-md)] bg-brand-50 text-brand-600 transition-[background-color,color] duration-200 ease-[var(--ease-out)] group-hover:bg-brand-100 group-hover:text-brand-700 lg:h-13 lg:w-13">
                              <Icon size={24} />
                            </span>
                          </div>
                          <div data-testid="tool-title" className="font-label font-extrabold text-ink text-sm leading-tight break-words [overflow-wrap:anywhere] lg:text-[1.35rem]">
                            {title}
                          </div>
                          <div className="text-xs text-ink-muted mt-1 leading-snug text-pretty break-words [overflow-wrap:anywhere] lg:mt-2 lg:text-base">
                            {t(`more.${name}.desc`)}
                          </div>
                        </button>
                        <FavoriteButton
                          data-testid={`favorite-${name}-shelf`}
                          active
                          toolName={name}
                          label={favoriteLabel}
                          onClick={() => toggleFavorite(name)}
                          className="absolute top-1.5 right-1.5 z-10"
                        />
                      </div>
                    );
                  })}
                </div>
              </section>

            <section data-favorite-reflow>
              <div data-favorite-shelf className="mb-2.5 flex items-center gap-2">
                <h2 className="font-label text-sm font-extrabold text-ink leading-none lg:text-base">{t('more.allTools')}</h2>
                <span aria-hidden className="h-0.5 flex-1 rounded-full bg-ink/20" />
              </div>

              <div className={TOOL_GRID_CLASS}>
                {regularItems.map(({ name, badge }) => {
                  const Icon = FEATURES[name].Icon;
                  const title = t(`more.${name}.title`);
                  const isFavorite = favorites.has(name);
                  const favoriteLabel = t(isFavorite ? 'favorites.remove' : 'favorites.add', {
                    tool: title,
                    defaultValue: isFavorite
                      ? `Remove ${title} from favorites`
                      : `Add ${title} to favorites`,
                  });

                  return (
                    <div
                      key={name}
                      data-tool-card={name}
                      data-tool-card-instance={`all:${name}`}
                      data-tool-card-zone="all"
                      className="relative"
                    >
                      <button
                        data-tool-name={name}
                        onClick={() => navigate(`/${name}`)}
                        className="group w-full min-h-[142px] text-left p-3.5 rounded-[var(--radius-lg)] bg-surface border border-line shadow-[var(--shadow-card)] hover:bg-brand-50/80 hover:border-brand-200 hover:shadow-[0_1px_2px_rgba(16,34,26,0.06),0_8px_18px_-10px_rgba(16,34,26,0.22)] active:bg-brand-100/70 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 lg:min-h-[176px] lg:p-5"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <span className="grid place-items-center w-10 h-10 rounded-[var(--radius-md)] bg-brand-50 text-brand-600 transition-[background-color,color] duration-200 ease-[var(--ease-out)] group-hover:bg-brand-100 group-hover:text-brand-700 lg:h-13 lg:w-13">
                            <Icon size={24} />
                          </span>
                          {badge && (
                            <Badge color="feature" className="text-[9px] uppercase tracking-wide px-1.5 py-0.5">
                              {badge}
                            </Badge>
                          )}
                        </div>
                        <div data-testid="tool-title" className="font-label font-extrabold text-ink text-sm leading-tight break-words [overflow-wrap:anywhere] lg:text-[1.35rem]">
                          {title}
                        </div>
                        <div className="text-xs text-ink-muted mt-1 leading-snug text-pretty break-words [overflow-wrap:anywhere] lg:mt-2 lg:text-base">
                          {t(`more.${name}.desc`)}
                        </div>
                      </button>
                      <FavoriteButton
                        data-testid={isFavorite ? `favorite-${name}-all-tools` : `favorite-${name}`}
                        active={isFavorite}
                        toolName={name}
                        label={favoriteLabel}
                        onClick={() => toggleFavorite(name)}
                        className="absolute top-1.5 right-1.5 z-10"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
        </div>

        {/* Support the creator — external tip link on web, in-app tip jar on native. */}
        <SupportCreatorButton
          favoriteReflow
          ariaLabel={t('more.coffee.cta')}
          className="mt-3 flex w-full items-center gap-3 p-4 rounded-[var(--radius-lg)] border border-brand-200 bg-brand-50 hover:bg-brand-100 transition-colors active:scale-[0.99] cursor-pointer text-left lg:mt-6 lg:gap-5 lg:p-6"
        >
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-brand-100 text-brand-700 lg:h-14 lg:w-14">
            <IconCoffee size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-ink text-sm lg:text-xl">{t('more.coffee.title')}</div>
            <div className="text-xs text-ink-muted mt-0.5 leading-snug lg:text-lg">{t('more.coffee.desc')}</div>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-[var(--radius-sm)] shrink-0 lg:px-4 lg:py-2 lg:text-base">
            {t('more.coffee.cta')}
          </span>
        </SupportCreatorButton>

        <nav className="mt-8 flex items-center justify-center gap-5 lg:mt-10" aria-label={t('more.secondaryNav')}>
          <Link
            to="/contact"
            className="text-xs font-semibold text-ink-faint underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink-muted hover:decoration-ink/40 lg:text-sm"
          >
            {t('more.legal.contact')}
          </Link>
          <Link
            to="/privacy"
            className="text-xs font-semibold text-ink-faint underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink-muted hover:decoration-ink/40 lg:text-sm"
          >
            {t('more.legal.privacy')}
          </Link>
        </nav>
      </div>
    </PageContainer>
  );
}
