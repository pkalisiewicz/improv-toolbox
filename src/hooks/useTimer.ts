import { useState, useEffect, useCallback, useRef } from 'react';
import { haptics } from '../native/haptics';
import { scheduleTimerDone, cancelTimerDone } from '../native/timerNotification';

type TimerState = 'idle' | 'running' | 'paused' | 'done';

export function useTimer() {
  const [duration, setDurationState] = useState(120);
  const [remaining, setRemaining] = useState(120);
  const [state, setState] = useState<TimerState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Wall-clock target the countdown derives from, so it stays accurate across
  // backgrounding (JS intervals are throttled/suspended in the background).
  const endAtRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state !== 'running') {
      clear();
      return;
    }
    const tick = () => {
      const end = endAtRef.current;
      if (end == null) return;
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clear();
        endAtRef.current = null;
        setState('done');
        // The scheduled notification covers the backgrounded case; this is the
        // foreground signal (native haptic / web vibration).
        haptics.timerDone();
      }
    };
    // Recompute the instant we return to the foreground (where the interval was
    // throttled), not just on the next tick.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    tick();
    intervalRef.current = setInterval(tick, 250);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clear();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [state, clear]);

  const setPreset = useCallback((seconds: number) => {
    clear();
    void cancelTimerDone();
    endAtRef.current = null;
    setState('idle');
    setDurationState(seconds);
    setRemaining(seconds);
  }, [clear]);

  const start = useCallback(() => {
    setState((s) => {
      if (s !== 'idle' && s !== 'paused') return s;
      endAtRef.current = Date.now() + remaining * 1000;
      void scheduleTimerDone(remaining);
      return 'running';
    });
  }, [remaining]);

  const pause = useCallback(() => {
    setState((s) => {
      if (s !== 'running') return s;
      void cancelTimerDone();
      endAtRef.current = null;
      return 'paused';
    });
  }, []);

  const reset = useCallback(() => {
    clear();
    void cancelTimerDone();
    endAtRef.current = null;
    setState('idle');
    setRemaining(duration);
  }, [clear, duration]);

  const progress = duration > 0 ? remaining / duration : 1;

  return { remaining, duration, state, progress, setPreset, start, pause, reset };
}
