import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSoundscape, SOUND_URLS } from '../../hooks/useSoundscape';
import type { SoundscapeId } from '../../hooks/useSoundscape';

const SOUND_IDS = Object.keys(SOUND_URLS) as SoundscapeId[];

describe('useSoundscape', () => {
  describe('initial state', () => {
    it('starts with no active track', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.active).toBeNull();
    });

    it('starts not playing', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.isPlaying).toBe(false);
    });

    it('starts with loop enabled', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.loop).toBe(true);
    });

    it('starts with volume 0.5', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.volume).toBe(0.5);
    });

    it('starts with currentTime 0', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.currentTime).toBe(0);
    });
  });

  describe('SOUND_URLS', () => {
    it('has entries for all expected soundscape IDs', () => {
      const expected: SoundscapeId[] = ['rain', 'city', 'forest', 'cafe', 'storm', 'fireplace', 'ocean', 'elevator'];
      expected.forEach((id) => {
        expect(SOUND_URLS).toHaveProperty(id);
        expect(SOUND_URLS[id]).toMatch(/^\/sounds\//);
      });
    });
  });

  describe('play', () => {
    it('sets active to the played sound id', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('rain'));
      expect(result.current.active).toBe('rain');
    });

    it('resets currentTime and duration when switching tracks', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('rain'));
      act(() => result.current.play('city'));
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
    });

    it('supports all sound IDs without throwing', () => {
      const { result } = renderHook(() => useSoundscape());
      SOUND_IDS.forEach((id) => {
        expect(() => act(() => result.current.play(id))).not.toThrow();
      });
    });
  });

  describe('stopAll', () => {
    it('clears active track', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('forest'));
      act(() => result.current.stopAll());
      expect(result.current.active).toBeNull();
    });

    it('sets isPlaying to false', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('cafe'));
      act(() => result.current.stopAll());
      expect(result.current.isPlaying).toBe(false);
    });

    it('resets currentTime and duration to 0', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('storm'));
      act(() => result.current.stopAll());
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
    });
  });

  describe('setVolume', () => {
    it('updates volume state', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.setVolume(0.8));
      expect(result.current.volume).toBe(0.8);
    });

    it('clamps are not applied (hook accepts any value)', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.setVolume(0));
      expect(result.current.volume).toBe(0);
    });
  });

  describe('seek', () => {
    it('updates currentTime state', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('fireplace'));
      act(() => result.current.seek(30));
      expect(result.current.currentTime).toBe(30);
    });
  });

  describe('skip', () => {
    it('adjusts currentTime by delta without going negative', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.play('ocean'));
      // With duration=0 and currentTime=0, skip(-10) should clamp to 0
      act(() => result.current.skip(-10));
      expect(result.current.currentTime).toBe(0);
    });
  });

  describe('toggleLoop', () => {
    it('toggles loop state from true to false', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(result.current.loop).toBe(true);
      act(() => result.current.toggleLoop());
      expect(result.current.loop).toBe(false);
    });

    it('toggles loop state from false back to true', () => {
      const { result } = renderHook(() => useSoundscape());
      act(() => result.current.toggleLoop());
      act(() => result.current.toggleLoop());
      expect(result.current.loop).toBe(true);
    });
  });

  describe('pauseSeeking / commitSeeking', () => {
    it('do not throw when called', () => {
      const { result } = renderHook(() => useSoundscape());
      expect(() => act(() => result.current.pauseSeeking())).not.toThrow();
      expect(() => act(() => result.current.commitSeeking())).not.toThrow();
    });
  });
});
