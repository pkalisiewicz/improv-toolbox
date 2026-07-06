import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useRandomBag } from '../../hooks/useRandomBag';

const ITEMS = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
  { id: 'd', label: 'D' },
];

describe('useRandomBag', () => {
  it('draws every item once before repeating', () => {
    const { result } = renderHook(() => useRandomBag(ITEMS));
    const drawn = [result.current.current.id];

    for (let i = 1; i < ITEMS.length; i++) {
      act(() => {
        drawn.push(result.current.draw().id);
      });
    }

    expect(new Set(drawn).size).toBe(ITEMS.length);
  });

  it('does not repeat the last item when a new round starts', () => {
    const { result } = renderHook(() => useRandomBag(ITEMS));

    for (let i = 1; i < ITEMS.length; i++) {
      act(() => {
        result.current.draw();
      });
    }

    const lastInRound = result.current.current.id;
    let firstInNextRound = '';
    act(() => {
      firstInNextRound = result.current.draw().id;
    });

    expect(firstInNextRound).not.toBe(lastInRound);
  });

  it('switches immediately to a new pool when the item set changes', () => {
    const firstPool = ITEMS.slice(0, 2);
    const secondPool = ITEMS.slice(2);
    const { result, rerender } = renderHook(
      ({ items }) => useRandomBag(items),
      { initialProps: { items: firstPool } },
    );

    expect(firstPool.map((item) => item.id)).toContain(result.current.current.id);

    rerender({ items: secondPool });

    expect(secondPool.map((item) => item.id)).toContain(result.current.current.id);
  });
});
