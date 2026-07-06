import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReplay } from '../../hooks/useReplay';
import { REPLAY_CARDS } from '../../data/replay';
import type { ReplayCategory } from '../../types';

const ALL_CATEGORIES: ReplayCategory[] = ['physicality', 'genre', 'emotional', 'structural', 'character'];

describe('useReplay', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => useReplay());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('starts at index 0', () => {
      const { result } = renderHook(() => useReplay());
      expect(result.current.index).toBe(0);
    });

    it('total equals full card count', () => {
      const { result } = renderHook(() => useReplay());
      expect(result.current.total).toBe(REPLAY_CARDS.length);
    });

    it('current card is valid', () => {
      const { result } = renderHook(() => useReplay());
      const ids = REPLAY_CARDS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('next', () => {
    it('increments index', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.next());
      expect(result.current.index).toBe(1);
    });

    it('wraps from last to 0', () => {
      const { result } = renderHook(() => useReplay());
      const total = result.current.total;
      for (let i = 0; i < total; i++) act(() => result.current.next());
      expect(result.current.index).toBe(0);
    });
  });

  describe('prev', () => {
    it('wraps from 0 to last', () => {
      const { result } = renderHook(() => useReplay());
      const total = result.current.total;
      act(() => result.current.prev());
      expect(result.current.index).toBe(total - 1);
    });
  });

  describe('random', () => {
    it('resets index to 0', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.next());
      act(() => result.current.random());
      expect(result.current.index).toBe(0);
    });

    it('current card is still valid after random shuffle', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.random());
      const ids = REPLAY_CARDS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });

    it('total remains unchanged after random', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.random());
      expect(result.current.total).toBe(REPLAY_CARDS.length);
    });
  });

  describe('setFilter', () => {
    it('updates categoryFilter', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.setFilter('genre'));
      expect(result.current.categoryFilter).toBe('genre');
    });

    it('resets index to 0', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.next());
      act(() => result.current.setFilter('emotional'));
      expect(result.current.index).toBe(0);
    });

    it('total matches category count', () => {
      const { result } = renderHook(() => useReplay());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = REPLAY_CARDS.filter((c) => c.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('current card belongs to filtered category', () => {
      const { result } = renderHook(() => useReplay());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => useReplay());
      act(() => result.current.setFilter('structural'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(REPLAY_CARDS.length);
    });
  });
});
