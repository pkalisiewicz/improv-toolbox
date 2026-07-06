import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../theme/features';
import { Snake } from '../components/icons/Snake';
import { HeaderControls } from '../components/layout/HeaderControls';
import { IconCoffee } from '../components/icons';
import { SupportCreatorButton } from '../components/support/SupportCreatorButton';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import {
  prioritizeFavoriteTools,
  useFavoriteTools,
  type FavoriteToolName,
} from '../hooks/useFavoriteTools';

/** The directory of tools, in launcher order. */
const TILES: FavoriteToolName[] = [
  'wheel', 'scene', 'warmup', 'facts', 'character', 'prompts', 'suggestions',
  'monologue', 'emotion', 'constraints', 'replay', 'variants', 'spine',
  'formats', 'principles', 'genres', 'timer', 'metronome', 'soundscape',
  'status', 'harold', 'jam', 'deconstruction', 'reflection',
];
const ALPHA = new Set<FavoriteToolName>(['jam', 'metronome']);
const TOOL_GRID_CLASS =
  'grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] lg:gap-3';
const SECTION_TITLE_CLASS =
  'font-display font-bold text-[20px] text-ink leading-none m-0 lg:text-[24px]';

export function SplashPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { favorites, toggleFavorite } = useFavoriteTools();
  const appTitle = t('app.title');
  const mastheadTitleSize = appTitle.length > 16 ? 'text-[42px]' : 'text-[52px]';

  // Tile labels fall back through the existing key namespaces so every tool is named.
  const label = (name: FavoriteToolName) =>
    t(`splash.features.${name}.title`, { defaultValue: t(`more.${name}.title`, { defaultValue: name }) });

  const favoriteLabel = (name: FavoriteToolName) => {
    const toolLabel = label(name);
    const isFavorite = favorites.has(name);
    return t(isFavorite ? 'favorites.remove' : 'favorites.add', {
      tool: toolLabel,
      defaultValue: isFavorite
        ? `Remove ${toolLabel} from favorites`
        : `Add ${toolLabel} to favorites`,
    });
  };

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const shown = useMemo(() => {
    if (!searching) return TILES;

    return prioritizeFavoriteTools(
      TILES.filter((n) => label(n).toLowerCase().includes(q)),
      favorites,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, searching, t, favorites]);
  const removeFavoriteLabel = (name: FavoriteToolName) => t('favorites.remove', {
    tool: label(name),
    defaultValue: `Remove ${label(name)} from favorites`,
  });

  return (
    <div className="mx-auto w-full max-w-md pb-10 lg:min-h-full lg:max-w-6xl lg:px-8 lg:py-8 xl:px-10">

      {/* ── Ink masthead — the bill out front ─────────────────────────────── */}
      <header
        className="bg-ink-fill px-[22px] pt-[calc(env(safe-area-inset-top)+14px)] pb-[22px] rounded-b-[26px] lg:hidden"
      >
        <div className="flex justify-end mb-2 lg:hidden">
          <HeaderControls tone="paper" />
        </div>
        <div className="flex items-end gap-2 lg:block">
          <h1
            className={`font-display font-black ${mastheadTitleSize} leading-[0.88] tracking-[0.01em] text-on-ink m-0 min-w-0 flex-1 break-words [overflow-wrap:anywhere]`}
          >
            {appTitle}
          </h1>
          <Snake
            size={38}
            color="var(--color-brand-500)"
            eye="var(--color-ink-fill)"
            className="mb-1.5 animate-snake-sway lg:mt-4 lg:mb-0 lg:h-16 lg:w-16"
          />
        </div>
        <div className="flex items-center gap-1.5 mt-3.5">
          {[0, 1, 2].map((i) => (
            <span key={i} aria-hidden className="w-[7px] h-[7px] rounded-full bg-brand-500" />
          ))}
          <span className="text-[13px] text-on-ink-muted ml-1.5 leading-tight">{t('splash.tagline')}</span>
        </div>
      </header>

      <div className="min-w-0 lg:pt-0">
        {/* ── Search ─────────────────────────────────────────────────────────── */}
        <div className="px-5 pt-4 lg:px-0 lg:pt-0">
          <div className="flex items-center gap-2.5 bg-surface border-[1.5px] border-line rounded-[13px] px-3.5 py-3 transition-[border-color,box-shadow] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-200">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-ink-faint" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('splash.search')}
              aria-label={t('splash.search')}
              className="flex-1 min-w-0 bg-transparent outline-none text-[14.5px] text-ink placeholder:text-ink-faint"
            />
          </div>
        </div>

          {!searching && (
            <section data-favorite-shelf className="px-5 pt-4 lg:px-0">
              <div className="mb-3 flex items-center gap-2">
                <h2 className={SECTION_TITLE_CLASS}>{t('favorites.title')}</h2>
                <span aria-hidden className="h-0.5 flex-1 rounded-full bg-ink/20" />
              </div>

              <div className={TOOL_GRID_CLASS}>
                {TILES.map((name) => {
                  const Icon = FEATURES[name].Icon;
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
                        className="group relative w-full overflow-hidden text-left flex flex-col justify-between gap-3 min-h-[116px] p-3.5 bg-surface text-ink border-[1.5px] border-ink rounded-[15px] shadow-[var(--shadow-card)] hover:bg-brand-50/80 hover:shadow-[var(--shadow-pop)] active:bg-brand-100/70 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink lg:min-h-[132px] lg:p-4"
                      >
                        {ALPHA.has(name) && (
                          <span className="absolute top-2 left-2 font-display font-bold text-[9px] tracking-[0.12em] uppercase text-brand-700">
                            {t('splash.alpha')}
                          </span>
                        )}
                        <span className="inline-flex w-[38px] h-[38px] items-center justify-center text-ink-muted transition-colors duration-200 ease-[var(--ease-out)] group-hover:text-brand-700 lg:h-11 lg:w-11">
                          <Icon size={30} strokeWidth={2.5} />
                        </span>
                        <span data-testid="tool-title" className="block font-label font-bold text-[15px] leading-tight text-ink break-words [overflow-wrap:anywhere] lg:text-lg">
                          {label(name)}
                        </span>
                      </button>
                      <FavoriteButton
                        data-testid={`favorite-${name}-shelf`}
                        active
                        toolName={name}
                        label={removeFavoriteLabel(name)}
                        onClick={() => toggleFavorite(name)}
                        className="absolute right-1 top-1 z-10"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Tool directory ─────────────────────────────────────────────────── */}
          <div data-favorite-reflow className="px-5 pt-5 lg:px-0">
            {!searching && (
              <div className="mb-3.5">
                <h2 className={SECTION_TITLE_CLASS}>
                  {t('splash.allTools')}
                </h2>
                <span aria-hidden className="block h-0.5 mt-2 rounded-full" style={{ background: 'linear-gradient(90deg, var(--color-brand-500), transparent)' }} />
              </div>
            )}

            {searching && shown.length === 0 ? (
              <p className="text-center text-sm text-ink-muted py-10">{t('splash.noResults')}</p>
            ) : shown.length > 0 ? (
              <div className={TOOL_GRID_CLASS}>
                {shown.map((name) => {
                  const Icon = FEATURES[name].Icon;
                  const isFavorite = favorites.has(name);
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
                        className="group relative w-full overflow-hidden text-left flex flex-col justify-between gap-3 min-h-[116px] p-3.5 bg-surface text-ink border-[1.5px] border-ink rounded-[15px] shadow-[var(--shadow-card)] hover:bg-brand-50/80 hover:shadow-[var(--shadow-pop)] active:bg-brand-100/70 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink lg:min-h-[132px] lg:p-4"
                      >
                        {ALPHA.has(name) && (
                          <span className="absolute top-2 left-2 font-display font-bold text-[9px] tracking-[0.12em] uppercase text-brand-700">
                            {t('splash.alpha')}
                          </span>
                        )}
                        <span className="inline-flex w-[38px] h-[38px] items-center justify-center text-ink-muted transition-colors duration-200 ease-[var(--ease-out)] group-hover:text-brand-700 lg:h-11 lg:w-11">
                          <Icon size={30} strokeWidth={2.5} />
                        </span>
                        <span data-testid="tool-title" className="block font-label font-bold text-[15px] leading-tight text-ink break-words [overflow-wrap:anywhere] lg:text-lg">
                          {label(name)}
                        </span>
                      </button>
                      <FavoriteButton
                        data-testid={isFavorite ? `favorite-${name}-all-tools` : `favorite-${name}`}
                        active={isFavorite}
                        toolName={name}
                        label={favoriteLabel(name)}
                        onClick={() => toggleFavorite(name)}
                        className="absolute top-2 right-2 z-10"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* ── Buy me a coffee ────────────────────────────────────────────────── */}
          {!searching && (
            <div data-favorite-reflow className="px-5 pt-5 lg:px-0">
              <SupportCreatorButton
                ariaLabel={t('more.coffee.cta')}
                className="flex w-full items-center gap-3 p-4 rounded-[15px] border-[1.5px] border-ink bg-brand-50 hover:bg-brand-100 transition-colors active:scale-[0.99] cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink lg:gap-4 lg:p-5"
              >
                <span className="grid place-items-center w-10 h-10 shrink-0 rounded-[11px] bg-brand-500 text-ink lg:h-12 lg:w-12">
                  <IconCoffee size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-label font-bold text-ink text-sm lg:text-lg">{t('more.coffee.title')}</span>
                  <span className="block text-xs text-ink-muted mt-0.5 leading-snug lg:text-base">{t('more.coffee.desc')}</span>
                </span>
                <span className="text-xs font-bold text-ink bg-surface border-[1.5px] border-ink px-2.5 py-1 rounded-[var(--radius-sm)] shrink-0 lg:px-3 lg:py-1.5 lg:text-sm">
                  {t('more.coffee.cta')}
                </span>
              </SupportCreatorButton>

              <p className="text-center text-xs text-ink-muted pt-5">{t('splash.credit')}</p>
            </div>
          )}
      </div>
    </div>
  );
}
