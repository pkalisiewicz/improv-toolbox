import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  addFavoriteToolWithTransition,
  applyFavoriteToolsToDocument,
  FAVORITE_TOOLS_CHANGE_EVENT,
  FAVORITE_TOOLS_STORAGE_KEY,
  parseFavoriteToolsSnapshot,
  readFavoriteTools,
  readFavoriteToolsSnapshot,
  syncFavoriteToolsDocumentState,
  writeFavoriteTools,
  type FavoriteToolName,
} from '../theme/favoriteTools';

export type { FavoriteToolName } from '../theme/favoriteTools';

function notifyFavoriteToolListeners() {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(FAVORITE_TOOLS_CHANGE_EVENT));
}

function subscribeToFavoriteTools(listener: () => void) {
  if (typeof window === 'undefined') return () => {};

  syncFavoriteToolsDocumentState();

  const sync = () => {
    syncFavoriteToolsDocumentState();
    listener();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAVORITE_TOOLS_STORAGE_KEY || event.key === null) {
      sync();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(FAVORITE_TOOLS_CHANGE_EVENT, sync);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(FAVORITE_TOOLS_CHANGE_EVENT, sync);
  };
}

export function prioritizeFavoriteTools<T extends FavoriteToolName>(
  tools: readonly T[],
  favorites: ReadonlySet<FavoriteToolName>,
) {
  return [...tools].sort((a, b) => Number(favorites.has(b)) - Number(favorites.has(a)));
}

export function useFavoriteTools() {
  const favoriteSnapshot = useSyncExternalStore(
    subscribeToFavoriteTools,
    readFavoriteToolsSnapshot,
    () => '[]',
  );
  const favorites = useMemo(
    () => new Set(parseFavoriteToolsSnapshot(favoriteSnapshot)),
    [favoriteSnapshot],
  );

  const toggleFavorite = useCallback((tool: FavoriteToolName) => {
    const next = new Set(readFavoriteTools());
    const isAdding = !next.has(tool);
    if (!isAdding) {
      next.delete(tool);
    } else {
      next.add(tool);
    }

    const updateFavoriteTools = () => {
      writeFavoriteTools(next);
      applyFavoriteToolsToDocument(Array.from(next));
    };

    if (isAdding) {
      addFavoriteToolWithTransition(tool, updateFavoriteTools, notifyFavoriteToolListeners);
      return;
    }

    updateFavoriteTools();
    notifyFavoriteToolListeners();
  }, []);

  return { favorites, toggleFavorite };
}
