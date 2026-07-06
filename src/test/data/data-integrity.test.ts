import { describe, it, expect } from 'vitest';
import { WARMUP_GAMES } from '../../data/warmups';
import { IMPROV_FACTS } from '../../data/facts';
import { PROMPT_CARDS } from '../../data/prompts';
import { SUGGESTIONS } from '../../data/suggestions';
import { REFLECTION_PROMPTS } from '../../data/reflection';
import { IMPROV_FORMATS } from '../../data/formats';
import { MONOLOGUE_SEEDS } from '../../data/monologue';
import { IMPROV_PRINCIPLES } from '../../data/principles';
import { REPLAY_CARDS } from '../../data/replay';
import { SCENE_CONSTRAINTS } from '../../data/constraints';
import { GAME_MODIFIERS } from '../../data/modifiers';
import { EMOTIONS } from '../../data/emotions';
import { LOCATIONS, RELATIONSHIPS, SITUATIONS, MOODS, TIME_PERIODS } from '../../data/scenes';
import { GENRE_CARDS } from '../../data/genres';
import { SPINE_BEATS } from '../../data/spine';
import { OCCUPATIONS, WANTS, QUIRKS, SPEECH_PATTERNS, EMOTIONS as CHARACTER_EMOTIONS } from '../../data/characters';

// ── Helper ────────────────────────────────────────────────────────────────────
function assertUniqueIds(items: { id: string }[], name: string) {
  const ids = items.map((i) => i.id);
  expect(new Set(ids).size, `${name} has duplicate ids`).toBe(ids.length);
}

function assertNonEmpty(items: unknown[], name: string) {
  expect(items.length, `${name} should not be empty`).toBeGreaterThan(0);
}

// ── Warmup Games ─────────────────────────────────────────────────────────────
describe('WARMUP_GAMES', () => {
  it('is non-empty', () => assertNonEmpty(WARMUP_GAMES, 'WARMUP_GAMES'));
  it('has unique ids', () => assertUniqueIds(WARMUP_GAMES, 'WARMUP_GAMES'));
  it('every game has valid minPlayers and maxPlayers', () => {
    WARMUP_GAMES.forEach((g) => {
      expect(g.minPlayers).toBeGreaterThan(0);
      if (g.maxPlayers !== null) {
        expect(g.maxPlayers).toBeGreaterThanOrEqual(g.minPlayers);
      }
    });
  });
  it('every game has a positive durationMinutes', () => {
    WARMUP_GAMES.forEach((g) => {
      expect(g.durationMinutes).toBeGreaterThan(0);
    });
  });
  it('every game has required string fields', () => {
    WARMUP_GAMES.forEach((g) => {
      expect(typeof g.nameKey).toBe('string');
      expect(g.nameKey.length).toBeGreaterThan(0);
      expect(typeof g.descriptionKey).toBe('string');
      expect(g.descriptionKey.length).toBeGreaterThan(0);
    });
  });
  it('covers all six categories', () => {
    const categories = new Set(WARMUP_GAMES.map((g) => g.category));
    (['physical', 'vocal', 'focus', 'ensemble', 'storytelling', 'character'] as const).forEach(
      (cat) => expect(categories).toContain(cat),
    );
  });
  it('covers all three levels', () => {
    const levels = new Set(WARMUP_GAMES.map((g) => g.level));
    (['beginner', 'intermediate', 'advanced'] as const).forEach(
      (lvl) => expect(levels).toContain(lvl),
    );
  });
});

