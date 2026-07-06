import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFacts } from '../hooks/useFacts';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { IconArrowLeft, IconArrowRight, IconFacts } from '../components/icons';
import { GLOSSARY_TERMS } from '../data/glossary';
import type { FactCategory, GlossaryCategory } from '../types';

const FACT_CATEGORIES: Array<{ value: FactCategory | 'all'; labelKey: string }> = [
  { value: 'all',       labelKey: 'facts.allCategories' },
  { value: 'history',   labelKey: 'facts.categories.history' },
  { value: 'technique', labelKey: 'facts.categories.technique' },
  { value: 'tips',      labelKey: 'facts.categories.tips' },
  { value: 'famous',    labelKey: 'facts.categories.famous' },
];

const GLOSS_CATEGORIES: Array<{ value: GlossaryCategory | 'all'; labelKey: string }> = [
  { value: 'all',        labelKey: 'glossary.allCategories' },
  { value: 'foundation', labelKey: 'glossary.categories.foundation' },
  { value: 'longform',   labelKey: 'glossary.categories.longform' },
  { value: 'editing',    labelKey: 'glossary.categories.editing' },
  { value: 'stagecraft', labelKey: 'glossary.categories.stagecraft' },
];

export function FactsPage() {
  const { t } = useTranslation();
  const { currentFact, index, total, categoryFilter, next, prev, setFilter } = useFacts();
  const [section, setSection] = useState<'facts' | 'glossary'>('facts');
  const [glossSearch, setGlossSearch] = useState('');
  const [glossCat, setGlossCat] = useState<GlossaryCategory | 'all'>('all');


  const filteredGlossary = useMemo(() => {
    const q = glossSearch.toLowerCase();
    return GLOSSARY_TERMS
      .filter((term) => glossCat === 'all' || term.category === glossCat)
      .filter((term) => {
        if (!q) return true;
        const name = t(term.termKey).toLowerCase();
        const def = t(term.definitionKey).toLowerCase();
        return name.includes(q) || def.includes(q);
      })
      .sort((a, b) => t(a.termKey).localeCompare(t(b.termKey)));
  }, [glossSearch, glossCat, t]);

  return (
    <PageContainer feature="facts">
      <div>
        <PageHeader feature="facts" title={t('facts.title')} subtitle={t('facts.subtitle')} />

        {/* Section tab switcher */}
        <div className="flex gap-1 p-1 bg-surface-2 border border-line rounded-[var(--radius-md)] mb-5">
          {(['facts', 'glossary'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`flex-1 py-2 text-sm font-semibold rounded-[var(--radius-sm)] transition-colors cursor-pointer ${
                section === s ? 'bg-surface text-ink shadow-[var(--shadow-card)]' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t(s === 'facts' ? 'facts.tabFacts' : 'facts.tabGlossary')}
            </button>
          ))}
        </div>

        {section === 'facts' && (
          <>
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {FACT_CATEGORIES.map((cat) => (
                <Chip key={cat.value} active={categoryFilter === cat.value} onClick={() => setFilter(cat.value)}>
                  {t(cat.labelKey)}
                </Chip>
              ))}
            </div>

            {/* Fact card */}
            <Card className="p-6 mb-4 animate-fade-slide-up" key={currentFact.id}>
              <div className="flex items-center gap-2 mb-4">
                <Badge color="feature">
                  {t(`facts.categories.${currentFact.category}`)}
                </Badge>
                <span className="text-xs text-ink-muted ml-auto tabular-nums">
                  {index + 1} / {total}
                </span>
              </div>

              <p className="text-ink leading-relaxed text-base text-pretty">
                {t(currentFact.textKey)}
              </p>

              {currentFact.sourceKey && (
                <p className="mt-4 pt-3 border-t border-line text-xs text-ink-muted italic">
                  {t(currentFact.sourceKey)}
                </p>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={prev} className="flex-1" disabled={total <= 1}>
                <IconArrowLeft size={16} />
                {t('facts.prevFact')}
              </Button>
              <Button size="md" onClick={next} className="flex-1" disabled={total <= 1}>
                {t('facts.nextFact')}
                <IconArrowRight size={16} />
              </Button>
            </div>
          </>
        )}

        {section === 'glossary' && (
          <>
            {/* Search */}
            <input
              type="search"
              value={glossSearch}
              onChange={(e) => setGlossSearch(e.target.value)}
              placeholder={t('glossary.searchPlaceholder')}
              className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-line text-sm text-ink outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400 bg-surface mb-3"
            />

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {GLOSS_CATEGORIES.map((c) => (
                <Chip key={c.value} active={glossCat === c.value} onClick={() => setGlossCat(c.value)}>
                  {t(c.labelKey)}
                </Chip>
              ))}
            </div>

            {/* Term count */}
            <p className="text-xs text-ink-muted mb-3 tabular-nums">
              {filteredGlossary.length} / {GLOSSARY_TERMS.length}
            </p>

            {/* Term list */}
            <div className="space-y-2">
              {filteredGlossary.length === 0 && (
                <EmptyState Icon={IconFacts} title={t('glossary.noResults')} />
              )}
              {filteredGlossary.map((term) => (
                <div key={term.id} className="bg-surface rounded-[var(--radius-lg)] border border-line px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-ink text-sm">{t(term.termKey)}</span>
                    <span className="ml-auto shrink-0">
                      <Badge color="feature" className="text-[10px]">
                        {t(`glossary.categories.${term.category}`)}
                      </Badge>
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed text-pretty">{t(term.definitionKey)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
