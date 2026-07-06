import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useEmotion } from '../../hooks/useEmotion';
import { EMOTIONS } from '../../data/emotions';
import type { EmotionFamily } from '../../types';

const ALL_FAMILIES: EmotionFamily[] = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust'];

describe('useEmotion', () => {
  describe('initial state', () => {
    it('starts with family filter "all"', () => {
      const { result } = renderHook(() => useEmotion());
      expect(result.current.familyFilter).toBe('all');
    });

    it('current emotion is from the full pool', () => {
      const { result } = renderHook(() => useEmotion());
      const ids = EMOTIONS.map((e) => e.id);
      expect(ids).toContain(result.current.current.id);
    });

    it('total equals full emotion count initially', () => {
      const { result } = renderHook(() => useEmotion());
      expect(result.current.total).toBe(EMOTIONS.length);
    });
  });

  describe('setFilter', () => {
    it('updates familyFilter', () => {
      const { result } = renderHook(() => useEmotion());
      act(() => result.current.setFilter('joy'));
      expect(result.current.familyFilter).toBe('joy');
    });

    it('immediately updates current to matching family', () => {
      const { result } = renderHook(() => useEmotion());
      ALL_FAMILIES.forEach((family) => {
        act(() => result.current.setFilter(family));
        expect(result.current.current.family).toBe(family);
      });
    });

    it('updates total to filtered count', () => {
      const { result } = renderHook(() => useEmotion());
      ALL_FAMILIES.forEach((family) => {
        act(() => result.current.setFilter(family));
        const expected = EMOTIONS.filter((e) => e.family === family).length;
        expect(result.current.total).toBe(expected);
      });
    });

    it('restores full count when reset to "all"', () => {
      const { result } = renderHook(() => useEmotion());
      act(() => result.current.setFilter('anger'));
      act(() => result.current.setFilter('all'));
      expect(result.current.total).toBe(EMOTIONS.length);
    });
  });

  describe('spin', () => {
    it('current emotion stays within filtered family', () => {
      const { result } = renderHook(() => useEmotion());
      act(() => result.current.setFilter('fear'));
      act(() => result.current.spin());
      expect(result.current.current.family).toBe('fear');
    });

    it('current emotion is from the full pool when filter is "all"', () => {
      const { result } = renderHook(() => useEmotion());
      act(() => result.current.spin());
      const ids = EMOTIONS.map((e) => e.id);
      expect(ids).toContain(result.current.current.id);
    });
  });
});
