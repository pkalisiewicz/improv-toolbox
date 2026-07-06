import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { useDeconstruction } from '../hooks/useDeconstruction';
import {
  DECONSTRUCTION_PHASES,
  NOTE_CATEGORIES,
  CATEGORY_MAP,
  GROUP_LABELS,
} from '../data/deconstruction';
import {
  IconClose, IconCheck, IconPlay, IconPlus, IconChevronLeft, IconChevronRight,
  IconCharacter, IconPrompts, IconSparkles,
} from '../components/icons';
import { NoteCategoryGlyph } from '../theme/noteCategoryIcons';
import type { NoteCategory } from '../types';

interface ComposerDraft {
  sessionId: string;
  stepKey: string;
  text: string;
  category: NoteCategory;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function DeconstructionPage() {
  const { t } = useTranslation();
  const {
    sessions,
    activeSession,
    createSession,
    selectSession,
    deleteSession,
    done,
    toggle,
    activeStep,
    setActiveStep,
    addNote,
    deleteNote,
    getNotesForPhase,
    generalNotes,
    getDraft,
    setDraft,
    clearDraft,
  } = useDeconstruction();

  const [showMode, setShowMode] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);

  // New session form state
  const [formSuggestion, setFormSuggestion] = useState('');
  const [formCharacters, setFormCharacters] = useState<[string, string]>(['', '']);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [composerDraft, setComposerDraft] = useState<ComposerDraft | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const totalBeats = DECONSTRUCTION_PHASES.length;
  const completedCount = done.size;
  const isGeneralStep = activeStep === totalBeats;
  const totalSteps = totalBeats + 1;
  const currentPhase = !isGeneralStep ? DECONSTRUCTION_PHASES[activeStep] : null;
  const currentNotes = currentPhase ? getNotesForPhase(currentPhase.id) : generalNotes;

  const stepKey = currentPhase ? currentPhase.id : '_general';
  const storedDraft = getDraft(stepKey);
  const activeComposerDraft =
    activeSession &&
    composerDraft?.sessionId === activeSession.id &&
    composerDraft.stepKey === stepKey
      ? composerDraft
      : null;
  const noteText = activeComposerDraft?.text ?? storedDraft.text;
  const noteCategory = activeComposerDraft?.category ?? storedDraft.category;

  const updateComposerDraft = (text: string, category: NoteCategory) => {
    if (!activeSession) return;
    setComposerDraft({ sessionId: activeSession.id, stepKey, text, category });
    if (text || category !== 'scene') {
      setDraft(stepKey, { text, category });
    } else {
      clearDraft(stepKey);
    }
  };

