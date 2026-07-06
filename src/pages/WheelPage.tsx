import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWheel } from '../hooks/useWheel';
import { haptics } from '../native/haptics';
import { ARCHETYPES } from '../data/archetypes';
import { WheelCanvas } from '../components/wheel/WheelCanvas';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { IconWheel, IconRefresh, IconSparkles, IconChevronRight, IconArrowLeft } from '../components/icons';
import { ArchetypeGlyph } from '../theme/archetypeIcons';

const PLAYER_OPTIONS = [2, 3, 4, 5, 6, 7, 8];
type PoolMode = 'all' | 'custom';
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-2)]';

function scrollMainToTop() {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'auto' });
}

function ViewResultsLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-xs font-semibold text-ink-muted transition-colors hover:text-brand-600 cursor-pointer ${FOCUS_RING}`}
    >
      {label}
      <IconChevronRight size={14} />
    </button>
  );
}

export function WheelPage() {
  const { t } = useTranslation();
  const [triggerSpin, setTriggerSpin] = useState(false);

  // Setup state
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);
  const [poolMode, setPoolMode] = useState<PoolMode>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  const {
    phase,
    totalPlayers,
    remainingArchetypes,
    assignedResults,
    lastWinner,
    startSession,
    resolveSpinResult,
    nextPlayer,
    reroll,
    showResults,
    backFromResults,
    reset,
  } = useWheel();

  const handleSpinComplete = (winnerIndex: number) => {
    setTriggerSpin(false);
    resolveSpinResult(winnerIndex);
  };

  const toggleArchetype = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.size === ARCHETYPES.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ARCHETYPES.map((a) => a.id)));
    }
  };

  const isCustomPool = poolMode === 'custom';
  const selectedArchetypes = isCustomPool
    ? ARCHETYPES.filter((a) => selectedIds.has(a.id))
    : ARCHETYPES;
  const canStart =
    selectedPlayers !== null &&
    selectedArchetypes.length >= 1 &&
    (allowDuplicates || selectedArchetypes.length >= selectedPlayers);

  const handleStart = () => {
    if (!selectedPlayers || !canStart) return;
    startSession(selectedPlayers, selectedArchetypes, allowDuplicates);
    scrollMainToTop();
  };

  const handleReset = () => {
    reset();
    setSelectedPlayers(null);
    setPoolMode('all');
    setSelectedIds(new Set());
    setAllowDuplicates(false);
    scrollMainToTop();
  };

  const currentPlayerNumber = assignedResults.length + 1;
  const allAssigned = assignedResults.length >= totalPlayers && totalPlayers > 0;

  return (
    <PageContainer feature="wheel">
      <div>
        {phase === 'setup' && (
          <PageHeader feature="wheel" title={t('wheel.title')} subtitle={t('wheel.subtitle')} />
        )}

        {/* ── Setup ───────────────────────────────────────────────────────── */}
        {phase === 'setup' && (
          <div className="animate-fade-slide-up space-y-4">

            {/* Player count */}
            <Card className="p-5 lg:p-8">
              <h2 className="text-base font-bold text-ink mb-3 lg:mb-5 lg:text-2xl">{t('wheel.setupTitle')}</h2>
              <div className="grid grid-cols-4 gap-2 lg:gap-4">
                {PLAYER_OPTIONS.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setSelectedPlayers(n)}
                    aria-pressed={selectedPlayers === n}
                    className={`aspect-square rounded-[var(--radius-md)] border-2 font-bold text-xl transition-all duration-150 ease-[var(--ease-out)] active:scale-95 cursor-pointer lg:text-4xl xl:text-5xl ${FOCUS_RING} ${
                      selectedPlayers === n
                        ? 'bg-brand-400 border-brand-500 text-ink shadow-[var(--shadow-card)]'
                        : 'bg-brand-50 border-brand-100 text-brand-700 hover:bg-brand-100 hover:border-brand-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Card>

            {/* Archetype pool */}
            <Card className="p-5 lg:p-8">
              <div className="flex items-center justify-between mb-3 lg:mb-5">
                <h2 className="text-base font-bold text-ink lg:text-2xl">
                  {t('wheel.wheelPool')}
                </h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 lg:text-base">
                  {isCustomPool
                    ? t('wheel.customPoolCount', {
                        selected: selectedIds.size,
                        total: ARCHETYPES.length,
                      })
                    : t('wheel.allPoolCount', { count: ARCHETYPES.length })}
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-1 rounded-[var(--radius-md)] bg-surface-3 p-1"
                role="group"
                aria-label={t('wheel.poolModeLabel')}
              >
                {(['all', 'custom'] as PoolMode[]).map((mode) => {
                  const active = poolMode === mode;
                  return (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPoolMode(mode)}
                      aria-pressed={active}
                      className={`flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] px-3 text-sm font-bold transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] lg:text-base ${FOCUS_RING} ${
                        active
                          ? 'bg-surface text-ink shadow-[var(--shadow-card)]'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {mode === 'all' ? t('wheel.useAllPool') : t('wheel.useCustomPool')}
                    </button>
                  );
                })}
              </div>

              {isCustomPool ? (
                <div className="mt-4 space-y-3 lg:mt-5 lg:space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSelectAllToggle}
                      className={`rounded-full px-2 py-1 text-xs text-brand-700 hover:text-ink font-semibold cursor-pointer lg:px-3 lg:text-base ${FOCUS_RING}`}
                    >
                      {selectedIds.size === ARCHETYPES.length ? t('wheel.clearAll') : t('wheel.selectAll')}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 lg:gap-4">
                    {ARCHETYPES.map((arch) => {
                      const isSelected = selectedIds.has(arch.id);
                      return (
                        <button
                          type="button"
                          key={arch.id}
                          onClick={() => toggleArchetype(arch.id)}
                          aria-pressed={isSelected}
                          className={`flex min-h-20 flex-col items-center justify-center gap-0.5 py-2.5 px-1 rounded-[var(--radius-md)] border-2 transition-[transform,background-color,border-color,opacity,box-shadow] duration-150 text-center cursor-pointer active:scale-[0.97] lg:min-h-32 lg:gap-3 lg:py-5 ${FOCUS_RING} ${
                            isSelected ? 'shadow-[var(--shadow-card)]' : 'border-line bg-surface-2 opacity-55 hover:opacity-80'
                          }`}
                          style={isSelected ? { borderColor: arch.color, backgroundColor: arch.color + '18' } : {}}
                        >
                          <span
                            className="grid place-items-center w-7 h-7 rounded-full lg:h-12 lg:w-12"
                            style={{ color: isSelected ? arch.color : 'var(--color-ink-faint)' }}
                          >
                            <ArchetypeGlyph id={arch.id} size={32} strokeWidth={2.4} />
                          </span>
                          <span
                            className="text-[10px] font-semibold leading-tight mt-0.5 lg:text-lg xl:text-xl"
                            style={{ color: isSelected ? 'var(--color-ink)' : 'var(--color-ink-faint)' }}
                          >
                            {t(arch.nameKey)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-[var(--radius-md)] bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700 lg:mt-4 lg:text-base">
                  {t('wheel.allPoolSummary', { count: ARCHETYPES.length })}
                </p>
              )}
            </Card>

            {/* Duplicates toggle */}
            <Card className="p-4 lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink lg:text-xl">{t('wheel.allowDuplicates')}</p>
                  <p className="text-xs text-ink-muted mt-0.5 lg:text-base">{t('wheel.allowDuplicatesHint')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowDuplicates((d) => !d)}
                  role="switch"
                  aria-checked={allowDuplicates}
                  aria-label={t('wheel.allowDuplicates')}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${FOCUS_RING} ${
                    allowDuplicates ? 'bg-brand-400' : 'bg-surface-3'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform duration-150 ease-[var(--ease-out)] ${
                      allowDuplicates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Warning: not enough archetypes */}
            {selectedPlayers !== null &&
              !allowDuplicates &&
              selectedArchetypes.length < selectedPlayers &&
              selectedArchetypes.length > 0 && (
                <p className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-[var(--radius-md)] px-3 py-2 text-center">
                  {t('wheel.notEnoughWarning')}
                </p>
              )}

            <Button size="lg" fullWidth disabled={!canStart} onClick={handleStart}>
              <IconWheel size={20} />
              {t('wheel.startSession')}
            </Button>
          </div>
        )}

        {/* ── Spinning ────────────────────────────────────────────────────── */}
        {phase === 'spinning' && (
          <div className="flex flex-col items-center gap-5 animate-fade-slide-up">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between w-full">
                <Badge color="feature" className="text-sm px-3 py-1">
                  {t('wheel.player', { number: currentPlayerNumber })}
                </Badge>
                <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-bold tabular-nums text-ink-muted">
                  {assignedResults.length}/{totalPlayers}
                </span>
              </div>
              {assignedResults.length > 0 && (
                <div className="flex justify-end">
                  <ViewResultsLink label={t('wheel.viewResults')} onClick={showResults} />
                </div>
              )}
            </div>

            <div className="relative -mx-1 w-[calc(100%+0.5rem)] rounded-[var(--radius-xl)] bg-[color-mix(in_oklch,var(--color-brand-50)_68%,var(--color-surface))] px-2 py-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <WheelCanvas
                archetypes={remainingArchetypes}
                onSpinComplete={handleSpinComplete}
                triggerSpin={triggerSpin}
              />
            </div>

            <div className="w-full space-y-2">
              <p className="text-center text-xs font-medium text-ink-muted">
                {t('wheel.remainingLabel', { count: remainingArchetypes.length })}
              </p>

              <Button size="xl" onClick={() => { haptics.spin(); setTriggerSpin(true); }} disabled={triggerSpin} fullWidth>
                <IconWheel size={22} />
                {triggerSpin ? t('wheel.spinning') : t('wheel.spinButton')}
              </Button>
            </div>
          </div>
        )}

        {/* ── Reveal ──────────────────────────────────────────────────────── */}
        {phase === 'reveal' && lastWinner && (
          <div className="flex flex-col items-center gap-5 animate-pop-in">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-ink-muted">
                {t('wheel.resultLabel', { number: assignedResults.length })} {t('wheel.gets')}
              </p>
              <ViewResultsLink label={t('wheel.viewResults')} onClick={showResults} />
            </div>

            <div
              className="relative w-full overflow-hidden rounded-[var(--radius-lg)] border-2 border-ink bg-surface p-6 text-center shadow-[var(--shadow-hard)]"
              aria-live="polite"
            >
              <div
                className="absolute inset-x-0 top-0 h-2"
                style={{ backgroundColor: lastWinner.color }}
              />
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[var(--shadow-pop)]"
                style={{ backgroundColor: lastWinner.color + '22', border: `3px solid ${lastWinner.color}`, color: lastWinner.color }}
              >
                <ArchetypeGlyph id={lastWinner.id} size={40} strokeWidth={2.4} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: lastWinner.color }}>
                {t(lastWinner.nameKey)}
              </h2>
              <p className="text-ink-muted text-sm text-pretty">{t(lastWinner.descriptionKey)}</p>
            </div>

            {allAssigned ? (
              <Button size="lg" onClick={showResults} fullWidth>
                <IconSparkles size={20} />
                {t('wheel.allDoneButton')}
              </Button>
            ) : (
              <Button size="lg" onClick={nextPlayer} fullWidth>
                {t('wheel.nextButton')}
              </Button>
            )}

            <button
              type="button"
              onClick={reroll}
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-ink-muted hover:text-brand-600 transition-colors cursor-pointer ${FOCUS_RING}`}
            >
              <IconRefresh size={14} />
              {t('wheel.rerollButton')}
            </button>
          </div>
        )}

        {/* ── Results / Leaderboard ───────────────────────────────────────── */}
        {phase === 'done' && (
          <div className="animate-fade-slide-up space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-ink">{t('wheel.allDoneTitle')}</h2>
                <p className="text-sm text-ink-muted">{t('wheel.allDoneSubtitle')}</p>
              </div>
              <span className="grid place-items-center w-11 h-11 rounded-[var(--radius-md)] bg-brand-100 text-brand-600">
                <IconSparkles size={22} />
              </span>
            </div>

            <Card className="p-4">
              <h3 className="text-sm font-bold text-ink-muted mb-3">{t('wheel.assignedTitle')}</h3>
              <div className="space-y-1.5 stagger">
                {assignedResults.map((result) => {
                  return (
                    <div
                      key={result.playerNumber}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 border border-transparent hover:border-line hover:bg-surface-2"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold tabular-nums text-ink-muted">
                        {result.playerNumber}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: result.archetype.color + '22', color: result.archetype.color }}
                      >
                        <ArchetypeGlyph id={result.archetype.id} size={20} strokeWidth={2.4} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-ink-muted">
                          {t('wheel.player', { number: result.playerNumber })}
                        </span>
                        <p className="font-semibold text-sm" style={{ color: result.archetype.color }}>
                          {t(result.archetype.nameKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3">
              {!allAssigned && (
                <Button variant="secondary" size="md" onClick={backFromResults} className="flex-1">
                  <IconArrowLeft size={16} />
                  {t('wheel.backToSpin')}
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={handleReset}
                className={allAssigned ? 'w-full' : 'flex-1'}
              >
                <IconRefresh size={16} />
                {t('wheel.resetButton')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
