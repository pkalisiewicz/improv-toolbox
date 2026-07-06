import { useState, useMemo, useCallback } from 'react';
import { IMPROV_FACTS } from '../data/facts';
import type { FactCategory, ImprovFact } from '../types';
import { shuffleItems } from '../utils/randomBag';

export function useFacts() {
  const [shuffled] = useState<ImprovFact[]>(() => shuffleItems(IMPROV_FACTS));
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<FactCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return shuffled;
    return shuffled.filter((f) => f.category === categoryFilter);
  }, [shuffled, categoryFilter]);

  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const currentFact = filtered[safeIndex] ?? shuffled[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const setFilter = useCallback((f: FactCategory | 'all') => {
    setCategoryFilter(f);
    setIndex(0);
  }, []);

  return {
    currentFact,
    index: safeIndex,
    total: filtered.length,
    categoryFilter,
    next,
    prev,
    setFilter,
  };
}
