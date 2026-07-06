import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVariants } from '../hooks/useVariants';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { IconShuffle } from '../components/icons';
import type { ModifierCategory } from '../types';

const CATEGORIES: Array<{ value: ModifierCategory | 'all'; labelKey: string }> = [
  { value: 'all',         labelKey: 'variants.allCategories' },
  { value: 'restriction', labelKey: 'variants.categories.restriction' },
  { value: 'role',        labelKey: 'variants.categories.role' },
  { value: 'format',      labelKey: 'variants.categories.format' },
  { value: 'constraint',  labelKey: 'variants.categories.constraint' },
];

export function VariantsPage() {
  const { t } = useTranslation();
  const { current, categoryFilter, total, randomize, setFilter } = useVariants();
  const [gameName, setGameName] = useState('');


  return (
    <PageContainer feature="variants">
      <div className="space-y-5">
        <PageHeader feature="variants" title={t('variants.title')} subtitle={t('variants.subtitle')} />

        {/* Game name input */}
        <div>
          <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5 lg:text-base">
            {t('variants.gameName')}
          </label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder={t('variants.gameNamePlaceholder')}
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-line text-sm outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-200 bg-surface lg:px-5 lg:py-3 lg:text-lg"
          />
        </div>

        {/* Modifier category filter */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <Chip key={c.value} active={categoryFilter === c.value} onClick={() => setFilter(c.value)}>
              {t(c.labelKey)}
            </Chip>
          ))}
        </div>

        {/* Result card */}
        <Card key={current.id} className="p-6 animate-fade-slide-up lg:p-8">
          {gameName && (
            <p className="text-base font-bold text-ink mb-3 lg:text-xl">
              {gameName}
            </p>
          )}
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-widest mb-2 lg:text-base">
            {t('variants.twist')}
          </p>
          <p className="text-xl font-black text-ink leading-snug lg:text-3xl">
            {t(current.textKey)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge color="feature">
              {t(`variants.categories.${current.category}`)}
            </Badge>
            <span className="text-xs text-ink-muted tabular-nums ml-auto lg:text-base">{total} {t('variants.available')}</span>
          </div>
        </Card>

        {/* Randomize button */}
        <Button size="xl" fullWidth onClick={randomize}>
          <IconShuffle size={20} />
          {t('variants.newTwist')}
        </Button>
      </div>
    </PageContainer>
  );
}
