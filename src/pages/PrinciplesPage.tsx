import { useTranslation } from 'react-i18next';
import { usePrinciples } from '../hooks/usePrinciples';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconArrowLeft, IconArrowRight } from '../components/icons';
import type { PrincipleCategory } from '../types';

const CATEGORIES: Array<{ value: PrincipleCategory | 'all'; labelKey: string }> = [
  { value: 'all',        labelKey: 'principles.allCategories' },
  { value: 'foundation', labelKey: 'principles.categories.foundation' },
  { value: 'character',  labelKey: 'principles.categories.character' },
  { value: 'status',     labelKey: 'principles.categories.status' },
  { value: 'editing',    labelKey: 'principles.categories.editing' },
  { value: 'ensemble',   labelKey: 'principles.categories.ensemble' },
  { value: 'stagecraft', labelKey: 'principles.categories.stagecraft' },
];

export function PrinciplesPage() {
  const { t } = useTranslation();
  const { current, index, total, categoryFilter, next, prev, setFilter } = usePrinciples();

  return (
    <DrawStage
      feature="principles"
      title={t('principles.title')}
      itemKey={current.id}
      size="lg"
      counter={`${index + 1} / ${total}`}
      stampLabel={t(`principles.categories.${current.category}`)}
      onDraw={next}
      drawLabel={t('principles.next')}
      drawIcon={<IconArrowRight size={18} />}
      onPrev={prev}
      prevLabel={t('principles.prev')}
      prevIcon={<IconArrowLeft size={18} />}
      footnote={
        <div className="max-w-sm mx-auto">
          <p className="text-base text-ink-muted leading-relaxed">{t(current.textKey)}</p>
          {current.exampleKey && (
            <p className="mt-3 text-sm text-ink-faint italic leading-relaxed">
              {t('principles.exampleLabel')}: {t(current.exampleKey)}
            </p>
          )}
        </div>
      }
      filters={CATEGORIES.map((c) => (
        <Chip key={c.value} active={categoryFilter === c.value} onClick={() => setFilter(c.value)} className="shrink-0">
          {t(c.labelKey)}
        </Chip>
      ))}
    >
      {t(current.nameKey)}
    </DrawStage>
  );
}
