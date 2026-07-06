import { useTranslation } from 'react-i18next';
import { useWarmup } from '../hooks/useWarmup';
import { WARMUP_GAMES } from '../data/warmups';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { IconShuffle, IconUsers, IconTimer } from '../components/icons';
import type { WarmupCategory, WarmupLevel } from '../types';

type PlayerFilter = 'any' | '2+' | '4+' | '6+';

const PLAYER_FILTERS: { value: PlayerFilter; label: string }[] = [
  { value: 'any', label: 'warmups.allPlayers' },
  { value: '2+',  label: '2+' },
  { value: '4+',  label: '4+' },
  { value: '6+',  label: '6+' },
];

const CATEGORIES: Array<{ value: WarmupCategory | 'all'; labelKey: string }> = [
  { value: 'all',          labelKey: 'warmups.allCategories' },
  { value: 'physical',     labelKey: 'warmups.categories.physical' },
  { value: 'vocal',        labelKey: 'warmups.categories.vocal' },
  { value: 'focus',        labelKey: 'warmups.categories.focus' },
  { value: 'ensemble',     labelKey: 'warmups.categories.ensemble' },
  { value: 'storytelling', labelKey: 'warmups.categories.storytelling' },
  { value: 'character',    labelKey: 'warmups.categories.character' },
];

const LEVELS: Array<{ value: WarmupLevel | 'all'; labelKey: string }> = [
  { value: 'all',          labelKey: 'warmups.allLevels' },
  { value: 'beginner',     labelKey: 'warmups.levels.beginner' },
  { value: 'intermediate', labelKey: 'warmups.levels.intermediate' },
  { value: 'advanced',     labelKey: 'warmups.levels.advanced' },
];

const LEVEL_BADGE_CONFIG: Record<WarmupLevel, { color: 'green' | 'amber' | 'purple' }> = {
  beginner:     { color: 'green' },
  intermediate: { color: 'amber' },
  advanced:     { color: 'purple' },
};

const CATEGORY_BADGE_COLORS: Record<string, 'amber' | 'green' | 'blue' | 'purple' | 'red' | 'gray' | 'pink' | 'cyan'> = {
  physical: 'blue',
  vocal: 'purple',
  focus: 'amber',
  ensemble: 'green',
  storytelling: 'pink',
  character: 'cyan',
};

export function WarmupPage() {
  const { t } = useTranslation();
  const {
    playerFilter,
    categoryFilter,
    levelFilter,
    currentGame,
    filtered,
    pickRandom,
    setPlayerFilter,
    setCategoryFilter,
    setLevelFilter,
  } = useWarmup();

  const playersLabel = currentGame.maxPlayers === null
    ? t('warmups.players_min', { min: currentGame.minPlayers })
    : currentGame.maxPlayers === currentGame.minPlayers
    ? `${currentGame.minPlayers}`
    : t('warmups.players_range', { min: currentGame.minPlayers, max: currentGame.maxPlayers });

  const levelConfig = LEVEL_BADGE_CONFIG[currentGame.level];

  return (
    <PageContainer feature="warmup">
      <div>
        <PageHeader feature="warmup" title={t('warmups.title')} subtitle={t('warmups.subtitle')} />

        {/* Level filter */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2 lg:text-base">
            {t('warmups.filterByLevel')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((lv) => (
              <Chip key={lv.value} active={levelFilter === lv.value} onClick={() => setLevelFilter(lv.value)}>
                {t(lv.labelKey)}
              </Chip>
            ))}
          </div>
        </div>

        {/* Player count filter */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2 lg:text-base">
            {t('warmups.filterByPlayers')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PLAYER_FILTERS.map((f) => (
              <Chip key={f.value} active={playerFilter === f.value} onClick={() => setPlayerFilter(f.value)}>
                {f.value === 'any' ? t(f.label) : f.value}
              </Chip>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2 lg:text-base">
            {t('warmups.filterByCategory')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <Chip key={cat.value} active={categoryFilter === cat.value} onClick={() => setCategoryFilter(cat.value)}>
                {t(cat.labelKey)}
              </Chip>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-2 tabular-nums lg:text-base">
            {filtered.length} / {WARMUP_GAMES.length}
          </p>
        </div>

        {/* Random pick button */}
        <Button size="lg" fullWidth onClick={pickRandom} className="mb-5">
          <IconShuffle size={20} />
          {t('warmups.randomPick')}
        </Button>

        {/* Current game card */}
        <Card className="p-5 animate-fade-slide-up lg:p-8" key={currentGame.id}>
          <div className="flex items-start justify-between gap-3 mb-3 lg:mb-5 lg:gap-5">
            <h2 className="text-xl font-bold text-ink leading-tight lg:text-3xl">{t(currentGame.nameKey)}</h2>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <Badge color={levelConfig.color}>
                {t(`warmups.levels.${currentGame.level}`)}
              </Badge>
              <Badge color={CATEGORY_BADGE_COLORS[currentGame.category] ?? 'gray'}>
                {t(`warmups.categories.${currentGame.category}`)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6 lg:gap-3">
            <Badge color="feature"><IconUsers size={12} /> {playersLabel}</Badge>
            <Badge color="gray"><IconTimer size={12} /> {t('warmups.minutes', { count: currentGame.durationMinutes })}</Badge>
          </div>

          <p className="text-ink-muted text-sm leading-relaxed text-pretty lg:text-xl">
            {t(currentGame.descriptionKey)}
          </p>

          {currentGame.tipsKey && (
            <div className="mt-4 pt-4 border-t border-line lg:mt-6 lg:pt-6">
              <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-1 lg:text-base">
                {t('warmups.tips')}
              </p>
              <p className="text-ink-muted text-sm italic text-pretty lg:text-lg">{t(currentGame.tipsKey)}</p>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
