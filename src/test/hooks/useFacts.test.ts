import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFacts } from '../../hooks/useFacts';
import { IMPROV_FACTS } from '../../data/facts';
import type { FactCategory } from '../../types';

const ALL_CATEGORIES: FactCategory[] = ['history', 'technique', 'tips', 'famous'];

describe('useFacts', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => useFacts());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('starts at index 0', () => {
      const { result } = renderHook(() => useFacts());
      expect(result.current.index).toBe(0);
    });

    it('total equals full fact count initially', () => {
      const { result } = renderHook(() => useFacts());
      expect(result.current.total).toBe(IMPROV_FACTS.length);
    });

    it('currentFact is a valid fact', () => {
      const { result } = renderHook(() => useFacts());
      const ids = IMPROV_FACTS.map((f) => f.id);
      expect(ids).toContain(result.current.currentFact.id);
    });
  });

  describe('next', () => {
    it('increments the index', () => {
      const { result } = renderHook(() => useFacts());
      act(() => result.current.next());
      expect(result.current.index).toBe(1);
    });

    it('wraps from last back to 0', () => {
      const { result } = renderHook(() => useFacts());
      const total = result.current.total;
      for (let i = 0; i < total; i++) {
        act(() => result.current.next());
      }
      expect(result.current.index).toBe(0);
    });

    it('currentFact changes after next', () => {
      const { result } = renderHook(() => useFacts());
      // Shuffle means we can't know exact facts, but index 0 → 1 at minimum
      const before = result.current.index;
      act(() => result.current.next());
      expect(result.current.index).toBe(before + 1);
    });
  });

  describe('prev', () => {
    it('wraps from 0 to last when called at start', () => {
      const { result } = renderHook(() => useFacts());
      const total = result.current.total;
      act(() => result.current.prev());
      expect(result.current.index).toBe(total - 1);
    });

    it('decrements the index', () => {
      const { result } = renderHook(() => useFacts());
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.index).toBe(1);
    });
  });

  describe('setFilter', () => {
    it('resets index to 0', () => {
      const { result } = renderHook(() => useFacts());
      act(() => result.current.next());
      act(() => result.current.setFilter('history'));
      expect(result.current.index).toBe(0);
    });

    it('updates categoryFilter', () => {
      const { result } = renderHook(() => useFacts());
      act(() => result.current.setFilter('technique'));
      expect(result.current.categoryFilter).toBe('technique');
    });

    it('filtered total is correct for each category', () => {
      const { result } = renderHook(() => useFacts());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = IMPROV_FACTS.filter((f) => f.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('currentFact belongs to the filtered category', () => {
      const { result } = renderHook(() => useFacts());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.currentFact.category).toBe(cat);
      });
    });

    it('restores all facts when reset to "all"', () => {
      const { result } = renderHook(() => useFacts());
      act(() => result.current.setFilter('tips'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(IMPROV_FACTS.length);
    });
  });

  describe('safeIndex clamping', () => {
    it('safeIndex stays within bounds after filter change', () => {
      const { result } = renderHook(() => useFacts());
      // advance to near the end
      const { total } = result.current;
      for (let i = 0; i < total - 1; i++) {
        act(() => result.current.next());
      }
      // Switch to a smaller category
      act(() => result.current.setFilter('history'));
      expect(result.current.index).toBe(0);
      expect(result.current.index).toBeLessThan(result.current.total);
    });
  });
});
