import { useTranslation } from 'react-i18next';
import { useConstraints } from '../hooks/useConstraints';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconArrowLeft, IconArrowRight } from '../components/icons';
import type { ConstraintCategory } from '../types';

const CATEGORIES: Array<{ value: ConstraintCategory | 'all'; labelKey: string }> = [
  { value: 'all',        labelKey: 'constraints.allCategories' },
  { value: 'speech',     labelKey: 'constraints.categories.speech' },
  { value: 'physical',   labelKey: 'constraints.categories.physical' },
  { value: 'structural', labelKey: 'constraints.categories.structural' },
  { value: 'relational', labelKey: 'constraints.categories.relational' },
];

export function ConstraintsPage() {
  const { t } = useTranslation();
  const { current, index, total, categoryFilter, next, prev, setFilter } = useConstraints();

  return (
    <DrawStage
      feature="constraints"
      title={t('constraints.title')}
      itemKey={current.id}
      counter={`${index + 1} / ${total}`}
      stampLabel={t(`constraints.categories.${current.category}`)}
      onDraw={next}
      drawLabel={t('constraints.next')}
      drawIcon={<IconArrowRight size={18} />}
      onPrev={prev}
      prevLabel={t('constraints.prev')}
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
