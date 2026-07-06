import type { FeatureName } from './features';

export type FavoriteToolName = Exclude<FeatureName, 'more' | 'splash'>;

export const FAVORITE_TOOLS_STORAGE_KEY = 'improv.favoriteTools.v1';
export const FAVORITE_TOOLS_CHANGE_EVENT = 'improv-favorite-tools-change';

export const FAVORITE_TOOL_NAMES = [
  'wheel',
  'scene',
  'warmup',
  'facts',
  'timer',
  'character',
  'prompts',
  'suggestions',
  'formats',
  'reflection',
  'soundscape',
  'status',
  'spine',
  'jam',
  'principles',
  'monologue',
  'genres',
  'harold',
  'emotion',
  'constraints',
  'metronome',
  'variants',
  'replay',
  'deconstruction',
] as const satisfies readonly FavoriteToolName[];

const FAVORITE_TOOL_NAME_SET = new Set<string>(FAVORITE_TOOL_NAMES);
const EMPTY_FAVORITES_SNAPSHOT = '[]';
const FAVORITE_FLIP_DURATION = 240;
const FAVORITE_FEEDBACK_DURATION = 140;
const FAVORITE_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const FAVORITE_MOTION_SELECTOR = '[data-favorite-card], [data-favorite-reflow]';

interface FavoriteMotionSnapshot {
  element: HTMLElement;
  rect: DOMRect;
}

function normalizeFavoriteTools(value: unknown): FavoriteToolName[] {
  if (!Array.isArray(value)) return [];

  const next: FavoriteToolName[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== 'string' || !FAVORITE_TOOL_NAME_SET.has(item) || seen.has(item)) {
      continue;
    }

    seen.add(item);
    next.push(item as FavoriteToolName);
  }

  return next;
}

export function parseFavoriteToolsSnapshot(stored: string | null): FavoriteToolName[] {
  try {
    return normalizeFavoriteTools(JSON.parse(stored ?? EMPTY_FAVORITES_SNAPSHOT));
  } catch {
    return [];
  }
}

export function readFavoriteToolsSnapshot() {
  if (typeof window === 'undefined') return EMPTY_FAVORITES_SNAPSHOT;

  try {
    return window.localStorage.getItem(FAVORITE_TOOLS_STORAGE_KEY) ?? EMPTY_FAVORITES_SNAPSHOT;
  } catch {
    return EMPTY_FAVORITES_SNAPSHOT;
  }
}

export function readFavoriteTools() {
  return parseFavoriteToolsSnapshot(readFavoriteToolsSnapshot());
}

export function writeFavoriteTools(favorites: Iterable<FavoriteToolName>) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(FAVORITE_TOOLS_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch {
    // Favorites are a convenience. Storage failures should not block navigation.
  }
}

export function applyFavoriteToolsToDocument(favorites: readonly FavoriteToolName[]) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.favoriteTools = favorites.join(' ');
  root.dataset.hasFavoriteTools = favorites.length > 0 ? 'true' : 'false';
}

function canAnimateFavoriteFeedback() {
  if (typeof window === 'undefined') return false;
  if (typeof document === 'undefined') return false;
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  return true;
}

function findVisibleToolCard(selector: string) {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return cards.find((card) => {
    const rect = card.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && getComputedStyle(card).display !== 'none';
  }) ?? null;
}

function takeFavoriteMotionSnapshots() {
  return Array.from(document.querySelectorAll<HTMLElement>(FAVORITE_MOTION_SELECTOR))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(element).display !== 'none';
    })
    .map((element) => ({
      element,
      rect: element.getBoundingClientRect(),
    }));
}

function playLayoutFlip(snapshots: FavoriteMotionSnapshot[]) {
  for (const { element, rect: before } of snapshots) {
    const after = element.getBoundingClientRect();
    const x = before.left - after.left;
    const y = before.top - after.top;

    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) continue;
    if (typeof element.animate !== 'function') continue;

    element.animate(
      [
        { transform: `translate3d(${x}px, ${y}px, 0)` },
        { transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: FAVORITE_FLIP_DURATION,
        easing: FAVORITE_EASING,
      },
    );
  }
}

function animateFavoriteHeart(tool: FavoriteToolName) {
  document
    .querySelectorAll<HTMLElement>(`[data-favorite-control="${tool}"] [data-favorite-button-shell]`)
    .forEach((shell) => {
      if (typeof shell.animate !== 'function') return;

      shell.animate(
        [
          { transform: 'scale(0.9)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: FAVORITE_FEEDBACK_DURATION,
          easing: FAVORITE_EASING,
        },
      );
    });
}

function animateFavoriteCardToShelf(tool: FavoriteToolName, sourceRect: DOMRect | null) {
  const favoriteCard = findVisibleToolCard(`[data-favorite-card="${tool}"]`);
  if (!favoriteCard || typeof favoriteCard.animate !== 'function') return;

  const targetRect = favoriteCard.getBoundingClientRect();
  const y = sourceRect && sourceRect.top > targetRect.top ? 12 : -8;
  const previousZIndex = favoriteCard.style.zIndex;
  const previousTransformOrigin = favoriteCard.style.transformOrigin;

  favoriteCard.style.zIndex = '30';
  favoriteCard.style.transformOrigin = '50% 40%';

  const animation = favoriteCard.animate(
    [
      {
        opacity: 0,
        transform: `translate3d(0, ${y}px, 0) scale(0.985)`,
      },
      {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
      },
    ],
    {
      duration: 180,
      easing: FAVORITE_EASING,
    },
  );

  void animation.finished.finally(() => {
    favoriteCard.style.zIndex = previousZIndex;
    favoriteCard.style.transformOrigin = previousTransformOrigin;
  });
}

export function addFavoriteToolWithTransition(
  tool: FavoriteToolName,
  updateFavoriteTools: () => void,
  notifyFavoriteToolsChanged: () => void,
) {
  if (!canAnimateFavoriteFeedback()) {
    updateFavoriteTools();
    notifyFavoriteToolsChanged();
    return;
  }

  const sourceCard = findVisibleToolCard(`[data-tool-card-zone="all"][data-tool-card="${tool}"]`);
  const sourceRect = sourceCard?.getBoundingClientRect() ?? null;
  const snapshots = takeFavoriteMotionSnapshots();

  updateFavoriteTools();
  notifyFavoriteToolsChanged();

  requestAnimationFrame(() => {
    playLayoutFlip(snapshots);
    animateFavoriteCardToShelf(tool, sourceRect);
    animateFavoriteHeart(tool);
  });
}

export function syncFavoriteToolsDocumentState() {
  const favorites = readFavoriteTools();
  applyFavoriteToolsToDocument(favorites);
  return favorites;
}

export const FAVORITE_TOOLS_INIT_SCRIPT = `(function(){var k='${FAVORITE_TOOLS_STORAGE_KEY}',a=${JSON.stringify(FAVORITE_TOOL_NAMES)},d=document.documentElement;function n(s){try{var p=JSON.parse(s||'[]');if(!Array.isArray(p))return [];}catch(_){return [];}var o=[],m={};for(var x=0;x<p.length;x++){var v=p[x];if(typeof v==='string'&&a.indexOf(v)>-1&&!m[v]){m[v]=1;o.push(v)}}return o}function r(f){d.dataset.favoriteTools=f.join(' ');d.dataset.hasFavoriteTools=f.length?'true':'false'}try{r(n(localStorage.getItem(k)))}catch(_){r([])}})();`;
