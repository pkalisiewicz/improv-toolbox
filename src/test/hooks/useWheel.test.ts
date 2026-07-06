import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWheel } from '../../hooks/useWheel';
import { ARCHETYPES } from '../../data/archetypes';
import type { Archetype } from '../../types';

const SAMPLE: Archetype[] = ARCHETYPES.slice(0, 4);

describe('useWheel', () => {
  describe('initial state', () => {
    it('starts in setup phase', () => {
      const { result } = renderHook(() => useWheel());
      expect(result.current.phase).toBe('setup');
    });

    it('starts with zero players', () => {
      const { result } = renderHook(() => useWheel());
      expect(result.current.totalPlayers).toBe(0);
    });

    it('starts with no assigned results', () => {
      const { result } = renderHook(() => useWheel());
      expect(result.current.assignedResults).toHaveLength(0);
    });

    it('starts with no last winner', () => {
      const { result } = renderHook(() => useWheel());
      expect(result.current.lastWinner).toBeNull();
    });
  });

  describe('startSession', () => {
    it('transitions phase to spinning', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      expect(result.current.phase).toBe('spinning');
    });

    it('sets totalPlayers correctly', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(5, SAMPLE, false));
      expect(result.current.totalPlayers).toBe(5);
    });

    it('shuffles the archetype pool (same elements)', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      expect(result.current.remainingArchetypes).toHaveLength(SAMPLE.length);
      const ids = result.current.remainingArchetypes.map((a) => a.id).sort();
      expect(ids).toEqual(SAMPLE.map((a) => a.id).sort());
    });

    it('clears assigned results', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(2, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.startSession(2, SAMPLE, false));
      expect(result.current.assignedResults).toHaveLength(0);
    });
  });

  describe('resolveSpinResult', () => {
    it('transitions to reveal phase', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.phase).toBe('reveal');
    });

    it('assigns a result to a player', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.assignedResults).toHaveLength(1);
      expect(result.current.assignedResults[0].playerNumber).toBe(1);
    });

    it('removes winner from pool when duplicates disallowed', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      const winnerBefore = result.current.remainingArchetypes[0];
      act(() => result.current.resolveSpinResult(0));
      const ids = result.current.remainingArchetypes.map((a) => a.id);
      expect(ids).not.toContain(winnerBefore.id);
      expect(result.current.remainingArchetypes).toHaveLength(SAMPLE.length - 1);
    });

    it('keeps pool intact when duplicates allowed', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, true));
      const poolSizeBefore = result.current.remainingArchetypes.length;
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.remainingArchetypes).toHaveLength(poolSizeBefore);
    });

    it('sets lastWinner', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      const expected = result.current.remainingArchetypes[0];
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.lastWinner?.id).toBe(expected.id);
    });

    it('wraps winnerIndex with modulo', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      const pool = result.current.remainingArchetypes;
      const winnerIndex = pool.length + 1;
      // Winner should be pool[(pool.length + 1) % pool.length]
      const expected = pool[winnerIndex % pool.length];
      act(() => result.current.resolveSpinResult(winnerIndex));
      expect(result.current.lastWinner?.id).toBe(expected.id);
    });

    it('does nothing when pool is empty', () => {
      const { result } = renderHook(() => useWheel());
      // no session started, remainingArchetypes is empty
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.assignedResults).toHaveLength(0);
    });

    it('increments playerNumber with each spin', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.nextPlayer());
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.assignedResults[1].playerNumber).toBe(2);
    });
  });

  describe('nextPlayer', () => {
    it('transitions from reveal back to spinning', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      expect(result.current.phase).toBe('reveal');
      act(() => result.current.nextPlayer());
      expect(result.current.phase).toBe('spinning');
    });

    it('clears lastWinner', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.nextPlayer());
      expect(result.current.lastWinner).toBeNull();
    });

    it('does not transition when not in reveal phase', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(2, SAMPLE, false));
      // phase is 'spinning', nextPlayer should be a no-op
      act(() => result.current.nextPlayer());
      expect(result.current.phase).toBe('spinning');
    });
  });

  describe('reroll', () => {
    it('restores winner to pool when duplicates disallowed', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      const poolBefore = [...result.current.remainingArchetypes];
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.reroll());
      expect(result.current.remainingArchetypes).toHaveLength(poolBefore.length);
    });

    it('removes last assignment from results', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.reroll());
      expect(result.current.assignedResults).toHaveLength(0);
    });

    it('goes back to spinning phase', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.reroll());
      expect(result.current.phase).toBe('spinning');
    });

    it('is a no-op when there is no lastWinner', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      // do not resolve spin — lastWinner is null
      act(() => result.current.reroll());
      expect(result.current.assignedResults).toHaveLength(0);
      expect(result.current.phase).toBe('spinning');
    });

    it('does not re-add winner to pool when duplicates allowed', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, true));
      const poolSize = result.current.remainingArchetypes.length;
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.reroll());
      expect(result.current.remainingArchetypes).toHaveLength(poolSize);
    });
  });

  describe('showResults / backFromResults', () => {
    it('showResults transitions to done phase', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.showResults());
      expect(result.current.phase).toBe('done');
    });

    it('backFromResults goes to spinning when not all assigned', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.showResults());
      act(() => result.current.backFromResults());
      // 0 assigned < 3 total → spinning
      expect(result.current.phase).toBe('spinning');
    });

    it('backFromResults goes to reveal when all assigned', () => {
      const twoArchetypes = SAMPLE.slice(0, 2);
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(2, twoArchetypes, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.nextPlayer());
      act(() => result.current.resolveSpinResult(0));
      // 2 assigned === 2 total
      act(() => result.current.showResults());
      act(() => result.current.backFromResults());
      expect(result.current.phase).toBe('reveal');
    });
  });

  describe('reset', () => {
    it('resets to initial state', () => {
      const { result } = renderHook(() => useWheel());
      act(() => result.current.startSession(3, SAMPLE, false));
      act(() => result.current.resolveSpinResult(0));
      act(() => result.current.reset());
      expect(result.current.phase).toBe('setup');
      expect(result.current.totalPlayers).toBe(0);
      expect(result.current.assignedResults).toHaveLength(0);
      expect(result.current.remainingArchetypes).toHaveLength(0);
      expect(result.current.lastWinner).toBeNull();
    });
  });
});
