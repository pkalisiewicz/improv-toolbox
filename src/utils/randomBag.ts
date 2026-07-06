export type RandomBagKey = string | number;

export interface RandomBagState<T> {
  current: T;
  remaining: T[];
  poolKey: string;
}

export type RandomBagGetKey<T> = (item: T, index: number) => RandomBagKey;

const objectKeys = new WeakMap<object, number>();
let nextObjectKey = 0;

function getObjectKey(item: object): string {
  const existing = objectKeys.get(item);
  if (existing !== undefined) return `object:${existing}`;

  nextObjectKey += 1;
  objectKeys.set(item, nextObjectKey);
  return `object:${nextObjectKey}`;
}

export function defaultRandomBagGetKey<T>(item: T, index: number): RandomBagKey {
  if (item && typeof item === 'object' && 'id' in item) {
    const id = (item as { id: unknown }).id;
    if (typeof id === 'string' || typeof id === 'number') return id;
  }

  if (typeof item === 'string' || typeof item === 'number') return item;
  if (item && typeof item === 'object') return getObjectKey(item);
  return index;
}

export function getRandomBagPoolKey<T>(
  items: readonly T[],
  getKey: RandomBagGetKey<T> = defaultRandomBagGetKey,
): string {
  return items.map((item, index) => `${index}:${String(getKey(item, index))}`).join('|');
}

export function shuffleItems<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function sameRandomBagItem<T>(
  a: T,
  b: T,
  getKey: RandomBagGetKey<T>,
): boolean {
  return getKey(a, 0) === getKey(b, 0);
}

function shuffledRound<T>(
  items: readonly T[],
  getKey: RandomBagGetKey<T>,
  avoidFirst?: T,
): T[] {
  const shuffled = shuffleItems(items);

  if (
    avoidFirst !== undefined &&
    shuffled.length > 1 &&
    sameRandomBagItem(shuffled[0], avoidFirst, getKey)
  ) {
    const swapIndex = shuffled.findIndex((item) => !sameRandomBagItem(item, avoidFirst, getKey));
    if (swapIndex > 0) {
      [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
    }
  }

  return shuffled;
}

function assertNonEmpty<T>(items: readonly T[]): asserts items is readonly [T, ...T[]] {
  if (items.length === 0) {
    throw new Error('Random bag needs at least one item.');
  }
}

export function createRandomBagState<T>(
  items: readonly T[],
  poolKey: string,
  getKey: RandomBagGetKey<T> = defaultRandomBagGetKey,
  avoidFirst?: T,
): RandomBagState<T> {
  assertNonEmpty(items);

  const [current, ...remaining] = shuffledRound(items, getKey, avoidFirst);
  return { current, remaining, poolKey };
}

export function drawRandomBagItem<T>(
  state: RandomBagState<T>,
  items: readonly T[],
  poolKey: string,
  getKey: RandomBagGetKey<T> = defaultRandomBagGetKey,
): RandomBagState<T> {
  assertNonEmpty(items);

  const round = state.remaining.length > 0
    ? state.remaining
    : shuffledRound(items, getKey, state.current);
  const [current, ...remaining] = round;
  return { current, remaining, poolKey };
}
