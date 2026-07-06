import { WARMUP_GAMES } from '../data/warmups';
import type { WarmupGame } from '../types';

// Entry = one canonical, indexable page per named warmup game (see CONTEXT.md).
// Slug derives from the data id (snake_case -> kebab-case). Localized PL slugs
// and an {en,pl} slug pair are a later milestone; for now en === pl.
export function warmupSlug(id: string): string {
  return id.replace(/_/g, '-');
}

const BY_SLUG = new Map<string, WarmupGame>(
  WARMUP_GAMES.map((g) => [warmupSlug(g.id), g]),
);

export function warmupBySlug(slug: string | undefined): WarmupGame | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

/** All warmup Entry URLs, for the build-time prerender list. */
export function warmupEntryPaths(): string[] {
  return WARMUP_GAMES.map((g) => `/warmups/${warmupSlug(g.id)}`);
}
