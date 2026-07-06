import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConstraints } from '../../hooks/useConstraints';
import { SCENE_CONSTRAINTS } from '../../data/constraints';
import type { ConstraintCategory } from '../../types';

const ALL_CATEGORIES: ConstraintCategory[] = ['speech', 'physical', 'structural', 'relational'];

describe('useConstraints', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => useConstraints());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('starts at index 0', () => {
      const { result } = renderHook(() => useConstraints());
      expect(result.current.index).toBe(0);
    });

    it('total equals full constraint count initially', () => {
      const { result } = renderHook(() => useConstraints());
      expect(result.current.total).toBe(SCENE_CONSTRAINTS.length);
    });

    it('current constraint is valid', () => {
      const { result } = renderHook(() => useConstraints());
      const ids = SCENE_CONSTRAINTS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('next', () => {
    it('increments the index', () => {
      const { result } = renderHook(() => useConstraints());
      act(() => result.current.next());
      expect(result.current.index).toBe(1);
    });

    it('wraps from last back to 0', () => {
      const { result } = renderHook(() => useConstraints());
      const total = result.current.total;
      for (let i = 0; i < total; i++) {
        act(() => result.current.next());
      }
      expect(result.current.index).toBe(0);
    });
  });

  describe('prev', () => {
    it('wraps from 0 to last', () => {
      const { result } = renderHook(() => useConstraints());
      const total = result.current.total;
      act(() => result.current.prev());
      expect(result.current.index).toBe(total - 1);
    });

    it('decrements the index', () => {
      const { result } = renderHook(() => useConstraints());
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.index).toBe(1);
    });
  });

  describe('setFilter', () => {
    it('resets index to 0', () => {
      const { result } = renderHook(() => useConstraints());
      act(() => result.current.next());
      act(() => result.current.setFilter('speech'));
      expect(result.current.index).toBe(0);
    });

    it('updates categoryFilter', () => {
      const { result } = renderHook(() => useConstraints());
      act(() => result.current.setFilter('physical'));
      expect(result.current.categoryFilter).toBe('physical');
    });

    it('total matches filtered count for each category', () => {
      const { result } = renderHook(() => useConstraints());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = SCENE_CONSTRAINTS.filter((c) => c.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('current constraint belongs to the filtered category', () => {
      const { result } = renderHook(() => useConstraints());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => useConstraints());
      act(() => result.current.setFilter('structural'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(SCENE_CONSTRAINTS.length);
    });
  });

  describe('safeIndex clamping', () => {
    it('index stays within bounds after filter reduces pool', () => {
      const { result } = renderHook(() => useConstraints());
      // Move close to end
      const total = result.current.total;
      for (let i = 0; i < total - 1; i++) {
        act(() => result.current.next());
      }
      act(() => result.current.setFilter('speech'));
      expect(result.current.index).toBe(0);
    });
  });
});
