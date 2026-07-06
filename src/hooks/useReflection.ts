import { useState, useCallback, useMemo } from 'react';
import { REFLECTION_PROMPTS } from '../data/reflection';
import type { ReflectionPrompt, ReflectionCategory } from '../types';
import { useRandomBag } from './useRandomBag';

export function useReflection() {
  const [category, setCategory] = useState<ReflectionCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return REFLECTION_PROMPTS;
    return REFLECTION_PROMPTS.filter((p) => p.category === category);
  }, [category]);
  const { current, draw } = useRandomBag<ReflectionPrompt>(filtered);

  const pickRandom = useCallback(() => {
    draw();
  }, [draw]);

  const changeCategory = useCallback((cat: ReflectionCategory | 'all') => {
    setCategory(cat);
  }, []);

  return { current, category, filtered, pickRandom, changeCategory };
}
