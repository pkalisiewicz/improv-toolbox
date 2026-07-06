import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useSuggestions } from '../hooks/useSuggestions';
import type { SuggestionCategory } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { DrawStage } from '../components/layout/DrawStage';
import { BackToMore } from '../components/layout/BackToMore';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import type { IconProps } from '../components/icons/createIcon';
import { IconShuffle, IconLocation, IconBriefcase, IconUsers, IconEmotion } from '../components/icons';

const CATEGORIES: Array<{ value: SuggestionCategory | 'grab'; labelKey: string }> = [
  { value: 'location',     labelKey: 'suggestions.categories.location' },
  { value: 'occupation',   labelKey: 'suggestions.categories.occupation' },
  { value: 'relationship', labelKey: 'suggestions.categories.relationship' },
  { value: 'emotion',      labelKey: 'suggestions.categories.emotion' },
  { value: 'movie_title',  labelKey: 'suggestions.categories.movie_title' },
  { value: 'word',         labelKey: 'suggestions.categories.word' },
  { value: 'grab',         labelKey: 'suggestions.grabBag' },
];

const GRAB_ROWS: ReadonlyArray<{ key: 'location' | 'occupation' | 'relationship' | 'emotion'; Icon: ComponentType<IconProps>; labelKey: string }> = [
  { key: 'location',     Icon: IconLocation,  labelKey: 'suggestions.categories.location' },
  { key: 'occupation',   Icon: IconBriefcase, labelKey: 'suggestions.categories.occupation' },
  { key: 'relationship', Icon: IconUsers,     labelKey: 'suggestions.categories.relationship' },
  { key: 'emotion',      Icon: IconEmotion,   labelKey: 'suggestions.categories.emotion' },
];

export function SuggestionsPage() {
  const { t } = useTranslation();
  const { current, category, grabBag, pickRandom, changeCategory } = useSuggestions();

  const filters = CATEGORIES.map((cat) => (
    <Chip key={cat.value} active={category === cat.value} onClick={() => changeCategory(cat.value)} className="shrink-0">
      {t(cat.labelKey)}
    </Chip>
  ));

  // Grab-bag — a four-line callsheet, the whole bill in one draw.
  if (category === 'grab') {
    return (
      <PageContainer feature="suggestions" frame={false}>
        <div className="flex flex-1 min-h-0 flex-col max-w-md mx-auto w-full">
          <div className="px-4 pt-4">
            <BackToMore className="mb-3" />
            <p className="font-display text-lg font-semibold text-ink [font-variation-settings:'opsz'_40]">
              {t('suggestions.title')}
            </p>
            <div className="-mx-4 px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">{filters}</div>
          </div>

          <div className="flex-1 flex items-center px-4 py-6">
            {grabBag ? (
              <div className="w-full border-2 border-ink rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-hard)] overflow-hidden divide-y-2 divide-ink stagger">
                {GRAB_ROWS.map(({ key, Icon, labelKey }) => (
                  <div key={key} className="flex items-center gap-3 px-4 py-4">
                    <span className="shrink-0 grid place-items-center w-10 h-10 rounded-[var(--radius-md)] border-2 border-ink text-[var(--feature-ink)]" style={{ backgroundColor: 'var(--feature-soft)' }}>
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">{t(labelKey)}</p>
                      <p className="font-display text-2xl font-semibold text-ink leading-tight break-words [overflow-wrap:anywhere]">{t(grabBag[key].textKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="w-full text-center text-ink-muted">{t('suggestions.grabBagHint')}</p>
            )}
          </div>

          <div className="px-4 pb-5 pt-2">
            <Button variant="primary" size="xl" fullWidth onClick={pickRandom}>
              <IconShuffle size={20} /> {t('suggestions.next')}
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <DrawStage
      feature="suggestions"
      title={t('suggestions.title')}
      itemKey={current.textKey}
      stampLabel={t(`suggestions.categories.${category}`)}
      onDraw={pickRandom}
      drawLabel={t('suggestions.next')}
      drawIcon={<IconShuffle size={20} />}
      filters={filters}
    >
      {t(current.textKey)}
    </DrawStage>
  );
}
