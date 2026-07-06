import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DeconstructionPhaseId, DeconstructionNote, DeconstructionSession, NoteCategory } from '../types';
import {
  ACTIVE_SESSION_STORAGE_KEY,
  DECONSTRUCTION_PHASES,
  DRAFT_STORAGE_KEY,
  NOTE_CATEGORIES,
  SESSIONS_STORAGE_KEY,
} from '../data/deconstruction';

interface Draft {
  text: string;
  category: NoteCategory;
}

const EMPTY_CHARACTERS: [string, string] = ['', ''];
const EMPTY_NOTES: DeconstructionNote[] = [];
const DEFAULT_DRAFT: Draft = { text: '', category: 'scene' };

const PHASE_IDS = new Set<DeconstructionPhaseId>(DECONSTRUCTION_PHASES.map((phase) => phase.id));
const NOTE_CATEGORY_IDS = new Set<NoteCategory>(NOTE_CATEGORIES.map((category) => category.id));

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing and quota errors should not break the notebook.
  }
}

function removeStorage(key: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Private browsing and quota errors should not break the notebook.
  }
}

function parseStoredJson(key: string): unknown {
  const stored = readStorage(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPhaseId(value: unknown): value is DeconstructionPhaseId {
  return typeof value === 'string' && PHASE_IDS.has(value as DeconstructionPhaseId);
}

function isNoteCategory(value: unknown): value is NoteCategory {
  return typeof value === 'string' && NOTE_CATEGORY_IDS.has(value as NoteCategory);
}

function coerceTimestamp(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function coerceCharacters(value: unknown): [string, string] {
  if (!Array.isArray(value)) return [...EMPTY_CHARACTERS];
  return [
    typeof value[0] === 'string' ? value[0] : '',
    typeof value[1] === 'string' ? value[1] : '',
  ];
}

function coerceNote(value: unknown): DeconstructionNote | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string') return null;
  if (!isNoteCategory(value.category)) return null;
  if (typeof value.text !== 'string') return null;

  return {
    id: value.id,
    category: value.category,
    text: value.text,
    phaseId: isPhaseId(value.phaseId) ? value.phaseId : undefined,
    timestamp: coerceTimestamp(value.timestamp, Date.now()),
  };
}

function coerceCompletedPhaseIds(value: unknown): DeconstructionPhaseId[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(isPhaseId)));
}

function coerceSession(value: unknown): DeconstructionSession | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string') return null;

  const now = Date.now();
  const notes = Array.isArray(value.notes) ? value.notes.map(coerceNote).filter((note): note is DeconstructionNote => note !== null) : [];

  return {
    id: value.id,
    suggestion: typeof value.suggestion === 'string' ? value.suggestion : '',
    characters: coerceCharacters(value.characters),
    notes,
    completedPhaseIds: coerceCompletedPhaseIds(value.completedPhaseIds),
    createdAt: coerceTimestamp(value.createdAt, now),
    updatedAt: coerceTimestamp(value.updatedAt, now),
  };
}

function loadSessions(): DeconstructionSession[] {
  const stored = parseStoredJson(SESSIONS_STORAGE_KEY);
  if (!Array.isArray(stored)) return [];
  return stored.map(coerceSession).filter((session): session is DeconstructionSession => session !== null);
}

function loadActiveSessionId(): string | null {
  return readStorage(ACTIVE_SESSION_STORAGE_KEY);
}

function loadDrafts(): Record<string, Draft> {
  const stored = parseStoredJson(DRAFT_STORAGE_KEY);
  if (!isRecord(stored)) return {};

  return Object.fromEntries(
    Object.entries(stored).flatMap(([key, value]) => {
      if (!isRecord(value)) return [];
      if (typeof value.text !== 'string' || !isNoteCategory(value.category)) return [];
      return [[key, { text: value.text, category: value.category } satisfies Draft]];
    }),
  );
}

