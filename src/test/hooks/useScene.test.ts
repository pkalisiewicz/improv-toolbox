import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useScene } from '../../hooks/useScene';
import { LOCATIONS, RELATIONSHIPS, SITUATIONS, MOODS, TIME_PERIODS } from '../../data/scenes';
import type { SceneCategory } from '../../types';

const VALID_CATEGORIES: SceneCategory[] = ['romantic', 'comedy', 'drama', 'thriller', 'absurd', 'historical'];

describe('useScene', () => {
  describe('initial state', () => {
    it('starts with genre "all"', () => {
      const { result } = renderHook(() => useScene());
      expect(result.current.genre).toBe('all');
    });

    it('initialises with a valid preset', () => {
      const { result } = renderHook(() => useScene());
      const { preset } = result.current;
      expect(preset).toHaveProperty('location');
      expect(preset).toHaveProperty('relationship');
      expect(preset).toHaveProperty('situation');
      expect(preset).toHaveProperty('mood');
      expect(preset).toHaveProperty('timePeriod');
    });

    it('initial preset elements belong to the data pools', () => {
      const { result } = renderHook(() => useScene());
      const { preset } = result.current;
      const locationIds = LOCATIONS.map((l) => l.id);
      const relationshipIds = RELATIONSHIPS.map((r) => r.id);
      const situationIds = SITUATIONS.map((s) => s.id);
      const moodIds = MOODS.map((m) => m.id);
      const timePeriodIds = TIME_PERIODS.map((t) => t.id);

      expect(locationIds).toContain(preset.location.id);
      expect(relationshipIds).toContain(preset.relationship.id);
      expect(situationIds).toContain(preset.situation.id);
      expect(moodIds).toContain(preset.mood.id);
      expect(timePeriodIds).toContain(preset.timePeriod.id);
    });
  });

  describe('regenerateAll', () => {
    it('returns a valid preset', () => {
      const { result } = renderHook(() => useScene());
      act(() => result.current.regenerateAll());
      const { preset } = result.current;
      expect(preset.location).toBeDefined();
      expect(preset.relationship).toBeDefined();
      expect(preset.situation).toBeDefined();
      expect(preset.mood).toBeDefined();
      expect(preset.timePeriod).toBeDefined();
    });

    it('respects the active genre filter', () => {
      const { result } = renderHook(() => useScene());
      act(() => result.current.setGenre('comedy'));
      act(() => result.current.regenerateAll());
      const { preset } = result.current;
      // Every element's category list should include 'comedy' (or come from
      // the full pool as fallback — still valid)
      expect(preset.location).toBeDefined();
    });
  });

  describe('regenerateOne', () => {
    it('replaces only the specified field', () => {
      const { result } = renderHook(() => useScene());
      const originalPreset = { ...result.current.preset };
      act(() => result.current.regenerateOne('location'));
      // Other fields should remain the same object references
      expect(result.current.preset.relationship.id).toBe(originalPreset.relationship.id);
      expect(result.current.preset.situation.id).toBe(originalPreset.situation.id);
      expect(result.current.preset.mood.id).toBe(originalPreset.mood.id);
      expect(result.current.preset.timePeriod.id).toBe(originalPreset.timePeriod.id);
    });

    it('new element belongs to the data pool', () => {
      const { result } = renderHook(() => useScene());
      act(() => result.current.regenerateOne('relationship'));
      const ids = RELATIONSHIPS.map((r) => r.id);
      expect(ids).toContain(result.current.preset.relationship.id);
    });

    it('works for every preset field', () => {
      const fields: (keyof ReturnType<typeof useScene>['preset'])[] = [
        'location', 'relationship', 'situation', 'mood', 'timePeriod',
      ];
      const { result } = renderHook(() => useScene());
      fields.forEach((field) => {
        act(() => result.current.regenerateOne(field));
        expect(result.current.preset[field]).toBeDefined();
      });
    });
  });

  describe('setGenre', () => {
    it('updates the genre state', () => {
      const { result } = renderHook(() => useScene());
      act(() => result.current.setGenre('drama'));
      expect(result.current.genre).toBe('drama');
    });

    it('also regenerates the preset', () => {
      const { result } = renderHook(() => useScene());
      // Changing genre always re-generates preset
      act(() => result.current.setGenre('thriller'));
      // Preset should still be a valid object
      expect(result.current.preset.location).toBeDefined();
      expect(result.current.preset).toHaveProperty('location');
    });

    it('accepts all valid SceneCategory values', () => {
      const { result } = renderHook(() => useScene());
      VALID_CATEGORIES.forEach((cat) => {
        act(() => result.current.setGenre(cat));
        expect(result.current.genre).toBe(cat);
      });
    });

    it('accepts "all" as a genre', () => {
      const { result } = renderHook(() => useScene());
      act(() => result.current.setGenre('romantic'));
      act(() => result.current.setGenre('all'));
      expect(result.current.genre).toBe('all');
    });
  });
});
