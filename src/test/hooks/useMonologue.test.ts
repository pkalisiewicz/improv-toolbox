import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMonologue } from '../../hooks/useMonologue';
import { MONOLOGUE_SEEDS } from '../../data/monologue';
import type { MonologueCategory } from '../../types';

const ALL_CATEGORIES: MonologueCategory[] = [
  'embarrassment', 'surprise', 'pride', 'fear', 'childhood', 'work', 'relationships',
];

describe('useMonologue', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => useMonologue());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('starts at index 0', () => {
      const { result } = renderHook(() => useMonologue());
      expect(result.current.index).toBe(0);
    });

    it('total equals full seed count', () => {
      const { result } = renderHook(() => useMonologue());
      expect(result.current.total).toBe(MONOLOGUE_SEEDS.length);
    });

    it('current seed is valid', () => {
      const { result } = renderHook(() => useMonologue());
      const ids = MONOLOGUE_SEEDS.map((s) => s.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('next', () => {
    it('increments index', () => {
      const { result } = renderHook(() => useMonologue());
      act(() => result.current.next());
      expect(result.current.index).toBe(1);
    });

    it('wraps around from last to 0', () => {
      const { result } = renderHook(() => useMonologue());
      const total = result.current.total;
      for (let i = 0; i < total; i++) act(() => result.current.next());
      expect(result.current.index).toBe(0);
    });
  });

  describe('prev', () => {
    it('wraps from 0 to last', () => {
      const { result } = renderHook(() => useMonologue());
      const total = result.current.total;
      act(() => result.current.prev());
      expect(result.current.index).toBe(total - 1);
    });
  });

  describe('setFilter', () => {
    it('updates categoryFilter', () => {
      const { result } = renderHook(() => useMonologue());
      act(() => result.current.setFilter('fear'));
      expect(result.current.categoryFilter).toBe('fear');
    });

    it('resets index to 0', () => {
      const { result } = renderHook(() => useMonologue());
      act(() => result.current.next());
      act(() => result.current.setFilter('work'));
      expect(result.current.index).toBe(0);
    });

    it('total matches category count', () => {
      const { result } = renderHook(() => useMonologue());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = MONOLOGUE_SEEDS.filter((s) => s.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('current seed belongs to filtered category', () => {
      const { result } = renderHook(() => useMonologue());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => useMonologue());
      act(() => result.current.setFilter('pride'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(MONOLOGUE_SEEDS.length);
    });
  });
});
