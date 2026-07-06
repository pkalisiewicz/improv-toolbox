import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePrinciples } from '../../hooks/usePrinciples';
import { IMPROV_PRINCIPLES } from '../../data/principles';
import type { PrincipleCategory } from '../../types';

const ALL_CATEGORIES: PrincipleCategory[] = ['foundation', 'character', 'status', 'editing', 'ensemble', 'stagecraft'];

describe('usePrinciples', () => {
  describe('initial state', () => {
    it('starts with category filter "all"', () => {
      const { result } = renderHook(() => usePrinciples());
      expect(result.current.categoryFilter).toBe('all');
    });

    it('starts at index 0', () => {
      const { result } = renderHook(() => usePrinciples());
      expect(result.current.index).toBe(0);
    });

    it('total equals full principle count', () => {
      const { result } = renderHook(() => usePrinciples());
      expect(result.current.total).toBe(IMPROV_PRINCIPLES.length);
    });

    it('current principle is valid', () => {
      const { result } = renderHook(() => usePrinciples());
      const ids = IMPROV_PRINCIPLES.map((p) => p.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('next', () => {
    it('increments index', () => {
      const { result } = renderHook(() => usePrinciples());
      act(() => result.current.next());
      expect(result.current.index).toBe(1);
    });

    it('wraps from last to 0', () => {
      const { result } = renderHook(() => usePrinciples());
      const total = result.current.total;
      for (let i = 0; i < total; i++) act(() => result.current.next());
      expect(result.current.index).toBe(0);
    });
  });

  describe('prev', () => {
    it('wraps from 0 to last', () => {
      const { result } = renderHook(() => usePrinciples());
      const total = result.current.total;
      act(() => result.current.prev());
      expect(result.current.index).toBe(total - 1);
    });
  });

  describe('setFilter', () => {
    it('updates categoryFilter', () => {
      const { result } = renderHook(() => usePrinciples());
      act(() => result.current.setFilter('status'));
      expect(result.current.categoryFilter).toBe('status');
    });

    it('resets index to 0', () => {
      const { result } = renderHook(() => usePrinciples());
      act(() => result.current.next());
      act(() => result.current.setFilter('editing'));
      expect(result.current.index).toBe(0);
    });

    it('total matches category count', () => {
      const { result } = renderHook(() => usePrinciples());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = IMPROV_PRINCIPLES.filter((p) => p.category === cat).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('current principle belongs to filtered category', () => {
      const { result } = renderHook(() => usePrinciples());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => usePrinciples());
      act(() => result.current.setFilter('ensemble'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(IMPROV_PRINCIPLES.length);
    });
  });
});
