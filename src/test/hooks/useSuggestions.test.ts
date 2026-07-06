import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSuggestions } from '../../hooks/useSuggestions';
import { SUGGESTIONS } from '../../data/suggestions';
import type { SuggestionCategory } from '../../types';
import type { GrabBagResult } from '../../hooks/useSuggestions';

const SINGLE_CATEGORIES: SuggestionCategory[] = ['location', 'occupation', 'relationship', 'emotion', 'movie_title', 'word'];
const GRAB_BAG_CATEGORIES: (keyof GrabBagResult)[] = ['location', 'occupation', 'relationship', 'emotion'];

describe('useSuggestions', () => {
  describe('initial state', () => {
    it('starts with "location" category', () => {
      const { result } = renderHook(() => useSuggestions());
      expect(result.current.category).toBe('location');
    });

    it('initial suggestion is from the location pool', () => {
      const { result } = renderHook(() => useSuggestions());
      expect(result.current.current.category).toBe('location');
    });

    it('starts with no grab bag result', () => {
      const { result } = renderHook(() => useSuggestions());
      expect(result.current.grabBag).toBeNull();
    });
  });

  describe('changeCategory', () => {
    it('updates category state', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('occupation'));
      expect(result.current.category).toBe('occupation');
    });

    it('immediately picks from the new category', () => {
      const { result } = renderHook(() => useSuggestions());
      SINGLE_CATEGORIES.forEach((cat) => {
        act(() => result.current.changeCategory(cat));
        expect(result.current.current.category).toBe(cat);
      });
    });

    it('clears grabBag when changing away from grab', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('grab'));
      act(() => result.current.pickRandom());
      act(() => result.current.changeCategory('location'));
      expect(result.current.grabBag).toBeNull();
    });
  });

  describe('pickRandom – single category', () => {
    it('selects a suggestion from the current category', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('emotion'));
      act(() => result.current.pickRandom());
      expect(result.current.current.category).toBe('emotion');
    });

    it('suggestion id is from the SUGGESTIONS pool', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.pickRandom());
      const ids = SUGGESTIONS.filter((s) => s.category === 'location').map((s) => s.id);
      expect(ids).toContain(result.current.current.id);
    });
  });

  describe('pickRandom – grab bag', () => {
    it('sets grabBag with all four categories', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('grab'));
      act(() => result.current.pickRandom());
      expect(result.current.grabBag).not.toBeNull();
      const gb = result.current.grabBag!;
      GRAB_BAG_CATEGORIES.forEach((cat) => {
        expect(gb[cat].category).toBe(cat);
      });
    });

    it('grab bag items are valid suggestions', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('grab'));
      act(() => result.current.pickRandom());
      const gb = result.current.grabBag!;
      const allIds = SUGGESTIONS.map((s) => s.id);
      GRAB_BAG_CATEGORIES.forEach((cat) => {
        expect(allIds).toContain(gb[cat].id);
      });
    });

    it('does not update current suggestion in grab mode', () => {
      const { result } = renderHook(() => useSuggestions());
      act(() => result.current.changeCategory('grab'));
      const currentBefore = result.current.current;
      act(() => result.current.pickRandom());
      // current should remain unchanged (only grabBag changes)
      expect(result.current.current).toEqual(currentBefore);
    });
  });
});
