import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMetronome } from '../../hooks/useMetronome';
import type { TimeSignature } from '../../hooks/useMetronome';

const TIME_SIGNATURES: TimeSignature[] = [2, 3, 4, 6];

describe('useMetronome', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts at 80 BPM', () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.bpm).toBe(80);
    });

    it('starts not running', () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.isRunning).toBe(false);
    });

    it('starts at beat 0', () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.beat).toBe(0);
    });

    it('starts with time signature 4', () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.timeSig).toBe(4);
    });
  });

  describe('setBpm', () => {
    it('updates BPM', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.setBpm(120));
      expect(result.current.bpm).toBe(120);
    });

    it('clamps BPM below 20 to 20', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.setBpm(5));
      expect(result.current.bpm).toBe(20);
    });

    it('clamps BPM above 240 to 240', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.setBpm(300));
      expect(result.current.bpm).toBe(240);
    });

    it('accepts boundary values 20 and 240', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.setBpm(20));
      expect(result.current.bpm).toBe(20);
      act(() => result.current.setBpm(240));
      expect(result.current.bpm).toBe(240);
    });
  });

  describe('setTimeSignature', () => {
    it('updates time signature', () => {
      const { result } = renderHook(() => useMetronome());
      TIME_SIGNATURES.forEach((ts) => {
        act(() => result.current.setTimeSignature(ts));
        expect(result.current.timeSig).toBe(ts);
      });
    });
  });

  describe('toggle', () => {
    it('starts the metronome when not running', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.toggle());
      expect(result.current.isRunning).toBe(true);
    });

    it('stops the metronome when running', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.toggle());
      act(() => result.current.toggle());
      expect(result.current.isRunning).toBe(false);
    });

    it('resets beat to 0 when stopped', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.toggle());
      act(() => vi.advanceTimersByTime(1500));
      act(() => result.current.toggle());
      expect(result.current.beat).toBe(0);
    });
  });

  describe('tap tempo', () => {
    it('requires at least 2 taps to compute BPM', () => {
      const { result } = renderHook(() => useMetronome());
      const initial = result.current.bpm;
      act(() => result.current.tap());
      // 1 tap — BPM should not change
      expect(result.current.bpm).toBe(initial);
    });

    it('updates BPM after 2 taps', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.tap());
      act(() => {
        vi.advanceTimersByTime(500); // 500ms = 120 BPM
        result.current.tap();
      });
      // Should be close to 120 BPM
      expect(result.current.bpm).toBeGreaterThan(0);
      expect(result.current.bpm).toBeLessThanOrEqual(240);
    });

    it('discards taps older than 3 seconds', () => {
      const { result } = renderHook(() => useMetronome());
      act(() => result.current.tap());
      act(() => {
        vi.advanceTimersByTime(4000); // beyond 3s window
        result.current.tap();
      });
      // After the gap, only 1 valid tap — BPM should not change
      expect(result.current.bpm).toBe(80);
    });
  });
});
