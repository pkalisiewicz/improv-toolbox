import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVariants } from '../../hooks/useVariants';
import { GAME_MODIFIERS } from '../../data/modifiers';
import type { ModifierCategory } from '../../types';

const ALL_CATEGORIES: ModifierCategory[] = ['restriction', 'role', 'format', 'constraint'];

describe('useVariants', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => useVariants());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('current modifier is from the full pool', () => {
      const { result } = renderHook(() => useVariants());
      const ids = GAME_MODIFIERS.map((m) => m.id);
      expect(ids).toContain(result.current.current.id);
    });

    it('total equals full modifier count initially', () => {
      const { result } = renderHook(() => useVariants());
      expect(result.current.total).toBe(GAME_MODIFIERS.length);
    });
  });

  describe('setFilter', () => {
    it('updates categoryFilter', () => {
      const { result } = renderHook(() => useVariants());
      act(() => result.current.setFilter('role'));
      expect(result.current.categoryFilter).toBe('role');
    });

    it('immediately updates current to a modifier from the new category', () => {
      const { result } = renderHook(() => useVariants());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('total matches filtered count', () => {
      const { result } = renderHook(() => useVariants());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = GAME_MODIFIERS.filter((m) => m.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => useVariants());
      act(() => result.current.setFilter('format'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(GAME_MODIFIERS.length);
    });
  });

  describe('randomize', () => {
    it('current modifier stays within the filtered category', () => {
      const { result } = renderHook(() => useVariants());
      act(() => result.current.setFilter('restriction'));
      act(() => result.current.randomize());
      expect(result.current.current.category).toBe('restriction');
    });

    it('picks from full pool when category is "all"', () => {
      const { result } = renderHook(() => useVariants());
      act(() => result.current.randomize());
      const ids = GAME_MODIFIERS.map((m) => m.id);
      expect(ids).toContain(result.current.current.id);
    });
  });
});