export function useDeconstruction() {
  const [sessions, setSessions] = useState<DeconstructionSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(loadActiveSessionId);
  const [activeStep, setActiveStep] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, Draft>>(loadDrafts);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );
  const effectiveActiveSessionId = activeSession?.id ?? null;

  useEffect(() => {
    writeStorage(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (effectiveActiveSessionId) {
      writeStorage(ACTIVE_SESSION_STORAGE_KEY, effectiveActiveSessionId);
    } else {
      removeStorage(ACTIVE_SESSION_STORAGE_KEY);
    }
  }, [effectiveActiveSessionId]);

  useEffect(() => {
    writeStorage(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  const updateActiveSession = useCallback(
    (updater: (s: DeconstructionSession) => DeconstructionSession) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== effectiveActiveSessionId) return s;
          return { ...updater(s), updatedAt: Date.now() };
        }),
      );
    },
    [effectiveActiveSessionId],
  );

  // Derived from active session
  const suggestion = activeSession?.suggestion ?? '';
  const characters = activeSession?.characters ?? EMPTY_CHARACTERS;
  const notes = activeSession?.notes ?? EMPTY_NOTES;
  const done = useMemo(() => new Set(activeSession?.completedPhaseIds ?? []), [activeSession]);

  const setSuggestion = useCallback(
    (val: string) => updateActiveSession((s) => ({ ...s, suggestion: val })),
    [updateActiveSession],
  );

  const setCharacterName = useCallback(
    (index: 0 | 1, name: string) =>
      updateActiveSession((s) => {
        const next: [string, string] = [s.characters[0], s.characters[1]];
        next[index] = name;
        return { ...s, characters: next };
      }),
    [updateActiveSession],
  );

  const toggle = useCallback(
    (id: DeconstructionPhaseId) => {
      updateActiveSession((s) => {
        const completedPhaseIds = new Set(s.completedPhaseIds);
        if (completedPhaseIds.has(id)) completedPhaseIds.delete(id);
        else completedPhaseIds.add(id);
        return { ...s, completedPhaseIds: Array.from(completedPhaseIds) };
      });
    },
    [updateActiveSession],
  );

  const addNote = useCallback(
    (category: NoteCategory, text: string, phaseId?: DeconstructionPhaseId) => {
      const note: DeconstructionNote = {
        id: crypto.randomUUID(),
        category,
        text,
        phaseId,
        timestamp: Date.now(),
      };
      updateActiveSession((s) => ({ ...s, notes: [note, ...s.notes] }));
    },
    [updateActiveSession],
  );

  const deleteNote = useCallback(
    (id: string) =>
      updateActiveSession((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
    [updateActiveSession],
  );

  const getNotesForPhase = useCallback(
    (phaseId: DeconstructionPhaseId) => notes.filter((n) => n.phaseId === phaseId),
    [notes],
  );

  const generalNotes = useMemo(() => notes.filter((n) => !n.phaseId), [notes]);

  // Session management
  const createSession = useCallback((suggestion: string, chars: [string, string]): string => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const session: DeconstructionSession = {
      id,
      suggestion,
      characters: chars,
      notes: [],
      completedPhaseIds: [],
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setActiveStep(0);
    return id;
  }, []);

  const selectSession = useCallback((id: string) => {
    setActiveSessionId(sessions.some((s) => s.id === id) ? id : null);
    setActiveStep(0);
  }, [sessions]);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (effectiveActiveSessionId === id) setActiveSessionId(null);
      setDrafts((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (k.startsWith(`${id}:`)) delete next[k];
        });
        return next;
      });
    },
    [effectiveActiveSessionId],
  );

  // Drafts keyed by `${sessionId}:${stepKey}`
  const getDraft = useCallback(
    (stepKey: string): Draft =>
      effectiveActiveSessionId ? drafts[`${effectiveActiveSessionId}:${stepKey}`] || DEFAULT_DRAFT : DEFAULT_DRAFT,
    [drafts, effectiveActiveSessionId],
  );

  const setDraft = useCallback(
    (stepKey: string, draft: Draft) => {
      if (!effectiveActiveSessionId) return;
      setDrafts((prev) => ({ ...prev, [`${effectiveActiveSessionId}:${stepKey}`]: draft }));
    },
    [effectiveActiveSessionId],
  );

  const clearDraft = useCallback(
    (stepKey: string) => {
      if (!effectiveActiveSessionId) return;
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[`${effectiveActiveSessionId}:${stepKey}`];
        return next;
      });
    },
    [effectiveActiveSessionId],
  );

  return {
    sessions,
    activeSession,
    activeSessionId: effectiveActiveSessionId,
    createSession,
    selectSession,
    deleteSession,
    done,
    suggestion,
    setSuggestion,
    toggle,
    activeStep,
    setActiveStep,
    characters,
    setCharacterName,
    notes,
    addNote,
    deleteNote,
    getNotesForPhase,
    generalNotes,
    getDraft,
    setDraft,
    clearDraft,
  };
}