// ── Improv Facts ──────────────────────────────────────────────────────────────
describe('IMPROV_FACTS', () => {
  it('is non-empty', () => assertNonEmpty(IMPROV_FACTS, 'IMPROV_FACTS'));
  it('has unique ids', () => assertUniqueIds(IMPROV_FACTS, 'IMPROV_FACTS'));
  it('every fact has a textKey', () => {
    IMPROV_FACTS.forEach((f) => {
      expect(typeof f.textKey).toBe('string');
      expect(f.textKey.length).toBeGreaterThan(0);
    });
  });
  it('covers all fact categories', () => {
    const cats = new Set(IMPROV_FACTS.map((f) => f.category));
    (['history', 'technique', 'tips', 'famous'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Prompt Cards ──────────────────────────────────────────────────────────────
describe('PROMPT_CARDS', () => {
  it('is non-empty', () => assertNonEmpty(PROMPT_CARDS, 'PROMPT_CARDS'));
  it('has unique ids', () => assertUniqueIds(PROMPT_CARDS, 'PROMPT_CARDS'));
  it('covers all prompt categories', () => {
    const cats = new Set(PROMPT_CARDS.map((c) => c.category));
    (['first_line', 'occupation', 'location', 'what_not_to_say', 'title'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
  it('every category has at least 1 card', () => {
    (['first_line', 'occupation', 'location', 'what_not_to_say', 'title'] as const).forEach(
      (cat) => {
        const count = PROMPT_CARDS.filter((c) => c.category === cat).length;
        expect(count, `Category ${cat} should have prompts`).toBeGreaterThan(0);
      },
    );
  });
});

// ── Suggestions ───────────────────────────────────────────────────────────────
describe('SUGGESTIONS', () => {
  it('is non-empty', () => assertNonEmpty(SUGGESTIONS, 'SUGGESTIONS'));
  it('has unique ids', () => assertUniqueIds(SUGGESTIONS, 'SUGGESTIONS'));
  it('covers all suggestion categories', () => {
    const cats = new Set(SUGGESTIONS.map((s) => s.category));
    (['location', 'occupation', 'relationship', 'emotion', 'movie_title', 'word'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
  it('grab bag categories each have at least 1 suggestion', () => {
    (['location', 'occupation', 'relationship', 'emotion'] as const).forEach((cat) => {
      const count = SUGGESTIONS.filter((s) => s.category === cat).length;
      expect(count, `Grab bag category ${cat} must have suggestions`).toBeGreaterThan(0);
    });
  });
});

// ── Reflection Prompts ────────────────────────────────────────────────────────
describe('REFLECTION_PROMPTS', () => {
  it('is non-empty', () => assertNonEmpty(REFLECTION_PROMPTS, 'REFLECTION_PROMPTS'));
  it('has unique ids', () => assertUniqueIds(REFLECTION_PROMPTS, 'REFLECTION_PROMPTS'));
  it('covers all reflection categories', () => {
    const cats = new Set(REFLECTION_PROMPTS.map((p) => p.category));
    (['game', 'crow', 'ensemble', 'edit', 'character'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Improv Formats ────────────────────────────────────────────────────────────
describe('IMPROV_FORMATS', () => {
  it('is non-empty', () => assertNonEmpty(IMPROV_FORMATS, 'IMPROV_FORMATS'));
  it('has unique ids', () => assertUniqueIds(IMPROV_FORMATS, 'IMPROV_FORMATS'));
  it('every format has valid player range', () => {
    IMPROV_FORMATS.forEach((f) => {
      expect(f.minPlayers).toBeGreaterThan(0);
      if (f.maxPlayers !== null) {
        expect(f.maxPlayers).toBeGreaterThanOrEqual(f.minPlayers);
      }
    });
  });
  it('covers all difficulty levels', () => {
    const diffs = new Set(IMPROV_FORMATS.map((f) => f.difficulty));
    (['beginner', 'intermediate', 'advanced'] as const).forEach(
      (d) => expect(diffs).toContain(d),
    );
  });
});

// ── Monologue Seeds ───────────────────────────────────────────────────────────
describe('MONOLOGUE_SEEDS', () => {
  it('is non-empty', () => assertNonEmpty(MONOLOGUE_SEEDS, 'MONOLOGUE_SEEDS'));
  it('has unique ids', () => assertUniqueIds(MONOLOGUE_SEEDS, 'MONOLOGUE_SEEDS'));
  it('covers all monologue categories', () => {
    const cats = new Set(MONOLOGUE_SEEDS.map((s) => s.category));
    (['embarrassment', 'surprise', 'pride', 'fear', 'childhood', 'work', 'relationships'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Improv Principles ─────────────────────────────────────────────────────────
describe('IMPROV_PRINCIPLES', () => {
  it('is non-empty', () => assertNonEmpty(IMPROV_PRINCIPLES, 'IMPROV_PRINCIPLES'));
  it('has unique ids', () => assertUniqueIds(IMPROV_PRINCIPLES, 'IMPROV_PRINCIPLES'));
  it('covers all principle categories', () => {
    const cats = new Set(IMPROV_PRINCIPLES.map((p) => p.category));
    (['foundation', 'character', 'status', 'editing', 'ensemble', 'stagecraft'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
  it('every principle has nameKey and textKey', () => {
    IMPROV_PRINCIPLES.forEach((p) => {
      expect(typeof p.nameKey).toBe('string');
      expect(p.nameKey.length).toBeGreaterThan(0);
      expect(typeof p.textKey).toBe('string');
      expect(p.textKey.length).toBeGreaterThan(0);
    });
  });
});

// ── Replay Cards ──────────────────────────────────────────────────────────────
describe('REPLAY_CARDS', () => {
  it('is non-empty', () => assertNonEmpty(REPLAY_CARDS, 'REPLAY_CARDS'));
  it('has unique ids', () => assertUniqueIds(REPLAY_CARDS, 'REPLAY_CARDS'));
  it('covers all replay categories', () => {
    const cats = new Set(REPLAY_CARDS.map((c) => c.category));
    (['physicality', 'genre', 'emotional', 'structural', 'character'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Scene Constraints ─────────────────────────────────────────────────────────
describe('SCENE_CONSTRAINTS', () => {
  it('is non-empty', () => assertNonEmpty(SCENE_CONSTRAINTS, 'SCENE_CONSTRAINTS'));
  it('has unique ids', () => assertUniqueIds(SCENE_CONSTRAINTS, 'SCENE_CONSTRAINTS'));
  it('covers all constraint categories', () => {
    const cats = new Set(SCENE_CONSTRAINTS.map((c) => c.category));
    (['speech', 'physical', 'structural', 'relational'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Game Modifiers ────────────────────────────────────────────────────────────
describe('GAME_MODIFIERS', () => {
  it('is non-empty', () => assertNonEmpty(GAME_MODIFIERS, 'GAME_MODIFIERS'));
  it('has unique ids', () => assertUniqueIds(GAME_MODIFIERS, 'GAME_MODIFIERS'));
  it('covers all modifier categories', () => {
    const cats = new Set(GAME_MODIFIERS.map((m) => m.category));
    (['restriction', 'role', 'format', 'constraint'] as const).forEach(
      (cat) => expect(cats).toContain(cat),
    );
  });
});

// ── Emotions ──────────────────────────────────────────────────────────────────
describe('EMOTIONS', () => {
  it('is non-empty', () => assertNonEmpty(EMOTIONS, 'EMOTIONS'));
  it('has unique ids', () => assertUniqueIds(EMOTIONS, 'EMOTIONS'));
  it('covers all emotion families', () => {
    const families = new Set(EMOTIONS.map((e) => e.family));
    (['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust'] as const).forEach(
      (f) => expect(families).toContain(f),
    );
  });
});

// ── Scene Data ────────────────────────────────────────────────────────────────
describe('Scene data (LOCATIONS, RELATIONSHIPS, SITUATIONS, MOODS, TIME_PERIODS)', () => {
  it('LOCATIONS is non-empty with unique ids', () => {
    assertNonEmpty(LOCATIONS, 'LOCATIONS');
    assertUniqueIds(LOCATIONS, 'LOCATIONS');
  });
  it('RELATIONSHIPS is non-empty with unique ids', () => {
    assertNonEmpty(RELATIONSHIPS, 'RELATIONSHIPS');
    assertUniqueIds(RELATIONSHIPS, 'RELATIONSHIPS');
  });
  it('SITUATIONS is non-empty with unique ids', () => {
    assertNonEmpty(SITUATIONS, 'SITUATIONS');
    assertUniqueIds(SITUATIONS, 'SITUATIONS');
  });
  it('MOODS is non-empty with unique ids', () => {
    assertNonEmpty(MOODS, 'MOODS');
    assertUniqueIds(MOODS, 'MOODS');
  });
  it('TIME_PERIODS is non-empty with unique ids', () => {
    assertNonEmpty(TIME_PERIODS, 'TIME_PERIODS');
    assertUniqueIds(TIME_PERIODS, 'TIME_PERIODS');
  });
  it('every scene element has at least one category', () => {
    [...LOCATIONS, ...RELATIONSHIPS, ...SITUATIONS, ...MOODS, ...TIME_PERIODS].forEach((el) => {
      expect(el.category.length).toBeGreaterThan(0);
    });
  });
});

// ── Genre Cards ───────────────────────────────────────────────────────────────
describe('GENRE_CARDS', () => {
  it('is non-empty', () => assertNonEmpty(GENRE_CARDS, 'GENRE_CARDS'));
  it('has unique ids', () => assertUniqueIds(GENRE_CARDS, 'GENRE_CARDS'));
  it('every genre card has at least one tip key', () => {
    GENRE_CARDS.forEach((g) => {
      expect(g.tipKeys.length).toBeGreaterThan(0);
    });
  });
});

// ── Spine Beats ───────────────────────────────────────────────────────────────
describe('SPINE_BEATS', () => {
  it('has exactly 6 beats', () => {
    expect(SPINE_BEATS).toHaveLength(6);
  });
  it('every beat has a non-empty seeds array', () => {
    SPINE_BEATS.forEach((beat) => {
      expect(beat.seeds.length).toBeGreaterThan(0);
    });
  });
  it('every beat has unique id', () => {
    const ids = SPINE_BEATS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Character Trait Pools ─────────────────────────────────────────────────────
describe('Character trait pools', () => {
  const pools = [
    { name: 'OCCUPATIONS', data: OCCUPATIONS },
    { name: 'WANTS', data: WANTS },
    { name: 'QUIRKS', data: QUIRKS },
    { name: 'SPEECH_PATTERNS', data: SPEECH_PATTERNS },
    { name: 'CHARACTER_EMOTIONS', data: CHARACTER_EMOTIONS },
  ];

  pools.forEach(({ name, data }) => {
    it(`${name} is non-empty with unique ids`, () => {
      assertNonEmpty(data, name);
      assertUniqueIds(data, name);
    });
    it(`${name} every entry has a textKey`, () => {
      data.forEach((item) => {
        expect(typeof item.textKey).toBe('string');
        expect(item.textKey.length).toBeGreaterThan(0);
      });
    });
  });
});
