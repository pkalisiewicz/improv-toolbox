import { useState, useMemo, useCallback } from 'react';
import { IMPROV_PRINCIPLES } from '../data/principles';
import type { PrincipleCategory, ImprovPrinciple } from '../types';
import { shuffleItems } from '../utils/randomBag';

export function usePrinciples() {
  const [shuffled] = useState<ImprovPrinciple[]>(() => shuffleItems(IMPROV_PRINCIPLES));
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<PrincipleCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return shuffled;
    return shuffled.filter((p) => p.category === categoryFilter);
  }, [shuffled, categoryFilter]);

  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const current = filtered[safeIndex] ?? shuffled[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const setFilter = useCallback((f: PrincipleCategory | 'all') => {
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
