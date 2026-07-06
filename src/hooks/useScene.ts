import { useState, useCallback, useMemo } from 'react';
import { LOCATIONS, RELATIONSHIPS, SITUATIONS, MOODS, TIME_PERIODS } from '../data/scenes';
import type { SceneElement, ScenePreset, SceneCategory } from '../types';
import { useRandomBag } from './useRandomBag';

function scenePool<T extends SceneElement>(items: readonly T[], genre: SceneCategory | 'all'): readonly T[] {
  if (genre === 'all') return items;
  const filtered = items.filter((el) => el.category.includes(genre));
  return filtered.length > 0 ? filtered : items;
}

export function useScene() {
  const [genre, setGenreState] = useState<SceneCategory | 'all'>('all');
  const locationPool = useMemo(() => scenePool(LOCATIONS, genre), [genre]);
  const relationshipPool = useMemo(() => scenePool(RELATIONSHIPS, genre), [genre]);
  const situationPool = useMemo(() => scenePool(SITUATIONS, genre), [genre]);
  const moodPool = useMemo(() => scenePool(MOODS, genre), [genre]);
  const timePeriodPool = useMemo(() => scenePool(TIME_PERIODS, genre), [genre]);

  const { current: location, draw: drawLocation } = useRandomBag<SceneElement>(locationPool);
  const { current: relationship, draw: drawRelationship } = useRandomBag<SceneElement>(relationshipPool);
  const { current: situation, draw: drawSituation } = useRandomBag<SceneElement>(situationPool);
  const { current: mood, draw: drawMood } = useRandomBag<SceneElement>(moodPool);
  const { current: timePeriod, draw: drawTimePeriod } = useRandomBag<SceneElement>(timePeriodPool);

  const preset: ScenePreset = {
    location,
    relationship,
    situation,
    mood,
    timePeriod,
  };

  const regenerateAll = useCallback(() => {
    drawLocation();
    drawRelationship();
    drawSituation();
    drawMood();
    drawTimePeriod();
  }, [drawLocation, drawMood, drawRelationship, drawSituation, drawTimePeriod]);

  const regenerateOne = useCallback(
    (field: keyof ScenePreset) => {
      const draws: Record<keyof ScenePreset, () => SceneElement> = {
        location: drawLocation,
        relationship: drawRelationship,
        situation: drawSituation,
        mood: drawMood,
        timePeriod: drawTimePeriod,
      };
      draws[field]();
    },
    [drawLocation, drawMood, drawRelationship, drawSituation, drawTimePeriod],
  );

  const setGenre = useCallback((g: SceneCategory | 'all') => {
    setGenreState(g);
  }, []);

  return { preset, genre, regenerateAll, regenerateOne, setGenre };
}
