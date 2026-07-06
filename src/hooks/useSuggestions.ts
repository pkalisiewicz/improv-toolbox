import { useState, useCallback, useMemo } from 'react';
import { SUGGESTIONS } from '../data/suggestions';
import type { Suggestion, SuggestionCategory } from '../types';
import { useRandomBag } from './useRandomBag';

export interface GrabBagResult {
  location: Suggestion;
  occupation: Suggestion;
  relationship: Suggestion;
  emotion: Suggestion;
}

export function useSuggestions() {
  const [category, setCategory] = useState<SuggestionCategory | 'grab'>('location');
  const [grabBag, setGrabBag] = useState<GrabBagResult | null>(null);
  const locations = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'location'), []);
  const occupations = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'occupation'), []);
  const relationships = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'relationship'), []);
  const emotions = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'emotion'), []);
  const movieTitles = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'movie_title'), []);
  const words = useMemo(() => SUGGESTIONS.filter((s) => s.category === 'word'), []);

  const locationBag = useRandomBag<Suggestion>(locations);
  const occupationBag = useRandomBag<Suggestion>(occupations);
  const relationshipBag = useRandomBag<Suggestion>(relationships);
  const emotionBag = useRandomBag<Suggestion>(emotions);
  const movieTitleBag = useRandomBag<Suggestion>(movieTitles);
  const wordBag = useRandomBag<Suggestion>(words);
  const [current, setCurrent] = useState<Suggestion>(locationBag.current);

  const bags = useMemo<Record<SuggestionCategory, typeof locationBag>>(() => ({
    location: locationBag,
    occupation: occupationBag,
    relationship: relationshipBag,
    emotion: emotionBag,
    movie_title: movieTitleBag,
    word: wordBag,
  }), [emotionBag, locationBag, movieTitleBag, occupationBag, relationshipBag, wordBag]);
  const pickRandom = useCallback(() => {
    if (category === 'grab') {
      setGrabBag({
        location: bags.location.draw(),
        occupation: bags.occupation.draw(),
        relationship: bags.relationship.draw(),
        emotion: bags.emotion.draw(),
      });
    } else {
      setCurrent(bags[category].draw());
    }
  }, [bags, category]);

  const changeCategory = useCallback((cat: SuggestionCategory | 'grab') => {
    setCategory(cat);
    setGrabBag(null);
    if (cat !== 'grab') {
      setCurrent(bags[cat].draw());
    }
  }, [bags]);

  return { current, category, grabBag, pickRandom, changeCategory };
}
