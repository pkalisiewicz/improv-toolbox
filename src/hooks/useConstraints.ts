import { useState, useMemo, useCallback } from 'react';
import { SCENE_CONSTRAINTS } from '../data/constraints';
import type { ConstraintCategory, SceneConstraint } from '../types';
import { shuffleItems } from '../utils/randomBag';

export function useConstraints() {
  const [shuffled] = useState<SceneConstraint[]>(() => shuffleItems(SCENE_CONSTRAINTS));
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<ConstraintCategory | 'all'>('all');

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

  const setFilter = useCallback((f: ConstraintCategory | 'all') => {
    setCategoryFilter(f);
    setIndex(0);
  }, []);

  return { current, index: safeIndex, total: filtered.length, categoryFilter, next, prev, setFilter };
}
