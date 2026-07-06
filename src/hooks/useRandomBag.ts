import { useState } from 'react';
import {
  createRandomBagState,
  defaultRandomBagGetKey,
  drawRandomBagItem,
  getRandomBagPoolKey,
  type RandomBagGetKey,
  type RandomBagState,
} from '../utils/randomBag';

interface UseRandomBagOptions<T> {
  getKey?: RandomBagGetKey<T>;
  poolKey?: string;
}

interface UseRandomBagResult<T> {
  current: T;
  draw: () => T;
  reset: () => T;
  remaining: number;
  total: number;
}

export function useRandomBag<T>(
  items: readonly T[],
  options: UseRandomBagOptions<T> = {},
): UseRandomBagResult<T> {
  const getKey = options.getKey ?? defaultRandomBagGetKey;
  const poolKey = options.poolKey ?? getRandomBagPoolKey(items, getKey);
  const [state, setState] = useState<RandomBagState<T>>(() =>
    createRandomBagState(items, poolKey, getKey),
  );

  let activeState = state;
  if (activeState.poolKey !== poolKey) {
    activeState = createRandomBagState(items, poolKey, getKey, activeState.current);
    setState(activeState);
  }

  const draw = () => {
    const nextState = drawRandomBagItem(activeState, items, poolKey, getKey);
    setState(nextState);
    return nextState.current;
  };

  const reset = () => {
    const nextState = createRandomBagState(items, poolKey, getKey, activeState.current);
    setState(nextState);
    return nextState.current;
  };

  return {
    current: activeState.current,
    draw,
    reset,
    remaining: activeState.remaining.length,
    total: items.length,
  };
}
