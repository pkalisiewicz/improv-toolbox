import { useState, useMemo, useCallback } from 'react';
import { GAME_MODIFIERS } from '../data/modifiers';
import type { ModifierCategory, GameModifier } from '../types';
import { useRandomBag } from './useRandomBag';

export function useVariants() {
  const [categoryFilter, setCategoryFilter] = useState<ModifierCategory | 'all'>('all');

  const filtered = useMemo(
    () => (categoryFilter === 'all' ? GAME_MODIFIERS : GAME_MODIFIERS.filter((m) => m.category === categoryFilter)),
    [categoryFilter],
  );
  const { current, draw } = useRandomBag<GameModifier>(filtered);

  const randomize = useCallback(() => {
    draw();
  }, [draw]);

  const setFilter = useCallback((f: ModifierCategory | 'all') => {
    setCategoryFilter(f);
  }, []);

  return { current, categoryFilter, total: filtered.length, randomize, setFilter };
}
