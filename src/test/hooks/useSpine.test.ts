import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSpine } from '../../hooks/useSpine';
import { SPINE_BEATS } from '../../data/spine';

describe('useSpine', () => {
  describe('initial state', () => {
    it('generates seeds for every beat', () => {
      const { result } = renderHook(() => useSpine());
      expect(result.current.currentSeeds).toHaveLength(SPINE_BEATS.length);
    });

    it('each initial seed belongs to its beat pool', () => {
      const { result } = renderHook(() => useSpine());
      SPINE_BEATS.forEach((beat, i) => {
        expect(beat.seeds).toContain(result.current.currentSeeds[i]);
      });
    });
  });

  describe('rerollBeat', () => {
    it('replaces only the targeted beat seed', () => {
      const { result } = renderHook(() => useSpine());
      const before = [...result.current.currentSeeds];
      act(() => result.current.rerollBeat(0));
      // Other beats unchanged
      for (let i = 1; i < SPINE_BEATS.length; i++) {
        expect(result.current.currentSeeds[i]).toBe(before[i]);
      }
    });

    it('new seed belongs to the correct beat pool', () => {
      const { result } = renderHook(() => useSpine());
      act(() => result.current.rerollBeat(2));
      expect(SPINE_BEATS[2].seeds).toContain(result.current.currentSeeds[2]);
    });

    it('works for every beat index', () => {
      const { result } = renderHook(() => useSpine());
      SPINE_BEATS.forEach((beat, i) => {
        act(() => result.current.rerollBeat(i));
        expect(beat.seeds).toContain(result.current.currentSeeds[i]);
      });
    });
  });

  describe('regenerateAll', () => {
    it('regenerates seeds for all beats', () => {
      const { result } = renderHook(() => useSpine());
      act(() => result.current.regenerateAll());
      expect(result.current.currentSeeds).toHaveLength(SPINE_BEATS.length);
      SPINE_BEATS.forEach((beat, i) => {
        expect(beat.seeds).toContain(result.current.currentSeeds[i]);
      });
    });

    it('eventually produces different seeds (randomness)', () => {
      const { result } = renderHook(() => useSpine());
      const original = [...result.current.currentSeeds];
      let changed = false;
      for (let i = 0; i < 20; i++) {
        act(() => result.current.regenerateAll());
        if (result.current.currentSeeds.some((s, idx) => s !== original[idx])) {
          changed = true;
          break;
        }
      }
      expect(changed).toBe(true);
    });
  });
});
