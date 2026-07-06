import { describe, it, expect } from 'vitest';
import { ARCHETYPES } from '../../data/archetypes';

describe('ARCHETYPES data', () => {
  it('contains at least 6 archetypes', () => {
    expect(ARCHETYPES.length).toBeGreaterThanOrEqual(6);
  });

  it('every archetype has a unique id', () => {
    const ids = ARCHETYPES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every archetype has required string fields', () => {
    ARCHETYPES.forEach((a) => {
      expect(typeof a.id).toBe('string');
      expect(a.id.length).toBeGreaterThan(0);
      expect(typeof a.nameKey).toBe('string');
      expect(a.nameKey.length).toBeGreaterThan(0);
      expect(typeof a.descriptionKey).toBe('string');
      expect(a.descriptionKey.length).toBeGreaterThan(0);
      expect(typeof a.color).toBe('string');
      expect(a.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
