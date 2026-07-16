/**
 * Single source of truth for which routes live under the "More" hub.
 *
 * Used by BottomNav (to keep the "More" tab lit on any sub-page) and by
 * BackToMore (to show an in-frame back affordance on those sub-pages). Keeping
 * the list here means the two pieces of chrome can never disagree.
 */
export const MORE_PATHS = [
  '/more', '/timer', '/character', '/prompts', '/suggestions', '/formats',
  '/reflection', '/soundscape', '/status', '/spine', '/jam', '/principles',
  '/monologue', '/genres', '/harold', '/emotion', '/constraints', '/metronome',
  '/variants', '/replay', '/deconstruction', '/privacy', '/contact',
] as const;

/** True when `pathname` is a More sub-page (everything under the hub except /more itself). */
export function isMoreSubPath(pathname: string): boolean {
  return MORE_PATHS.some((p) => p !== '/more' && (pathname === p || pathname.startsWith(p + '/')));
}

/** True when `pathname` belongs to the More hub or any of its sub-pages. */
export function isMorePath(pathname: string): boolean {
  return MORE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
