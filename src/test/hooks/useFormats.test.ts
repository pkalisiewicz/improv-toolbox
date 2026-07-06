import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormats } from '../../hooks/useFormats';
import { IMPROV_FORMATS } from '../../data/formats';
import type { FormatDifficulty } from '../../types';

const ALL_DIFFICULTIES: FormatDifficulty[] = ['beginner', 'intermediate', 'advanced'];

describe('useFormats', () => {
  describe('initial state', () => {
    it('starts with difficulty "all"', () => {
      const { result } = renderHook(() => useFormats());
      expect(result.current.difficulty).toBe('all');
    });

    it('filtered list equals full formats list initially', () => {
      const { result } = renderHook(() => useFormats());
      expect(result.current.filtered).toHaveLength(IMPROV_FORMATS.length);
    });

    it('starts with no selected format', () => {
      const { result } = renderHook(() => useFormats());
      expect(result.current.selected).toBeNull();
    });
  });

  describe('setDifficulty', () => {
    it('updates difficulty state', () => {
      const { result } = renderHook(() => useFormats());
      act(() => result.current.setDifficulty('beginner'));
      expect(result.current.difficulty).toBe('beginner');
    });

    it('filters to only matching difficulty', () => {
      const { result } = renderHook(() => useFormats());
      ALL_DIFFICULTIES.forEach((diff) => {
        act(() => result.current.setDifficulty(diff));
        result.current.filtered.forEach((f) => {
          expect(f.difficulty).toBe(diff);
        });
      });
    });

    it('each filtered format has a valid id from IMPROV_FORMATS', () => {
      const { result } = renderHook(() => useFormats());
      act(() => result.current.setDifficulty('intermediate'));
      const allIds = IMPROV_FORMATS.map((f) => f.id);
      result.current.filtered.forEach((f) => {
        expect(allIds).toContain(f.id);
      });
    });

    it('restores full list when reset to "all"', () => {
      const { result } = renderHook(() => useFormats());
      act(() => result.current.setDifficulty('advanced'));
      act(() => result.current.setDifficulty('all'));
      expect(result.current.filtered).toHaveLength(IMPROV_FORMATS.length);
    });

    it('returns at least one format per difficulty', () => {
      const { result } = renderHook(() => useFormats());
      ALL_DIFFICULTIES.forEach((diff) => {
        act(() => result.current.setDifficulty(diff));
        expect(result.current.filtered.length).toBeGreaterThan(0);
      });
    });
  });

  describe('setSelected', () => {
    it('sets selected format', () => {
      const { result } = renderHook(() => useFormats());
      const format = IMPROV_FORMATS[0];
      act(() => result.current.setSelected(format));
      expect(result.current.selected?.id).toBe(format.id);
    });

    it('clears selected format when set to null', () => {
      const { result } = renderHook(() => useFormats());
      const format = IMPROV_FORMATS[0];
      act(() => result.current.setSelected(format));
      act(() => result.current.setSelected(null));
      expect(result.current.selected).toBeNull();
    });

    it('selected format is independent of difficulty filter', () => {
      const { result } = renderHook(() => useFormats());
      const format = IMPROV_FORMATS[0];
      act(() => result.current.setSelected(format));
      act(() => result.current.setDifficulty('advanced'));
      // selected should remain regardless of filter
      expect(result.current.selected?.id).toBe(format.id);
    });
  });
});
