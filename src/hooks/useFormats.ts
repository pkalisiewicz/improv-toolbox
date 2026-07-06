import { useState } from 'react';
import { IMPROV_FORMATS } from '../data/formats';
import type { FormatDifficulty, ImprovFormat } from '../types';

export function useFormats() {
  const [difficulty, setDifficulty] = useState<FormatDifficulty | 'all'>('all');
  const [selected, setSelected] = useState<ImprovFormat | null>(null);

  const filtered = IMPROV_FORMATS.filter(
    (f) => difficulty === 'all' || f.difficulty === difficulty
  );

  return { filtered, difficulty, setDifficulty, selected, setSelected };
}
