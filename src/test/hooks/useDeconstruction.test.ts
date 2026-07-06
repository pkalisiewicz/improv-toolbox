import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ACTIVE_SESSION_STORAGE_KEY, DRAFT_STORAGE_KEY, SESSIONS_STORAGE_KEY } from '../../data/deconstruction';
import { useDeconstruction } from '../../hooks/useDeconstruction';

describe('useDeconstruction', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists completed beats with the session', () => {
    const { result } = renderHook(() => useDeconstruction());

    let firstId = '';
    let secondId = '';

    act(() => {
      firstId = result.current.createSession('first show', ['Alex', 'Blair']);
    });
    act(() => {
      result.current.toggle('opening');
    });

    expect(result.current.done.has('opening')).toBe(true);

    act(() => {
      secondId = result.current.createSession('second show', ['', '']);
    });

    expect(secondId).not.toBe(firstId);
    expect(result.current.done.has('opening')).toBe(false);

    act(() => {
      result.current.selectSession(firstId);
    });

    expect(result.current.done.has('opening')).toBe(true);

    const stored = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) ?? '[]');
    expect(stored.find((session: { id: string }) => session.id === firstId)?.completedPhaseIds).toEqual(['opening']);
  });

  it('ignores malformed stored sessions and stale active session ids', () => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, '{"not":"an array"}');
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, 'missing-session');

    const { result } = renderHook(() => useDeconstruction());

    expect(result.current.sessions).toEqual([]);
    expect(result.current.activeSession).toBeNull();
  });

  it('removes drafts when deleting their session', () => {
    const { result } = renderHook(() => useDeconstruction());

    let sessionId = '';
    act(() => {
      sessionId = result.current.createSession('draft show', ['', '']);
    });
    act(() => {
      result.current.setDraft('opening', { text: 'unfinished thought', category: 'scene' });
    });

    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toContain('unfinished thought');

    act(() => {
      result.current.deleteSession(sessionId);
    });

    expect(result.current.activeSession).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).not.toContain('unfinished thought');
  });
});
