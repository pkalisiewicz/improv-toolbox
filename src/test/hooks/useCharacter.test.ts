import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCharacter } from '../../hooks/useCharacter';
import { OCCUPATIONS, WANTS, QUIRKS, SPEECH_PATTERNS, EMOTIONS } from '../../data/characters';

describe('useCharacter', () => {
  describe('initial state', () => {
    it('generates a valid occupation from the pool', () => {
      const { result } = renderHook(() => useCharacter());
      const ids = OCCUPATIONS.map((o) => o.id);
      expect(ids).toContain(result.current.profile.occupation.id);
    });

    it('generates a valid want from the pool', () => {
      const { result } = renderHook(() => useCharacter());
      const ids = WANTS.map((w) => w.id);
      expect(ids).toContain(result.current.profile.want.id);
    });

    it('generates a valid quirk from the pool', () => {
      const { result } = renderHook(() => useCharacter());
      const ids = QUIRKS.map((q) => q.id);
      expect(ids).toContain(result.current.profile.quirk.id);
    });

    it('generates a valid speech pattern from the pool', () => {
      const { result } = renderHook(() => useCharacter());
      const ids = SPEECH_PATTERNS.map((s) => s.id);
      expect(ids).toContain(result.current.profile.speech.id);
    });

    it('generates a valid emotion from the pool', () => {
      const { result } = renderHook(() => useCharacter());
      const ids = EMOTIONS.map((e) => e.id);
      expect(ids).toContain(result.current.profile.emotion.id);
    });

    it('generates a status between 1 and 10 inclusive', () => {
      const { result } = renderHook(() => useCharacter());
      expect(result.current.profile.status).toBeGreaterThanOrEqual(1);
      expect(result.current.profile.status).toBeLessThanOrEqual(10);
    });
  });

  describe('regenerateAll', () => {
    it('produces a new valid profile', () => {
      const { result } = renderHook(() => useCharacter());
      act(() => result.current.regenerateAll());
      const { profile } = result.current;
      expect(OCCUPATIONS.map((o) => o.id)).toContain(profile.occupation.id);
      expect(WANTS.map((w) => w.id)).toContain(profile.want.id);
      expect(profile.status).toBeGreaterThanOrEqual(1);
      expect(profile.status).toBeLessThanOrEqual(10);
    });

    it('eventually produces a different profile (randomness)', () => {
      const { result } = renderHook(() => useCharacter());
      const original = result.current.profile.occupation.id;
      let changed = false;
      for (let i = 0; i < 30; i++) {
        act(() => result.current.regenerateAll());
        if (result.current.profile.occupation.id !== original) { changed = true; break; }
      }
      expect(changed).toBe(true);
    });
  });

  describe('regenerateTrait', () => {
    it('updates only the occupation field', () => {
      const { result } = renderHook(() => useCharacter());
      const before = result.current.profile;
      act(() => result.current.regenerateTrait('occupation'));
      expect(result.current.profile.want.id).toBe(before.want.id);
      expect(result.current.profile.quirk.id).toBe(before.quirk.id);
      expect(result.current.profile.speech.id).toBe(before.speech.id);
      expect(result.current.profile.emotion.id).toBe(before.emotion.id);
    });

    it('new occupation is in the pool', () => {
      const { result } = renderHook(() => useCharacter());
      act(() => result.current.regenerateTrait('occupation'));
      expect(OCCUPATIONS.map((o) => o.id)).toContain(result.current.profile.occupation.id);
    });

    it('updates status in range 1–10', () => {
      const { result } = renderHook(() => useCharacter());
      act(() => result.current.regenerateTrait('status'));
      expect(result.current.profile.status).toBeGreaterThanOrEqual(1);
      expect(result.current.profile.status).toBeLessThanOrEqual(10);
    });

    it('updating status does not change other fields', () => {
      const { result } = renderHook(() => useCharacter());
      const before = result.current.profile;
      act(() => result.current.regenerateTrait('status'));
      expect(result.current.profile.occupation.id).toBe(before.occupation.id);
    });

    const traitPools = {
      want: WANTS,
      quirk: QUIRKS,
      speech: SPEECH_PATTERNS,
      emotion: EMOTIONS,
    } as const;

    Object.entries(traitPools).forEach(([trait, pool]) => {
      it(`regenerates "${trait}" from correct pool`, () => {
        const { result } = renderHook(() => useCharacter());
        act(() => result.current.regenerateTrait(trait as keyof typeof traitPools));
        const ids = pool.map((x) => x.id);
        const profileTrait = (result.current.profile as unknown as Record<string, { id: string }>)[trait];
        expect(ids).toContain(profileTrait.id);
      });
    });
  });
});
