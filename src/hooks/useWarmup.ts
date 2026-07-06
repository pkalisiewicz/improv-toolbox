import { useState, useCallback, useMemo } from 'react';
import { WARMUP_GAMES } from '../data/warmups';
import type { WarmupGame, WarmupCategory, WarmupLevel } from '../types';
import { useRandomBag } from './useRandomBag';

type PlayerFilter = 'any' | '2+' | '4+' | '6+';

interface WarmupState {
  playerFilter: PlayerFilter;
  categoryFilter: WarmupCategory | 'all';
  levelFilter: WarmupLevel | 'all';
}

export function useWarmup() {
  const [state, setState] = useState<WarmupState>({
    playerFilter: 'any',
    categoryFilter: 'all',
    levelFilter: 'all',
  });

  const filtered = useMemo(() => {
    return WARMUP_GAMES.filter((game) => {
      const passesPlayers = (() => {
        if (state.playerFilter === 'any') return true;
        const min = parseInt(state.playerFilter);
        return game.minPlayers <= min && (game.maxPlayers === null || game.maxPlayers >= min);
      })();
      const passesCategory =
        state.categoryFilter === 'all' || game.category === state.categoryFilter;
      const passesLevel =
        state.levelFilter === 'all' || game.level === state.levelFilter;
      return passesPlayers && passesCategory && passesLevel;
    });
  }, [state.playerFilter, state.categoryFilter, state.levelFilter]);
  const activePool = filtered.length > 0 ? filtered : WARMUP_GAMES;
  const { current: currentGame, draw } = useRandomBag<WarmupGame>(activePool);

  const pickRandom = useCallback(() => {
    draw();
  }, [draw]);

  const setPlayerFilter = useCallback((f: PlayerFilter) => {
    setState((prev) => ({ ...prev, playerFilter: f }));
  }, []);

  const setCategoryFilter = useCallback((f: WarmupCategory | 'all') => {
    setState((prev) => ({ ...prev, categoryFilter: f }));
  }, []);

  const setLevelFilter = useCallback((f: WarmupLevel | 'all') => {
    setState((prev) => ({ ...prev, levelFilter: f }));
  }, []);

  return {
    ...state,
    currentGame,
    filtered,
    pickRandom,
    setPlayerFilter,
    setCategoryFilter,
    setLevelFilter,
  };
}
