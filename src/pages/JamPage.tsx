import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IMPROV_FORMATS } from '../data/formats';
import type { ImprovFormat } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import {
  IconPlay, IconClose, IconPlus, IconChevronLeft, IconChevronRight, IconJam,
} from '../components/icons';

interface QueueItem {
  name: string;
  formatId?: string;
}

const SUGGEST_KEYS: Record<string, string> = {
  word: 'jam.suggest.word',
  story: 'jam.suggest.story',
  theme: 'jam.suggest.theme',
  scene: 'jam.suggest.scene',
  character: 'jam.suggest.character',
  genre: 'jam.suggest.genre',
  location: 'jam.suggest.location',
  event: 'jam.suggest.event',
  emotion: 'jam.suggest.emotion',
  relationship: 'jam.suggest.relationship',
};

export function JamPage() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [input, setInput] = useState('');
  const [showMode, setShowMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFormat = (formatId: string, name: string) => {
    setQueue((q) => [...q, { name, formatId }]);
  };

  const addCustom = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setQueue((q) => [...q, { name: trimmed }]);
    setInput('');
    inputRef.current?.focus();
  };

  const removeItem = (i: number) => {
    setQueue((q) => q.filter((_, idx) => idx !== i));
  };

  const startShow = () => {
    setCurrentIndex(0);
    setShowMode(true);
  };

  const exitShow = () => setShowMode(false);
  const nextItem = () => setCurrentIndex((i) => i + 1);
  const prevItem = () => setCurrentIndex((i) => Math.max(0, i - 1));

  // ── Show mode ──────────────────────────────────────────────────────────────
  if (showMode) {
    const isDone = currentIndex >= queue.length;

    if (isDone) {
      return (
        <div className="fixed inset-0 z-50 bg-ink-fill flex flex-col items-center justify-center px-8">
          <div className="grid place-items-center w-20 h-20 rounded-[var(--radius-lg)] bg-brand-500 text-ink mb-6">
            <IconJam size={42} strokeWidth={2.6} />
          </div>
          <p className="text-white text-3xl font-black mb-2 text-center">{t('jam.done')}</p>
          <button
            onClick={exitShow}
            className="mt-8 px-6 py-3 rounded-[var(--radius-lg)] bg-white/15 hover:bg-white/25 text-white font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-2)] focus-visible:ring-brand-400"
          >
            {t('jam.backToQueue')}
          </button>
        </div>
      );
    }

    const item = queue[currentIndex];
    const format: ImprovFormat | undefined = item.formatId
      ? IMPROV_FORMATS.find((f) => f.id === item.formatId)
      : undefined;

    const rules = format ? t(format.rulesKey).split('\n').filter(Boolean) : [];
    const suggestKey = format ? SUGGEST_KEYS[format.suggestionType] : '';

    return (
      <div className="fixed inset-0 z-50 bg-ink-fill flex flex-col">
        {/* Top bar */}
        <div
          className="shrink-0 flex items-center justify-between px-5 pb-2"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <span className="text-white/60 text-sm font-semibold tabular-nums">
            {currentIndex + 1} / {queue.length}
          </span>
          <button
            onClick={exitShow}
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm font-semibold transition-colors py-1 px-2 cursor-pointer"
          >
            <IconClose size={16} />
            {t('jam.exitShow')}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Game name */}
          <p
            className="text-white font-black leading-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)' }}
          >
            {item.name}
          </p>

          {/* Meta badges */}
          {format && (
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestKey && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                  {t('jam.ask')} {t(suggestKey)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                {format.maxPlayers
                  ? `${format.minPlayers}–${format.maxPlayers} ${t('jam.players')}`
                  : `${format.minPlayers}+ ${t('jam.players')}`}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                {format.durationMinutes} min
              </span>
            </div>
          )}

          {/* Rules */}
          {rules.length > 0 && (
            <ol className="space-y-3 mt-2">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-white/90">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand-400 text-ink grid place-items-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Bottom controls */}
        <div
          className="shrink-0 flex justify-between items-center px-5 py-4 border-t border-white/15"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={prevItem}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm font-semibold transition-colors py-2 px-3 disabled:opacity-30 cursor-pointer"
          >
            <IconChevronLeft size={16} />
            {t('jam.prev')}
          </button>
          <p className="text-white/40 text-xs">{t('jam.tapToAdvance')}</p>
          <button
            onClick={nextItem}
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm font-semibold transition-colors py-2 px-3 cursor-pointer"
          >
            {t('jam.next')}
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── Build mode ─────────────────────────────────────────────────────────────
  return (
    <PageContainer feature="jam">
      <div className="space-y-5">
        <PageHeader
          feature="jam"
          title={t('jam.title')}
          subtitle={t('jam.subtitle')}
          action={<Badge color="feature">Alpha</Badge>}
        />

        {/* Add input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
            placeholder={t('jam.addPlaceholder')}
            className="flex-1 min-w-0 px-4 py-2.5 rounded-[var(--radius-md)] border border-line text-sm outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-200 bg-surface"
          />
          <Button onClick={addCustom} size="md">
            <IconPlus size={16} />
            {t('jam.add')}
          </Button>
        </div>

        {/* Quick-add format chips */}
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">{t('jam.quickAdd')}</p>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
            <div className="flex gap-1.5 pb-1 w-max">
              {IMPROV_FORMATS.map((f) => (
                <Chip
                  key={f.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addFormat(f.id, t(f.nameKey))}
                  className="shrink-0 whitespace-nowrap"
                >
                  {t(f.nameKey)}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Queue list */}
        {queue.length === 0 ? (
          <EmptyState Icon={IconJam} title={t('jam.emptyQueue')} />
        ) : (
          <div className="stagger space-y-2">
            {queue.map((item, i) => {
              const fmt = item.formatId ? IMPROV_FORMATS.find((f) => f.id === item.formatId) : undefined;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-surface rounded-[var(--radius-md)] border border-line shadow-[var(--shadow-card)] px-4 py-3"
                >
                  <span className="text-sm font-semibold text-brand-700 tabular-nums w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium break-words [overflow-wrap:anywhere]">{item.name}</p>
                    {fmt && (
                      <p className="text-xs text-ink-muted mt-0.5">
                        {fmt.minPlayers}+ {t('jam.players')} · {fmt.durationMinutes} min
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    aria-label={t('jam.exitShow')}
                    className="grid place-items-center w-8 h-8 rounded-[var(--radius-md)] text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400"
                  >
                    <IconClose size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Start Show */}
        {queue.length > 0 && (
          <Button size="xl" fullWidth onClick={startShow}>
            <IconPlay size={20} />
            {t('jam.startShow')}
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