  const handleAddNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed || !activeSession) return;
    addNote(noteCategory, trimmed, currentPhase?.id);
    clearDraft(stepKey);
    setComposerDraft({ sessionId: activeSession.id, stepKey, text: '', category: noteCategory });
    textareaRef.current?.focus();
  };

  const insertCharacter = (name: string) => {
    updateComposerDraft(`${noteText ? noteText + ' ' : ''}[${name}] `, 'character');
    textareaRef.current?.focus();
  };

  const saveCurrentDraft = () => {
    if (!showMode || !activeSession) return;
    if (noteText || noteCategory !== 'scene') {
      setDraft(stepKey, { text: noteText, category: noteCategory });
    } else {
      clearDraft(stepKey);
    }
  };

  const goTo = (step: number) => {
    saveCurrentDraft();
    setActiveStep(Math.max(0, Math.min(totalSteps - 1, step)));
  };

  const handleStartShow = () => {
    createSession(formSuggestion, formCharacters);
    setFormSuggestion('');
    setFormCharacters(['', '']);
    setShowMode(true);
  };

  const handleOpenSession = (id: string) => {
    selectSession(id);
    setShowMode(true);
  };

  const handleOpenSummary = (id: string) => {
    selectSession(id);
    setSummaryMode(true);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    setDeleteConfirmId(null);
    setShowMode(false);
    setSummaryMode(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY MODE
  // ═══════════════════════════════════════════════════════════════════════════
  if (summaryMode && activeSession) {
    const hasAnyNotes = activeSession.notes.length > 0;
    const sessionNotes = activeSession.notes;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-surface-2">
        <div className="shrink-0 border-b border-line bg-surface">
          <div
            className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 pb-3"
            style={{ paddingTop: 'max(0.875rem, env(safe-area-inset-top))' }}
          >
            <div className="min-w-0">
              <h2 className="text-xl font-black text-ink">{t('deconstruction.summary.title')}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-muted">
                {activeSession.suggestion && (
                  <span className="max-w-full truncate rounded-full bg-surface-3 px-2.5 py-1">
                    {activeSession.suggestion}
                  </span>
                )}
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 tabular-nums">
                  {completedCount}/{totalBeats}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSummaryMode(false)}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-bold text-ink-muted transition-colors duration-150 hover:bg-brand-50 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              <IconClose size={17} />
              {t('deconstruction.summary.close')}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-6 px-5 py-5">
            {(activeSession.characters[0] || activeSession.characters[1]) && (
              <div className="flex flex-wrap gap-2">
                {activeSession.characters.map((name, i) =>
                  name ? (
                    <div key={i} className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2">
                      <IconCharacter size={16} className="text-brand-700" />
                      <span className="text-sm font-semibold text-brand-700">{name}</span>
                    </div>
                  ) : null,
                )}
              </div>
            )}

            {!hasAnyNotes && (
              <div className="grid min-h-[14rem] place-items-center rounded-[var(--radius-xl)] border border-dashed border-line bg-surface px-6 py-10 text-center shadow-[var(--shadow-card)]">
                <div>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                    <IconPrompts size={22} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink-muted">{t('deconstruction.summary.empty')}</p>
                </div>
              </div>
            )}

            {NOTE_CATEGORIES.map((cat) => {
              const catNotes = sessionNotes.filter((n) => n.category === cat.id);
              if (catNotes.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                      <NoteCategoryGlyph id={cat.id} size={17} />
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
                      {t(cat.labelKey)}
                    </h3>
                    <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs font-bold text-ink-muted">
                      {catNotes.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {catNotes.map((note) => {
                      const phaseDef = note.phaseId
                        ? DECONSTRUCTION_PHASES.find((p) => p.id === note.phaseId)
                        : null;
                      return (
                        <div key={note.id} className="rounded-[var(--radius-lg)] border border-line bg-surface px-4 py-3.5 shadow-[var(--shadow-card)]">
                          <p className="text-base leading-relaxed whitespace-pre-wrap break-words text-ink">
                            {note.text}
                          </p>
                          {phaseDef && (
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ink-muted">
                              {t(phaseDef.labelKey)}
                              {done.has(phaseDef.id) && <IconCheck size={12} className="text-brand-600" />}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOW MODE
  // ═══════════════════════════════════════════════════════════════════════════
  if (showMode && activeSession) {
    const isDeconstruct = currentPhase?.type === 'deconstruct';
    const phaseIsDone = currentPhase ? done.has(currentPhase.id) : false;
    const stepTitle = currentPhase ? t(currentPhase.labelKey) : t('deconstruction.notes.general');
    const [stepName, stepMeta] = stepTitle.split(' · ');
    const stepContext = currentPhase ? t(GROUP_LABELS[currentPhase.group]) : t('deconstruction.summary.title');
    const stepHint = currentPhase ? t(currentPhase.tipKey) : t('deconstruction.notes.generalHint');

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-ink-fill text-on-ink">
        <div className="shrink-0 border-b border-white/10 bg-ink-fill/95">
          <div
            className="mx-auto max-w-6xl px-4 pb-3 lg:px-8"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <div className="flex min-h-11 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-bold tabular-nums text-on-ink">
                  {activeStep + 1} / {totalSteps}
                </span>
                {activeSession.suggestion && (
                  <span className="min-w-0 truncate text-sm font-semibold text-on-ink-muted">
                    {activeSession.suggestion}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => setSummaryMode(true)}
                  className="min-h-11 rounded-[var(--radius-md)] px-3 text-sm font-bold text-on-ink-muted transition-colors duration-150 hover:bg-white/8 hover:text-on-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-fill)]"
                >
                  {t('deconstruction.summary.open')}
                </button>
                <button
                  onClick={() => setShowMode(false)}
                  aria-label={t('deconstruction.summary.close')}
                  className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] text-on-ink-muted transition-colors duration-150 hover:bg-white/8 hover:text-on-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-fill)]"
                >
                  <IconClose size={20} />
                </button>
              </div>
            </div>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: totalSteps }, (_, i) => {
                const isDoneStep = i < totalBeats && done.has(DECONSTRUCTION_PHASES[i].id);
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Step ${i + 1}`}
                    className="group flex h-7 flex-1 items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-fill)]"
                  >
                    <span
                      className={`h-2 w-full rounded-full transition-all duration-200 ease-[var(--ease-out)] ${
                        i === activeStep
                          ? 'bg-brand-400'
                          : isDoneStep
                          ? 'bg-brand-500/55'
                          : 'bg-white/14 group-hover:bg-white/24'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.72fr)] lg:px-8 lg:py-6">
            <section className="rounded-[var(--radius-xl)] border border-white/12 bg-white/[0.045] p-4 shadow-[var(--shadow-float)] lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-300">
                    {stepContext}
                  </p>
                  <h2 className="text-4xl font-black leading-none text-on-ink lg:text-6xl">
                    {stepName}
                  </h2>
                  {stepMeta && (
                    <p className="mt-3 inline-flex rounded-full border border-brand-300/35 bg-brand-400/14 px-3 py-1 text-sm font-bold text-brand-100">
                      {stepMeta}
                    </p>
                  )}
                </div>
                {currentPhase && (
                  <button
                    onClick={() => toggle(currentPhase.id)}
                    aria-pressed={phaseIsDone}
                    className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-md)] border px-4 text-sm font-bold transition-all duration-150 ease-[var(--ease-out)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-fill)] ${
                      phaseIsDone
                        ? 'border-brand-400 bg-brand-400 text-ink'
                        : 'border-white/15 bg-white/6 text-on-ink hover:border-brand-300 hover:bg-white/10'
                    }`}
                  >
                    {phaseIsDone && <IconCheck size={17} />}
                    {phaseIsDone ? t('deconstruction.show.done') : t('deconstruction.show.markDone')}
                  </button>
                )}
              </div>

              <div
                className={`mt-5 rounded-[var(--radius-lg)] border px-4 py-4 lg:px-5 ${
                  isDeconstruct
                    ? 'border-brand-400/35 bg-brand-400/16'
                    : 'border-white/12 bg-white/[0.055]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-400 text-ink">
                    <IconSparkles size={19} />
                  </span>
                  <p className="max-w-[72ch] text-base font-semibold leading-relaxed text-on-ink lg:text-lg">
                    {stepHint}
                  </p>
                </div>
              </div>

              {(activeSession.characters[0] || activeSession.characters[1]) && (
                <div className="hidden flex-wrap gap-2 sm:mt-4 sm:flex">
                  {activeSession.characters.map((name, i) =>
                    name ? (
                      <button
                        key={`stage-char-${i}`}
                        onClick={() => insertCharacter(name)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-300/35 bg-brand-400/14 px-3 text-sm font-bold text-brand-100 transition-colors duration-150 hover:bg-brand-400/22 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-fill)]"
                      >
                        <IconCharacter size={15} />
                        {name}
                      </button>
                    ) : null,
                  )}
                </div>
              )}
            </section>

            <section className="min-h-[16rem] overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface text-ink shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    {t('deconstruction.sessions.noteCount', { count: currentNotes.length })}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {stepTitle}
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                  <IconPrompts size={20} />
                </span>
              </div>

              <div className="stagger space-y-2 p-3">
                {currentNotes.length === 0 ? (
                  <div className="grid min-h-[11rem] place-items-center rounded-[var(--radius-lg)] border border-dashed border-line bg-surface-3 px-5 py-8 text-center">
                    <div>
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                        <IconPlus size={22} />
                      </span>
                      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
                        {t('deconstruction.notes.empty')}
                      </p>
                    </div>
                  </div>
                ) : (
                  currentNotes.map((note) => {
                    const cat = CATEGORY_MAP[note.category];
                    return (
                      <div
                        key={note.id}
                        className="rounded-[var(--radius-lg)] border border-line bg-surface-2 px-4 py-3.5 shadow-[var(--shadow-card)]"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                            <NoteCategoryGlyph id={cat.id} size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                              {t(cat.labelKey)}
                            </p>
                            <p className="text-base leading-relaxed whitespace-pre-wrap break-words text-ink">
                              {note.text}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteNote(note.id)}
                            aria-label={t('deconstruction.sessions.delete')}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-md)] text-ink-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                          >
                            <IconClose size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>

        <div
          className="shrink-0 border-t border-line bg-surface text-ink shadow-[0_-18px_38px_-28px_rgba(16,34,26,0.55)]"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto max-w-6xl px-4 pt-3 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {activeSession.characters.map((name, i) =>
                name ? (
                  <button
                    key={`char-${i}`}
                    onClick={() => insertCharacter(name)}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 text-sm font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                  >
                    <IconCharacter size={15} />
                    {name}
                  </button>
                ) : null,
              )}
              {NOTE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={noteCategory === cat.id}
                  onClick={() => updateComposerDraft(noteText, cat.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-bold transition-all duration-150 ease-[var(--ease-out)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                    noteCategory === cat.id
                      ? 'border-ink bg-ink-fill text-on-ink'
                      : 'border-line bg-surface-2 text-ink-muted hover:border-brand-300 hover:bg-brand-50 hover:text-ink'
                  }`}
                >
                  <NoteCategoryGlyph id={cat.id} size={15} />
                  {t(cat.labelKey)}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2 pb-3">
              <textarea
                ref={textareaRef}
                value={noteText}
                onChange={(e) => updateComposerDraft(e.target.value, noteCategory)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                placeholder={t('deconstruction.notes.placeholder')}
                rows={2}
                className="min-h-16 flex-1 resize-none rounded-[var(--radius-lg)] border border-line bg-surface-2 px-4 py-3 text-base leading-relaxed text-ink outline-none placeholder-ink-muted transition-colors duration-150 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                aria-label={t('deconstruction.notes.add')}
                className="inline-flex min-h-16 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-brand-400 px-4 text-sm font-bold text-ink transition-all duration-150 ease-[var(--ease-out)] hover:bg-brand-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-brand-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] sm:min-w-28"
              >
                <IconPlus size={18} />
                <span className="hidden sm:inline">{t('deconstruction.notes.add')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-line py-3">
              <button
                onClick={() => goTo(activeStep - 1)}
                disabled={activeStep === 0}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-surface-3 px-4 text-sm font-bold text-ink-muted transition-colors duration-150 hover:bg-brand-50 hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-surface-3 disabled:hover:text-ink-muted cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                <IconChevronLeft size={17} />
                {t('deconstruction.stepper.prev')}
              </button>
              <button
                onClick={() => goTo(activeStep + 1)}
                disabled={activeStep === totalSteps - 1}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-ink bg-brand-500 px-4 text-sm font-black text-ink shadow-[var(--shadow-hard)] transition-[transform,background-color,box-shadow] duration-150 ease-[var(--ease-out)] hover:bg-brand-400 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-35 disabled:shadow-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
              >
                {t('deconstruction.stepper.next')}
                <IconChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SETUP MODE — session list + new session form
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <PageContainer feature="deconstruction">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader feature="deconstruction" title={t('deconstruction.title')} subtitle={t('deconstruction.subtitle')} />

        {/* Past sessions list */}
        {sessions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
              {t('deconstruction.sessions.title')}
            </p>
            <div className="stagger space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-card)] p-4 space-y-3"
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-base leading-tight break-words [overflow-wrap:anywhere]">
                        {session.suggestion || t('deconstruction.sessions.untitled')}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        {session.characters[0] && (
                          <span className="inline-flex items-center gap-1 text-xs text-brand-700">
                            <IconCharacter size={12} />
                            {session.characters[0]}
                          </span>
                        )}
                        {session.characters[1] && (
                          <span className="inline-flex items-center gap-1 text-xs text-brand-700">
                            <IconCharacter size={12} />
                            {session.characters[1]}
                          </span>
                        )}
                        <span className="text-xs text-ink-muted">
                          {t('deconstruction.sessions.noteCount', { count: session.notes.length })}
                        </span>
                        <span className="text-xs text-ink-muted">·</span>
                        <span className="text-xs text-ink-muted">{timeAgo(session.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Delete */}
                    {deleteConfirmId === session.id ? (
                      <div className="flex gap-1.5 shrink-0">
                        <Button variant="danger" size="sm" onClick={() => handleDeleteSession(session.id)}>
                          {t('deconstruction.notes.confirmYes')}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                          {t('deconstruction.notes.confirmNo')}
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(session.id)}
                        aria-label={t('deconstruction.sessions.deleteConfirm')}
                        className="shrink-0 grid place-items-center w-7 h-7 rounded-[var(--radius-md)] text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400"
                      >
                        <IconClose size={16} />
                      </button>
                    )}
                  </div>

                  {/* Confirm text */}
                  {deleteConfirmId === session.id && (
                    <p className="text-xs text-red-500">{t('deconstruction.sessions.deleteConfirm')}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="md" onClick={() => handleOpenSummary(session.id)} className="flex-1">
                      {t('deconstruction.summary.open')}
                    </Button>
                    <Button size="md" onClick={() => handleOpenSession(session.id)} className="flex-1">
                      <IconPlay size={16} />
                      {t('deconstruction.sessions.open')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── New session form ─── */}
        <div className={sessions.length > 0 ? 'pt-2 border-t border-line' : ''}>
          {sessions.length > 0 && (
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4 mt-4">
              {t('deconstruction.setup.newSession')}
            </p>
          )}

          {/* Suggestion */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                {t('deconstruction.suggestion')}
              </label>
              <input
                type="text"
                value={formSuggestion}
                onChange={(e) => setFormSuggestion(e.target.value)}
                placeholder={t('deconstruction.suggestionPlaceholder')}
                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-line text-base outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 bg-surface"
              />
            </div>

            {/* Characters */}
            <div>
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                {t('deconstruction.characters.label')}
              </label>
              <div className="space-y-3">
                {([0, 1] as const).map((i) => (
                  <div
                    key={i}
                    className={`rounded-[var(--radius-lg)] border-2 p-4 transition-all ${
                      formCharacters[i] ? 'border-brand-300 bg-brand-50' : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[var(--radius-md)] grid place-items-center text-lg ${
                        formCharacters[i] ? 'bg-brand-100' : 'bg-brand-50'
                      }`}>
                        <IconCharacter size={20} className="text-brand-700" />
                      </div>
                      <input
                        type="text"
                        value={formCharacters[i]}
                        onChange={(e) => {
                          const next: [string, string] = [formCharacters[0], formCharacters[1]];
                          next[i] = e.target.value;
                          setFormCharacters(next);
                        }}
                        placeholder={t('deconstruction.characters.placeholder', { number: i + 1 })}
                        className="flex-1 min-w-0 text-base font-semibold outline-none bg-transparent text-ink placeholder-ink-muted"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-muted mt-2">{t('deconstruction.characters.hint')}</p>
            </div>

            {/* Note type preview */}
            <div>
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                {t('deconstruction.setup.noteTypes')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {NOTE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-[var(--radius-lg)] border border-line bg-surface px-3 py-3 text-center shadow-[var(--shadow-card)]"
                  >
                    <span className="mx-auto grid h-8 w-8 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-700">
                      <NoteCategoryGlyph id={cat.id} size={20} />
                    </span>
                    <p className="mt-1 text-xs font-bold text-ink">{t(cat.labelKey)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button size="xl" fullWidth onClick={handleStartShow}>
              <IconPlay size={20} />
              {t('deconstruction.setup.startShow')}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
