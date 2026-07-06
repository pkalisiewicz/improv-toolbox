import { useTranslation } from 'react-i18next';
import { useReplay } from '../hooks/useReplay';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { IconArrowLeft, IconArrowRight, IconShuffle } from '../components/icons';
import type { ReplayCategory } from '../types';

const CATEGORIES: Array<{ value: ReplayCategory | 'all'; labelKey: string }> = [
  { value: 'all',          labelKey: 'replay.allCategories' },
  { value: 'physicality',  labelKey: 'replay.categories.physicality' },
  { value: 'genre',        labelKey: 'replay.categories.genre' },
  { value: 'emotional',    labelKey: 'replay.categories.emotional' },
  { value: 'structural',   labelKey: 'replay.categories.structural' },
  { value: 'character',    labelKey: 'replay.categories.character' },
];

export function ReplayPage() {
  const { t } = useTranslation();
  const { current, index, total, categoryFilter, next, prev, random, setFilter } = useReplay();

  return (
    <DrawStage
      feature="replay"
      title={t('replay.title')}
      itemKey={current.id}
      counter={`${index + 1} / ${total}`}
      stampLabel={t(`replay.categories.${current.category}`)}
      onDraw={next}
      drawLabel={t('replay.next')}
      drawIcon={<IconArrowRight size={18} />}
      onPrev={prev}
      prevLabel={t('replay.prev')}
      prevIcon={<IconArrowLeft size={18} />}
      footnote={
        <Button variant="accent" size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); random(); }}>
          <IconShuffle size={16} /> {t('replay.random')}
        </Button>
      }
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
