import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { IconRefresh, IconCheck, IconSparkles } from '../components/icons';

type BeatId =
  | 'opening'
  | 'r1a' | 'r1b' | 'r1c'
  | 'game1'
  | 'r2a' | 'r2b' | 'r2c'
  | 'game2'
  | 'r3a' | 'r3b' | 'r3c';

interface Beat {
  id: BeatId;
  labelKey: string;
  type: 'opening' | 'scene' | 'game';
}

const BEATS: Beat[] = [
  { id: 'opening', labelKey: 'harold.opening', type: 'opening' },
  { id: 'r1a',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r1b',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r1c',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'game1',  labelKey: 'harold.groupGame', type: 'game' },
  { id: 'r2a',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r2b',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r2c',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'game2',  labelKey: 'harold.groupGame', type: 'game' },
  { id: 'r3a',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r3b',    labelKey: 'harold.scene',   type: 'scene' },
  { id: 'r3c',    labelKey: 'harold.scene',   type: 'scene' },
];

const ROUND_LABELS: Record<string, string> = {
  r1a: '1', r1b: '1', r1c: '1',
  r2a: '2', r2b: '2', r2c: '2',
  r3a: '3', r3b: '3', r3c: '3',
};

const SCENE_LETTERS: Record<string, string> = {
  r1a: 'A', r1b: 'B', r1c: 'C',
  r2a: 'A', r2b: 'B', r2c: 'C',
  r3a: 'A', r3b: 'B', r3c: 'C',
};

export function HaroldPage() {
  const { t } = useTranslation();
  const [done, setDone] = useState<Set<BeatId>>(new Set());
  const [suggestion, setSuggestion] = useState('');

  const toggle = (id: BeatId) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const reset = () => {
    setDone(new Set());
    setSuggestion('');
  };

  const completedCount = done.size;
  const totalBeats = BEATS.length;

  // Group beats into sections for display
  const sections = [
    { labelKey: '',          beats: [BEATS[0]] },
    { labelKey: 'harold.round', round: '1', beats: BEATS.slice(1, 4) },
    { labelKey: '',          beats: [BEATS[4]] },
    { labelKey: 'harold.round', round: '2', beats: BEATS.slice(5, 8) },
    { labelKey: '',          beats: [BEATS[8]] },
    { labelKey: 'harold.round', round: '3', beats: BEATS.slice(9, 12) },
  ];

  return (
    <PageContainer feature="harold">
      <div className="space-y-5">
        <PageHeader
          feature="harold"
          title={t('harold.title')}
          subtitle={t('harold.subtitle')}
          action={
            <Button variant="ghost" size="sm" onClick={reset}>
              <IconRefresh size={14} />
              {t('harold.reset')}
            </Button>
          }
        />

        {/* Suggestion input */}
        <div>
          <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">
            {t('harold.suggestion')}
          </label>
          <input
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder={t('harold.suggestionPlaceholder')}
            className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-line text-sm outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-200 bg-surface"
          />
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-ink-muted">
            <span>{t('harold.progress')}</span>
            <span className="tabular-nums">{completedCount} / {totalBeats}</span>
          </div>
          <div className="w-full bg-brand-50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-400 h-2 rounded-full transition-all duration-300 ease-[var(--ease-out)]"
              style={{ width: `${(completedCount / totalBeats) * 100}%` }}
            />
          </div>
        </div>

        {/* Harold structure */}
        <div className="stagger space-y-3">
          {sections.map((section, si) => (
            <div key={si}>
              {section.labelKey && (
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                  {t(section.labelKey)} {section.round}
                </p>
              )}
              <div className="space-y-2">
                {section.beats.map((beat) => {
                  const isDone = done.has(beat.id);
                  const isOpening = beat.type === 'opening';
                  const isGame = beat.type === 'game';
                  const sceneLetter = SCENE_LETTERS[beat.id];
                  const roundNum = ROUND_LABELS[beat.id];
                  const isAccent = isGame || isOpening;

                  return (
                    <button
                      key={beat.id}
                      onClick={() => toggle(beat.id)}
                      className={`w-full text-left px-4 py-3 rounded-[var(--radius-lg)] border-2 transition-all duration-150 ease-[var(--ease-out)] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 ${
                        isDone
                          ? 'bg-brand-100 border-brand-400 text-brand-800'
                          : isAccent
                          ? 'bg-brand-50 border-brand-200 text-brand-900 hover:border-brand-400'
                          : 'bg-surface border-line text-ink hover:border-brand-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`shrink-0 w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
                            isDone
                              ? 'bg-brand-400 text-ink'
                              : isAccent
                              ? 'bg-brand-100 text-brand-700'
                              : 'bg-brand-50 text-ink-muted'
                          }`}
                        >
                          {isDone ? <IconCheck size={14} /> : isAccent ? <IconSparkles size={14} /> : sceneLetter}
                        </span>
                        <span className="text-sm font-semibold">
                          {isOpening && t('harold.opening')}
                          {isGame && t('harold.groupGame')}
                          {beat.type === 'scene' && `${t('harold.round')} ${roundNum} · ${t('harold.scene')} ${sceneLetter}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {completedCount === totalBeats && (
          <div className="bg-brand-50 border-2 border-brand-300 rounded-[var(--radius-lg)] px-5 py-4 text-center">
            <IconSparkles size={24} className="mx-auto mb-1 text-brand-700" />
            <p className="text-sm font-bold text-brand-800">{t('harold.done')}</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
