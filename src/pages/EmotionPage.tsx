import { useTranslation } from 'react-i18next';
import { useEmotion } from '../hooks/useEmotion';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconRefresh } from '../components/icons';
import type { EmotionFamily } from '../types';

const FAMILIES: Array<{ value: EmotionFamily | 'all'; labelKey: string }> = [
  { value: 'all',      labelKey: 'emotion.allFamilies' },
  { value: 'joy',      labelKey: 'emotion.families.joy' },
  { value: 'sadness',  labelKey: 'emotion.families.sadness' },
  { value: 'anger',    labelKey: 'emotion.families.anger' },
  { value: 'fear',     labelKey: 'emotion.families.fear' },
  { value: 'surprise', labelKey: 'emotion.families.surprise' },
  { value: 'disgust',  labelKey: 'emotion.families.disgust' },
];

export function EmotionPage() {
  const { t } = useTranslation();
  const { current, familyFilter, total, spin, setFilter } = useEmotion();

  return (
    <DrawStage
      feature="emotion"
      title={t('emotion.title')}
      itemKey={current.id}
      counter={`${total}`}
      stampLabel={t(`emotion.families.${current.family}`)}
      onDraw={spin}
      drawLabel={t('emotion.spin')}
      drawIcon={<IconRefresh size={20} />}
      filters={FAMILIES.map((fam) => (
        <Chip key={fam.value} active={familyFilter === fam.value} onClick={() => setFilter(fam.value)} className="shrink-0">
          {t(fam.labelKey)}
        </Chip>
      ))}
    >
      {t(current.textKey)}
    </DrawStage>
  );
}
