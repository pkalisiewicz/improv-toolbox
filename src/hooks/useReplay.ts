import { useState, useMemo, useCallback } from 'react';
import { REPLAY_CARDS } from '../data/replay';
import type { ReplayCategory, ReplayCard } from '../types';
import { shuffleItems } from '../utils/randomBag';

export function useReplay() {
  const [shuffled, setShuffled] = useState<ReplayCard[]>(() => shuffleItems(REPLAY_CARDS));
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<ReplayCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return shuffled;
    return shuffled.filter((c) => c.category === categoryFilter);
  }, [shuffled, categoryFilter]);

  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const current = filtered[safeIndex] ?? shuffled[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const random = useCallback(() => {
    setShuffled(shuffleItems(REPLAY_CARDS));
    setIndex(0);
  }, []);

  const setFilter = useCallback((f: ReplayCategory | 'all') => {
    setCategoryFilter(f);
    setIndex(0);
  }, []);

  return { current, index: safeIndex, total: filtered.length, categoryFilter, next, prev, random, setFilter };
}
