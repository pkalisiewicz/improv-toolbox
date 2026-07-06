import { useState } from 'react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useScene } from '../hooks/useScene';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { IconButton } from '../components/ui/IconButton';
import type { IconProps } from '../components/icons/createIcon';
import {
  IconShuffle, IconChevronDown, IconLocation, IconUsers, IconBolt, IconEmotion, IconTimer,
} from '../components/icons';
import type { ScenePreset, SceneCategory } from '../types';

interface SceneCardProps {
  Icon: ComponentType<IconProps>;
  label: string;
  value: string;
  onRegenerate: () => void;
}

function SceneCard({ Icon, label, value, onRegenerate }: SceneCardProps) {
  return (
    <Card className="p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 lg:mb-2 lg:gap-3">
            <span className="text-[var(--feature-ink)] [&_svg]:h-4 [&_svg]:w-4 lg:[&_svg]:h-6 lg:[&_svg]:w-6"><Icon size={16} /></span>
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide lg:text-base">
              {label}
            </span>
          </div>
          <p className="text-ink font-medium text-base leading-snug lg:text-2xl">{value}</p>
        </div>
        <IconButton Icon={IconShuffle} label={label} onClick={onRegenerate} />
      </div>
    </Card>
  );
}

const GENRES: Array<{ value: SceneCategory | 'all'; labelKey: string }> = [
  { value: 'all',        labelKey: 'scenes.genres.all' },
  { value: 'comedy',     labelKey: 'scenes.genres.comedy' },
  { value: 'drama',      labelKey: 'scenes.genres.drama' },
  { value: 'romantic',   labelKey: 'scenes.genres.romantic' },
  { value: 'thriller',   labelKey: 'scenes.genres.thriller' },
  { value: 'absurd',     labelKey: 'scenes.genres.absurd' },
  { value: 'historical', labelKey: 'scenes.genres.historical' },
];

export function ScenePage() {
  const { t } = useTranslation();
  const { preset, genre, regenerateAll, regenerateOne, setGenre } = useScene();
  const [showExtras, setShowExtras] = useState(false);

  const cards: Array<{
    key: keyof ScenePreset;
    Icon: ComponentType<IconProps>;
    labelKey: string;
  }> = [
    { key: 'location',     Icon: IconLocation, labelKey: 'scenes.location' },
    { key: 'relationship', Icon: IconUsers,    labelKey: 'scenes.relationship' },
    { key: 'situation',    Icon: IconBolt,     labelKey: 'scenes.situation' },
  ];

  const extraCards: Array<{
    key: keyof ScenePreset;
    Icon: ComponentType<IconProps>;
    labelKey: string;
  }> = [
    { key: 'mood',       Icon: IconEmotion, labelKey: 'scenes.mood' },
    { key: 'timePeriod', Icon: IconTimer,   labelKey: 'scenes.timePeriod' },
  ];

  return (
    <PageContainer feature="scene">
      <div>
        <PageHeader
          feature="scene"
          title={t('scenes.title')}
          subtitle={t('scenes.subtitle')}
          action={
            <Button variant="primary" size="sm" onClick={regenerateAll}>
              <IconShuffle size={16} />
              {t('scenes.regenerateAll')}
            </Button>
          }
        />

        {/* Genre filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2 lg:text-base">
            {t('scenes.filterByGenre')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((g) => (
              <Chip key={g.value} active={genre === g.value} onClick={() => setGenre(g.value)}>
                {t(g.labelKey)}
              </Chip>
            ))}
          </div>
        </div>

        <div className="stagger space-y-3">
          {cards.map((card) => (
            <SceneCard
              key={card.key}
              Icon={card.Icon}
              label={t(card.labelKey)}
              value={t(preset[card.key].textKey)}
              onRegenerate={() => regenerateOne(card.key)}
            />
          ))}

          <button
            onClick={() => setShowExtras((v) => !v)}
            className="w-full text-sm text-brand-700 hover:text-ink font-semibold py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 rounded-[var(--radius-md)] lg:text-lg"
          >
            <IconChevronDown
              size={16}
              className={`transition-transform duration-150 ease-[var(--ease-out)] ${showExtras ? 'rotate-180' : ''}`}
            />
            {showExtras ? t('scenes.hideExtras') : t('scenes.showExtras')}
          </button>

          {showExtras && (
            <div className="stagger space-y-3 animate-fade-slide-up">
              {extraCards.map((card) => (
                <SceneCard
                  key={card.key}
                  Icon={card.Icon}
                  label={t(card.labelKey)}
                  value={t(preset[card.key].textKey)}
                  onRegenerate={() => regenerateOne(card.key)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
