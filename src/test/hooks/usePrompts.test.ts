import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePrompts } from '../../hooks/usePrompts';
import { PROMPT_CARDS } from '../../data/prompts';
import type { PromptCategory } from '../../types';

const ALL_CATEGORIES: PromptCategory[] = ['first_line', 'occupation', 'location', 'what_not_to_say', 'title'];

describe('usePrompts', () => {
  describe('initial state', () => {
    it('starts with category "all"', () => {
      const { result } = renderHook(() => usePrompts());
      expect(result.current.category).toBe('all');
    });

    it('currentCard is from the full pool', () => {
      const { result } = renderHook(() => usePrompts());
      const ids = PROMPT_CARDS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('pickRandom', () => {
    it('sets current to a card from the filtered pool', () => {
      const { result } = renderHook(() => usePrompts());
      act(() => result.current.setFilter('occupation'));
      act(() => result.current.pickRandom());
      expect(result.current.current.category).toBe('occupation');
    });

    it('picks from full pool when category is "all"', () => {
      const { result } = renderHook(() => usePrompts());
      act(() => result.current.pickRandom());
      const ids = PROMPT_CARDS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('setFilter', () => {
    it('updates category state', () => {
      const { result } = renderHook(() => usePrompts());
      act(() => result.current.setFilter('first_line'));
      expect(result.current.category).toBe('first_line');
    });

    it('immediately sets current to a card from the new category', () => {
      const { result } = renderHook(() => usePrompts());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('filters list contains only matching cards', () => {
      const { result } = renderHook(() => usePrompts());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setFilter(cat));
        const expected = PROMPT_CARDS.filter((c) => c.category === cat);
        // The current card should be in the filtered set
        const expectedIds = expected.map((c) => c.id);
        expect(expectedIds).toContain(result.current.current.id);
      });
    });

    it('resets to full pool when set to "all"', () => {
      const { result } = renderHook(() => usePrompts());
      act(() => result.current.setFilter('title'));
      act(() => result.current.setFilter('all'));
      expect(result.current.category).toBe('all');
      const ids = PROMPT_CARDS.map((c) => c.id);
      expect(ids).toContain(result.current.current.id);
    });
  });
});
