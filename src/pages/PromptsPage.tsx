import { useTranslation } from 'react-i18next';
import { usePrompts } from '../hooks/usePrompts';
import type { PromptCategory } from '../types';
import { DrawStage } from '../components/layout/DrawStage';
import { Chip } from '../components/ui/Chip';
import { IconRefresh } from '../components/icons';

const CATEGORIES: Array<{ value: PromptCategory | 'all'; labelKey: string }> = [
  { value: 'all',           labelKey: 'prompts.categories.all' },
  { value: 'first_line',    labelKey: 'prompts.categories.first_line' },
  { value: 'occupation',    labelKey: 'prompts.categories.occupation' },
  { value: 'location',      labelKey: 'prompts.categories.location' },
  { value: 'what_not_to_say', labelKey: 'prompts.categories.what_not_to_say' },
  { value: 'title',         labelKey: 'prompts.categories.title' },
];

export function PromptsPage() {
  const { t } = useTranslation();
  const { current, category, pickRandom, setFilter } = usePrompts();

  return (
    <DrawStage
      feature="prompts"
      title={t('prompts.title')}
      itemKey={current.textKey}
      stampLabel={t(`prompts.categories.${current.category}`)}
      onDraw={pickRandom}
      drawLabel={t('prompts.next')}
      drawIcon={<IconRefresh size={20} />}
      filters={CATEGORIES.map((cat) => (
        <Chip key={cat.value} active={category === cat.value} onClick={() => setFilter(cat.value)} className="shrink-0">
          {t(cat.labelKey)}
        </Chip>
      ))}
    >
      {t(current.textKey)}
    </DrawStage>
  );
}
