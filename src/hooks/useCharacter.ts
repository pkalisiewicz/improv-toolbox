import { useCallback } from 'react';
import { OCCUPATIONS, WANTS, QUIRKS, SPEECH_PATTERNS, EMOTIONS } from '../data/characters';
import type { CharacterTrait } from '../types';
import { useRandomBag } from './useRandomBag';

export interface CharacterProfile {
  occupation: CharacterTrait;
  want: CharacterTrait;
  quirk: CharacterTrait;
  speech: CharacterTrait;
  emotion: CharacterTrait;
  status: number;
}

const STATUS_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1);

export function useCharacter() {
  const { current: occupation, draw: drawOccupation } = useRandomBag<CharacterTrait>(OCCUPATIONS);
  const { current: want, draw: drawWant } = useRandomBag<CharacterTrait>(WANTS);
  const { current: quirk, draw: drawQuirk } = useRandomBag<CharacterTrait>(QUIRKS);
  const { current: speech, draw: drawSpeech } = useRandomBag<CharacterTrait>(SPEECH_PATTERNS);
  const { current: emotion, draw: drawEmotion } = useRandomBag<CharacterTrait>(EMOTIONS);
  const { current: status, draw: drawStatus } = useRandomBag<number>(STATUS_LEVELS);

  const profile: CharacterProfile = {
    occupation,
    want,
    quirk,
    speech,
    emotion,
    status,
  };

  const regenerateAll = useCallback(() => {
    drawOccupation();
    drawWant();
    drawQuirk();
    drawSpeech();
    drawEmotion();
    drawStatus();
  }, [drawEmotion, drawOccupation, drawQuirk, drawSpeech, drawStatus, drawWant]);

  const regenerateTrait = useCallback((trait: keyof CharacterProfile) => {
    const draws: Record<keyof CharacterProfile, () => CharacterTrait | number> = {
      occupation: drawOccupation,
      want: drawWant,
      quirk: drawQuirk,
      speech: drawSpeech,
      emotion: drawEmotion,
      status: drawStatus,
    };
    draws[trait]();
  }, [drawEmotion, drawOccupation, drawQuirk, drawSpeech, drawStatus, drawWant]);

  return { profile, regenerateAll, regenerateTrait };
}
