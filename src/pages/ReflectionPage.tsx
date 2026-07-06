import { useTranslation } from 'react-i18next';
import { useReflection } from '../hooks/useReflection';
import type { ReflectionCategory } from '../types';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconRefresh } from '../components/icons';

const CATEGORIES: Array<{ value: ReflectionCategory | 'all'; labelKey: string }> = [
  { value: 'all',       labelKey: 'reflection.categories.all' },
  { value: 'game',      labelKey: 'reflection.categories.game' },
  { value: 'crow',      labelKey: 'reflection.categories.crow' },
  { value: 'ensemble',  labelKey: 'reflection.categories.ensemble' },
  { value: 'edit',      labelKey: 'reflection.categories.edit' },
  { value: 'character', labelKey: 'reflection.categories.character' },
];

export function ReflectionPage() {
  const { t } = useTranslation();
  const { current, category, filtered, pickRandom, changeCategory } = useReflection();

  return (
    <DrawStage
      feature="reflection"
      title={t('reflection.title')}
      itemKey={current.textKey}
      stampLabel={t(`reflection.categories.${current.category}`)}
      onDraw={pickRandom}
      drawLabel={t('reflection.next')}
      drawIcon={<IconRefresh size={18} />}
      counter={`${filtered.length}`}
      filters={CATEGORIES.map((cat) => (
        <Chip key={cat.value} active={category === cat.value} onClick={() => changeCategory(cat.value)} className="shrink-0">
          {t(cat.labelKey)}
        </Chip>
      ))}
    >
      {t(current.textKey)}
    </DrawStage>
  );
}
