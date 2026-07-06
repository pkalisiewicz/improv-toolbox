import { useState, useMemo, useCallback } from 'react';
import { EMOTIONS } from '../data/emotions';
import type { EmotionFamily, Emotion } from '../types';
import { useRandomBag } from './useRandomBag';

export function useEmotion() {
  const [familyFilter, setFamilyFilter] = useState<EmotionFamily | 'all'>('all');

  const filtered = useMemo(
    () => (familyFilter === 'all' ? EMOTIONS : EMOTIONS.filter((e) => e.family === familyFilter)),
    [familyFilter],
  );
  const { current, draw } = useRandomBag<Emotion>(filtered);

  const spin = useCallback(() => {
    draw();
  }, [draw]);

  const setFilter = useCallback((f: EmotionFamily | 'all') => {
    setFamilyFilter(f);
  }, []);

  return { current, familyFilter, total: filtered.length, spin, setFilter };
}
