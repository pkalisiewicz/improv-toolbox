import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReflection } from '../../hooks/useReflection';
import { REFLECTION_PROMPTS } from '../../data/reflection';
import type { ReflectionCategory } from '../../types';

const ALL_CATEGORIES: ReflectionCategory[] = ['game', 'crow', 'ensemble', 'edit', 'character'];

describe('useReflection', () => {
  describe('initial state', () => {
    it('starts with category "all"', () => {
      const { result } = renderHook(() => useReflection());
      expect(result.current.category).toBe('all');
    });

    it('current prompt is a valid reflection prompt', () => {
      const { result } = renderHook(() => useReflection());
      const ids = REFLECTION_PROMPTS.map((p) => p.id);
      expect(ids).toContain(result.current.current.id);
    });

    it('filtered list equals full pool initially', () => {
      const { result } = renderHook(() => useReflection());
      expect(result.current.filtered).toHaveLength(REFLECTION_PROMPTS.length);
    });
  });

  describe('changeCategory', () => {
    it('updates category state', () => {
      const { result } = renderHook(() => useReflection());
      act(() => result.current.changeCategory('game'));
      expect(result.current.category).toBe('game');
    });

    it('current prompt belongs to the new category', () => {
      const { result } = renderHook(() => useReflection());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.changeCategory(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('filtered list contains only matching prompts', () => {
      const { result } = renderHook(() => useReflection());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.changeCategory(cat));
        result.current.filtered.forEach((p) => {
          expect(p.category).toBe(cat);
        });
      });
    });

    it('restores full pool when reset to "all"', () => {
      const { result } = renderHook(() => useReflection());
      act(() => result.current.changeCategory('ensemble'));
      act(() => result.current.changeCategory('all'));
      expect(result.current.filtered).toHaveLength(REFLECTION_PROMPTS.length);
    });
  });

  describe('pickRandom', () => {
    it('current prompt stays within the filtered set', () => {
      const { result } = renderHook(() => useReflection());
      act(() => result.current.changeCategory('character'));
      act(() => result.current.pickRandom());
      expect(result.current.current.category).toBe('character');
    });

    it('picks from full pool when category is "all"', () => {
      const { result } = renderHook(() => useReflection());
      act(() => result.current.pickRandom());
      const ids = REFLECTION_PROMPTS.map((p) => p.id);
      expect(ids).toContain(result.current.current.id);
    });
  });
});
