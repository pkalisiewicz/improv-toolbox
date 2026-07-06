import { useCallback, useMemo } from 'react';
import { SPINE_BEATS } from '../data/spine';
import { useRandomBag } from './useRandomBag';

export function useSpine() {
  const beat0 = useRandomBag<string>(SPINE_BEATS[0].seeds);
  const beat1 = useRandomBag<string>(SPINE_BEATS[1].seeds);
  const beat2 = useRandomBag<string>(SPINE_BEATS[2].seeds);
  const beat3 = useRandomBag<string>(SPINE_BEATS[3].seeds);
  const beat4 = useRandomBag<string>(SPINE_BEATS[4].seeds);
  const beat5 = useRandomBag<string>(SPINE_BEATS[5].seeds);
  const currentSeeds = [
    beat0.current,
    beat1.current,
    beat2.current,
    beat3.current,
    beat4.current,
    beat5.current,
  ];
  const drawBeats = useMemo(() => [
    beat0.draw,
    beat1.draw,
    beat2.draw,
    beat3.draw,
    beat4.draw,
    beat5.draw,
  ], [beat0.draw, beat1.draw, beat2.draw, beat3.draw, beat4.draw, beat5.draw]);

  const rerollBeat = useCallback((index: number) => {
    drawBeats[index]?.();
  }, [drawBeats]);

  const regenerateAll = useCallback(() => {
    drawBeats.forEach((draw) => draw());
  }, [drawBeats]);

  return { currentSeeds, rerollBeat, regenerateAll };
}
