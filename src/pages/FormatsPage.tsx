import { useTranslation } from 'react-i18next';
import { useFormats } from '../hooks/useFormats';
import type { FormatDifficulty, ImprovFormat } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { IconArrowLeft, IconUsers, IconTimer, IconSparkles } from '../components/icons';
import { IMPROV_FORMATS } from '../data/formats';

const DIFFICULTIES: Array<{ value: FormatDifficulty | 'all'; labelKey: string }> = [
  { value: 'all',          labelKey: 'formats.allDifficulties' },
  { value: 'beginner',     labelKey: 'formats.difficulty.beginner' },
  { value: 'intermediate', labelKey: 'formats.difficulty.intermediate' },
  { value: 'advanced',     labelKey: 'formats.difficulty.advanced' },
];

function FormatCard({ format, onClick }: { format: ImprovFormat; onClick: () => void }) {
  const { t } = useTranslation();
  const playersLabel = format.maxPlayers === null
    ? t('formats.players_min', { min: format.minPlayers })
    : t('formats.players_range', { min: format.minPlayers, max: format.maxPlayers });

  return (
    <Card className="p-4" onClick={onClick}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-ink text-base">{t(format.nameKey)}</h3>
        <Badge color="feature">
          {t(`formats.difficulty.${format.difficulty}`)}
        </Badge>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed mb-3">{t(format.descriptionKey)}</p>
      <div className="flex gap-2 flex-wrap">
        <Badge color="gray"><IconUsers size={12} /> {playersLabel}</Badge>
        <Badge color="gray"><IconTimer size={12} /> {format.durationMinutes} min</Badge>
        {format.suggestionType !== 'none' && (
          <Badge color="gray"><IconSparkles size={12} /> {format.suggestionType}</Badge>
        )}
      </div>
    </Card>
  );
}

export function FormatsPage() {
  const { t } = useTranslation();
  const { filtered, difficulty, setDifficulty, selected, setSelected } = useFormats();

  if (selected) {
    const playersLabel = selected.maxPlayers === null
      ? t('formats.players_min', { min: selected.minPlayers })
      : t('formats.players_range', { min: selected.minPlayers, max: selected.maxPlayers });

    return (
      <PageContainer feature="formats">
        <div>
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="mb-4 -ml-2">
            <IconArrowLeft size={16} />
            {t('formats.backToList')}
          </Button>
          <h1 className="text-2xl font-bold text-ink mb-2">{t(selected.nameKey)}</h1>
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge color="feature">{t(`formats.difficulty.${selected.difficulty}`)}</Badge>
            <Badge color="gray"><IconUsers size={12} /> {playersLabel}</Badge>
            <Badge color="gray"><IconTimer size={12} /> {selected.durationMinutes} min</Badge>
          </div>
          <Card className="p-5">
            <p className="text-ink leading-relaxed">{t(selected.descriptionKey)}</p>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer feature="formats">
      <div>
        <PageHeader feature="formats" title={t('formats.title')} subtitle={t('formats.subtitle')} />

        {/* Difficulty filter */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {DIFFICULTIES.map((d) => (
            <Chip key={d.value} active={difficulty === d.value} onClick={() => setDifficulty(d.value)}>
              {t(d.labelKey)}
            </Chip>
          ))}
        </div>

        <p className="text-xs text-ink-muted mb-3 tabular-nums">{filtered.length} / {IMPROV_FORMATS.length}</p>

        <div className="space-y-3 stagger">
          {filtered.map((format) => (
            <FormatCard key={format.id} format={format} onClick={() => setSelected(format)} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
