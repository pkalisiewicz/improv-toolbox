import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWarmup } from '../../hooks/useWarmup';
import { WARMUP_GAMES } from '../../data/warmups';
import type { WarmupCategory, WarmupLevel } from '../../types';

const ALL_CATEGORIES: WarmupCategory[] = ['physical', 'vocal', 'focus', 'ensemble', 'storytelling', 'character'];
const ALL_LEVELS: WarmupLevel[] = ['beginner', 'intermediate', 'advanced'];

describe('useWarmup', () => {
  describe('initial state', () => {
    it('starts with all filters set to "all" / "any"', () => {
      const { result } = renderHook(() => useWarmup());
      expect(result.current.playerFilter).toBe('any');
      expect(result.current.categoryFilter).toBe('all');
      expect(result.current.levelFilter).toBe('all');
    });

    it('initial currentGame is from the WARMUP_GAMES pool', () => {
      const { result } = renderHook(() => useWarmup());
      const ids = WARMUP_GAMES.map((g) => g.id);
      expect(ids).toContain(result.current.currentGame.id);
    });

    it('filtered list equals full pool when all filters are "all"/"any"', () => {
      const { result } = renderHook(() => useWarmup());
      expect(result.current.filtered).toHaveLength(WARMUP_GAMES.length);
    });
  });

  describe('setPlayerFilter', () => {
    it('updates playerFilter state', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setPlayerFilter('4+'));
      expect(result.current.playerFilter).toBe('4+');
    });

    it('filters out games that do not support the minimum player count', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setPlayerFilter('6+'));
      result.current.filtered.forEach((game) => {
        const maxOk = game.maxPlayers === null || game.maxPlayers >= 6;
        const minOk = game.minPlayers <= 6;
        expect(minOk && maxOk).toBe(true);
      });
    });

    it('returns at least some games for "2+"', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setPlayerFilter('2+'));
      expect(result.current.filtered.length).toBeGreaterThan(0);
    });
  });

  describe('setCategoryFilter', () => {
    it('updates categoryFilter state', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setCategoryFilter('physical'));
      expect(result.current.categoryFilter).toBe('physical');
    });

    it('filters to only matching-category games', () => {
      const { result } = renderHook(() => useWarmup());
      ALL_CATEGORIES.forEach((cat) => {
        act(() => result.current.setCategoryFilter(cat));
        result.current.filtered.forEach((game) => {
          expect(game.category).toBe(cat);
        });
      });
    });

    it('returns all games when reset to "all"', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setCategoryFilter('vocal'));
      act(() => result.current.setCategoryFilter('all'));
      expect(result.current.filtered).toHaveLength(WARMUP_GAMES.length);
    });
  });

  describe('setLevelFilter', () => {
    it('updates levelFilter state', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setLevelFilter('beginner'));
      expect(result.current.levelFilter).toBe('beginner');
    });

    it('filters to only matching-level games', () => {
      const { result } = renderHook(() => useWarmup());
      ALL_LEVELS.forEach((level) => {
        act(() => result.current.setLevelFilter(level));
        result.current.filtered.forEach((game) => {
          expect(game.level).toBe(level);
        });
      });
    });

    it('returns all games when reset to "all"', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setLevelFilter('advanced'));
      act(() => result.current.setLevelFilter('all'));
      expect(result.current.filtered).toHaveLength(WARMUP_GAMES.length);
    });
  });

  describe('combined filters', () => {
    it('applies all three filters simultaneously', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => {
        result.current.setCategoryFilter('physical');
        result.current.setLevelFilter('beginner');
        result.current.setPlayerFilter('any');
      });
      result.current.filtered.forEach((game) => {
        expect(game.category).toBe('physical');
        expect(game.level).toBe('beginner');
      });
    });
  });

  describe('pickRandom', () => {
    it('sets currentGame to a game from the filtered pool', () => {
      const { result } = renderHook(() => useWarmup());
      act(() => result.current.setCategoryFilter('vocal'));
      act(() => result.current.pickRandom());
      const filteredIds = result.current.filtered.map((g) => g.id);
      expect(filteredIds).toContain(result.current.currentGame.id);
    });

    it('falls back to full pool when filtered is empty', () => {
      const { result } = renderHook(() => useWarmup());
      // Apply filters that yield no results (combine very restrictive filters)
      act(() => {
        result.current.setPlayerFilter('6+');
        result.current.setCategoryFilter('storytelling');
        result.current.setLevelFilter('advanced');
      });
      act(() => result.current.pickRandom());
      // currentGame must still be a valid game
      const allIds = WARMUP_GAMES.map((g) => g.id);
      expect(allIds).toContain(result.current.currentGame.id);
    });

    it('changes the currentGame (runs multiple times to confirm randomness is possible)', () => {
      const { result } = renderHook(() => useWarmup());
      const initial = result.current.currentGame.id;
      let changed = false;
      for (let i = 0; i < 20; i++) {
        act(() => result.current.pickRandom());
        if (result.current.currentGame.id !== initial) { changed = true; break; }
      }
      // With 60+ games the probability of never changing in 20 tries is astronomically low
      expect(changed).toBe(true);
    });
  });
});
