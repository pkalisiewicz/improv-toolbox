import { useState, useCallback, useMemo } from 'react';
import { PROMPT_CARDS } from '../data/prompts';
import type { PromptCard, PromptCategory } from '../types';
import { useRandomBag } from './useRandomBag';

export function usePrompts() {
  const [category, setCategory] = useState<PromptCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return PROMPT_CARDS;
    return PROMPT_CARDS.filter((c) => c.category === category);
  }, [category]);
  const { current, draw } = useRandomBag<PromptCard>(filtered);

  const pickRandom = useCallback(() => {
    draw();
  }, [draw]);

  const setFilter = useCallback((cat: PromptCategory | 'all') => {
    setCategory(cat);
  }, []);

  return { current, category, pickRandom, setFilter };
}
