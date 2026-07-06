import { useState, useMemo, useCallback } from 'react';
import { MONOLOGUE_SEEDS } from '../data/monologue';
import type { MonologueCategory, MonologueSeed } from '../types';
import { shuffleItems } from '../utils/randomBag';

export function useMonologue() {
  const [shuffled] = useState<MonologueSeed[]>(() => shuffleItems(MONOLOGUE_SEEDS));
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<MonologueCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return shuffled;
    return shuffled.filter((s) => s.category === categoryFilter);
  }, [shuffled, categoryFilter]);

  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const current = filtered[safeIndex] ?? shuffled[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const setFilter = useCallback((f: MonologueCategory | 'all') => {
    setCategoryFilter(f);
    setIndex(0);
  }, []);

  return {
    current,
    index: safeIndex,
    total: filtered.length,
    categoryFilter,
    next,
    prev,
    setFilter,
  };
}
