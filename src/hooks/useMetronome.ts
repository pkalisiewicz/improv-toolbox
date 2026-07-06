import { useState, useCallback, useRef, useEffect } from 'react';

export type TimeSignature = 2 | 3 | 4 | 6;

// Minimal silent WAV (44 bytes, 0 samples, 8-bit mono 8kHz).
// Playing an HTMLAudioElement from a user gesture forces iOS to switch to
// AVAudioSessionCategoryPlayback, which is NOT muted by the hardware mute switch.
// Web Audio API created afterwards inherits this session.
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export function useMetronome() {
  const [bpm, setBpmState]         = useState(80);
  const [isRunning, setIsRunning]  = useState(false);
  const [beat, setBeat]            = useState(0); // current beat index (0-based)
  const [timeSig, setTimeSig]      = useState<TimeSignature>(4);

  const audioCtxRef   = useRef<AudioContext | null>(null);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatRef       = useRef(0);
  const timeSigRef    = useRef<TimeSignature>(4);
  const bpmRef        = useRef(80);
  const iosUnlockedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { timeSigRef.current = timeSig; }, [timeSig]);

  // iOS fix: play a silent HTMLAudioElement on first user gesture.
  // This switches the iOS audio session to "playback", allowing Web Audio
  // to play even when the hardware mute switch is engaged.
  const unlockiOS = useCallback(() => {
    if (iosUnlockedRef.current) return;
    iosUnlockedRef.current = true;
    const el = new Audio(SILENT_WAV);
    el.play().catch(() => { /* autoplay denied – ignore */ });
    // Create AudioContext immediately after triggering silent audio,
    // so it inherits the playback audio session on iOS.
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
  }, []);

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((accent: boolean) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = accent ? 1000 : 600;
    gain.gain.setValueAtTime(accent ? 0.4 : 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }, [getCtx]);

  const tick = useCallback(() => {
    const isAccent = beatRef.current === 0;
    playClick(isAccent);
    setBeat(beatRef.current);
    beatRef.current = (beatRef.current + 1) % timeSigRef.current;
  }, [playClick]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    beatRef.current = 0;
    tick();
    intervalRef.current = setInterval(tick, (60 / bpmRef.current) * 1000);
    setIsRunning(true);
  }, [tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBeat(0);
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    unlockiOS();
    if (isRunning) { stop(); } else { start(); }
  }, [isRunning, start, stop, unlockiOS]);

  // Restart interval when BPM changes while running
  const setBpm = useCallback((v: number) => {
    const clamped = Math.max(20, Math.min(240, v));
    setBpmState(clamped);
    bpmRef.current = clamped;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, (60 / clamped) * 1000);
    }
  }, [tick]);

  const setTimeSignature = useCallback((ts: TimeSignature) => {
    setTimeSig(ts);
    timeSigRef.current = ts;
    beatRef.current = 0;
  }, []);

  // Tap tempo
  const tapTimesRef = useRef<number[]>([]);
  const tap = useCallback(() => {
    unlockiOS();
    const now = Date.now();
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t < 3000), now];
    if (tapTimesRef.current.length >= 2) {
      const intervals = tapTimesRef.current.slice(1).map((t, i) => t - tapTimesRef.current[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setBpm(Math.round(60000 / avg));
    }
  }, [setBpm, unlockiOS]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { bpm, isRunning, beat, timeSig, setBpm, setTimeSignature, toggle, tap };
}
