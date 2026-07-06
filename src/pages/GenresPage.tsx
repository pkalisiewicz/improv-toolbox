import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GENRE_CARDS } from '../data/genres';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Chip } from '../components/ui/Chip';
import { GenreGlyph } from '../theme/genreIcons';

export function GenresPage() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>(GENRE_CARDS[0].id);

  const genre = GENRE_CARDS.find((g) => g.id === selectedId) ?? GENRE_CARDS[0];

  return (
    <PageContainer feature="genres">
      <div className="space-y-5">
        <PageHeader
          feature="genres"
          title={t('genres.title')}
          subtitle={t('genres.subtitle')}
        />

        {/* Genre selector */}
        <div className="flex flex-wrap gap-2">
          {GENRE_CARDS.map((g) => (
            <Chip key={g.id} active={selectedId === g.id} onClick={() => setSelectedId(g.id)}>
              {t(g.nameKey)}
            </Chip>
          ))}
        </div>

        {/* Genre card */}
        <div
          key={genre.id}
          className="bg-surface rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-card)] overflow-hidden animate-fade-slide-up"
        >
          {/* Header */}
          <div
            className="px-6 py-6 border-b-2 border-ink"
            style={{ backgroundColor: 'var(--feature-soft)' }}
          >
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-12 h-12 rounded-[var(--radius-md)] bg-ink-fill text-brand-500 shrink-0">
                <GenreGlyph id={genre.id} size={27} strokeWidth={2.4} />
              </span>
              <h2 className="font-display font-semibold text-ink text-[2rem] leading-none [font-variation-settings:'opsz'_72,'WONK'_1]">
                {t(genre.nameKey)}
              </h2>
            </div>
          </div>

          {/* Tips */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-xs font-semibold text-[var(--feature-ink)] uppercase tracking-wider mb-4">
              {t('genres.tips')}
            </p>
            <ol className="space-y-3">
              {genre.tipKeys.map((tipKey, i) => (
                <li key={tipKey} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--feature-soft)] text-[var(--feature-ink)] flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-ink leading-relaxed">{t(tipKey)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
