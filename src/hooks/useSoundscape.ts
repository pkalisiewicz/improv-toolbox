import { useState, useCallback, useRef, useEffect } from 'react';

export type SoundscapeId = 'rain' | 'city' | 'forest' | 'cafe' | 'storm' | 'fireplace' | 'ocean' | 'elevator';

export const SOUND_URLS: Record<SoundscapeId, string> = {
  rain:      '/sounds/rain.mp3',
  city:      '/sounds/city.mp3',
  forest:    '/sounds/forest.mp3',
  cafe:      '/sounds/cafe.mp3',
  storm:     '/sounds/storm.mp3',
  fireplace: '/sounds/fireplace.mp3',
  ocean:     '/sounds/ocean.mp3',
  elevator:  '/sounds/elevator.mp3',
};

export function useSoundscape() {
  const [active, setActive]           = useState<SoundscapeId | null>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [loop, setLoopState]          = useState(true);
  const [volume, setVolumeState]      = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const seekingRef = useRef(false); // suppress timeupdate during seek drag

  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop   = true;
      a.volume = 0.5;
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  // Attach persistent event listeners once on mount
  useEffect(() => {
    const audio = getAudio();

    const onTimeUpdate  = () => { if (!seekingRef.current) setCurrentTime(audio.currentTime); };
    const onDuration    = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onPlay        = () => setIsPlaying(true);
    const onPause       = () => setIsPlaying(false);

    audio.addEventListener('timeupdate',     onTimeUpdate);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);

    return () => {
      audio.removeEventListener('timeupdate',     onTimeUpdate);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.pause();
    };
  }, [getAudio]);

  const play = useCallback((id: SoundscapeId) => {
    const audio = getAudio();
    if (active === id) {
      if (isPlaying) { audio.pause(); } else { audio.play().catch(() => {}); }
      return;
    }
    audio.pause();
    audio.src = SOUND_URLS[id];
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setActive(id);
    audio.play().catch(() => {});
  }, [active, isPlaying, getAudio]);

  const stopAll = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ''; }
    setActive(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skip = useCallback((delta: number) => {
    if (!audioRef.current) return;
    const t = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleLoop = useCallback(() => {
    const audio = getAudio();
    const newLoop = !audio.loop;
    audio.loop = newLoop;
    setLoopState(newLoop);
  }, [getAudio]);

  const pauseSeeking  = useCallback(() => { seekingRef.current = true;  }, []);
  const commitSeeking = useCallback(() => { seekingRef.current = false; }, []);

  return {
    active, isPlaying, loop, volume, currentTime, duration,
    play, stopAll, seek, skip, setVolume, toggleLoop,
    pauseSeeking, commitSeeking,
  };
}
