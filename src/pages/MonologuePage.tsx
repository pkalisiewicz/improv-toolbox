import { useTranslation } from 'react-i18next';
import { useMonologue } from '../hooks/useMonologue';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconArrowLeft, IconArrowRight } from '../components/icons';
import type { MonologueCategory } from '../types';

const CATEGORIES: Array<{ value: MonologueCategory | 'all'; labelKey: string }> = [
  { value: 'all',           labelKey: 'monologue.allCategories' },
  { value: 'embarrassment', labelKey: 'monologue.categories.embarrassment' },
  { value: 'surprise',      labelKey: 'monologue.categories.surprise' },
  { value: 'pride',         labelKey: 'monologue.categories.pride' },
  { value: 'fear',          labelKey: 'monologue.categories.fear' },
  { value: 'childhood',     labelKey: 'monologue.categories.childhood' },
  { value: 'work',          labelKey: 'monologue.categories.work' },
  { value: 'relationships', labelKey: 'monologue.categories.relationships' },
];

export function MonologuePage() {
  const { t } = useTranslation();
  const { current, index, total, categoryFilter, next, prev, setFilter } = useMonologue();

  return (
    <DrawStage
      feature="monologue"
      title={t('monologue.title')}
      itemKey={current.id}
      counter={`${index + 1} / ${total}`}
      stampLabel={t(`monologue.categories.${current.category}`)}
      onDraw={next}
      drawLabel={t('monologue.next')}
      drawIcon={<IconArrowRight size={18} />}
      onPrev={prev}
      prevLabel={t('monologue.prev')}
      prevIcon={<IconArrowLeft size={18} />}
      filters={CATEGORIES.map((c) => (
        <Chip key={c.value} active={categoryFilter === c.value} onClick={() => setFilter(c.value)} className="shrink-0">
          {t(c.labelKey)}
        </Chip>
      ))}
    >
      {t(current.textKey)}
    </DrawStage>
  );
}
