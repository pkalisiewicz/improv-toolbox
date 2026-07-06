import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTimer } from '../../hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts with 120s duration', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.duration).toBe(120);
    });

    it('starts with 120s remaining', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.remaining).toBe(120);
    });

    it('starts in idle state', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.state).toBe('idle');
    });

    it('initial progress is 1', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.progress).toBe(1);
    });
  });

  describe('setPreset', () => {
    it('sets duration and remaining', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(60));
      expect(result.current.duration).toBe(60);
      expect(result.current.remaining).toBe(60);
    });

    it('resets state to idle', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      act(() => result.current.setPreset(90));
      expect(result.current.state).toBe('idle');
    });
  });

  describe('start', () => {
    it('transitions from idle to running', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      expect(result.current.state).toBe('running');
    });

    it('transitions from paused to running', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      act(() => result.current.pause());
      act(() => result.current.start());
      expect(result.current.state).toBe('running');
    });

    it('does not change state from done', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(1));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(2000));
      expect(result.current.state).toBe('done');
      act(() => result.current.start());
      expect(result.current.state).toBe('done');
    });
  });

  describe('pause', () => {
    it('transitions from running to paused', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      act(() => result.current.pause());
      expect(result.current.state).toBe('paused');
    });

    it('does not change state when already paused', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      act(() => result.current.pause());
      act(() => result.current.pause());
      expect(result.current.state).toBe('paused');
    });
  });

  describe('countdown', () => {
    it('decrements remaining each second', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(10));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(3000));
      expect(result.current.remaining).toBe(7);
    });

    it('transitions to done when remaining reaches 0', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(3));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(4000));
      expect(result.current.state).toBe('done');
      expect(result.current.remaining).toBe(0);
    });

    it('does not decrement while paused', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(10));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(2000));
      act(() => result.current.pause());
      act(() => vi.advanceTimersByTime(5000));
      expect(result.current.remaining).toBe(8);
    });

    it('triggers vibration on completion', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(1));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(2000));
      expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200]);
    });
  });

  describe('reset', () => {
    it('restores remaining to duration', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(30));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(5000));
      act(() => result.current.reset());
      expect(result.current.remaining).toBe(30);
    });

    it('sets state back to idle', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.start());
      act(() => result.current.reset());
      expect(result.current.state).toBe('idle');
    });
  });

  describe('progress', () => {
    it('is 1 at the start', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.progress).toBe(1);
    });

    it('is 0.5 halfway through', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(10));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(5000));
      expect(result.current.progress).toBeCloseTo(0.5);
    });

    it('is 0 when done', () => {
      const { result } = renderHook(() => useTimer());
      act(() => result.current.setPreset(2));
      act(() => result.current.start());
      act(() => vi.advanceTimersByTime(3000));
      expect(result.current.progress).toBe(0);
    });
  });
});
