import type { TabId } from '../../types';
import type { FeatureName } from '../../theme/features';

export interface PrimaryNavItem {
  id: TabId;
  path: string;
  labelKey: string;
}

export type ToolNavId = Exclude<FeatureName, 'more' | 'splash'>;

export interface ToolNavItem {
  id: ToolNavId;
  path: string;
  titleKey: string;
}

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: 'splash', path: '/', labelKey: 'nav.main' },
  { id: 'wheel', path: '/wheel', labelKey: 'nav.wheel' },
  { id: 'scene', path: '/scene', labelKey: 'nav.scene' },
  { id: 'warmup', path: '/warmup', labelKey: 'nav.warmup' },
  { id: 'facts', path: '/facts', labelKey: 'nav.facts' },
];

export const TOOL_NAV_ITEMS: ToolNavItem[] = [
  { id: 'wheel', path: '/wheel', titleKey: 'splash.features.wheel.title' },
  { id: 'scene', path: '/scene', titleKey: 'splash.features.scene.title' },
  { id: 'warmup', path: '/warmup', titleKey: 'splash.features.warmup.title' },
  { id: 'facts', path: '/facts', titleKey: 'splash.features.facts.title' },
  { id: 'character', path: '/character', titleKey: 'splash.features.character.title' },
  { id: 'prompts', path: '/prompts', titleKey: 'splash.features.prompts.title' },
  { id: 'suggestions', path: '/suggestions', titleKey: 'splash.features.suggestions.title' },
  { id: 'monologue', path: '/monologue', titleKey: 'splash.features.monologue.title' },
  { id: 'emotion', path: '/emotion', titleKey: 'splash.features.emotion.title' },
  { id: 'constraints', path: '/constraints', titleKey: 'splash.features.constraints.title' },
  { id: 'replay', path: '/replay', titleKey: 'splash.features.replay.title' },
  { id: 'variants', path: '/variants', titleKey: 'splash.features.variants.title' },
  { id: 'spine', path: '/spine', titleKey: 'splash.features.spine.title' },
  { id: 'formats', path: '/formats', titleKey: 'splash.features.formats.title' },
  { id: 'principles', path: '/principles', titleKey: 'splash.features.principles.title' },
  { id: 'genres', path: '/genres', titleKey: 'splash.features.genres.title' },
  { id: 'timer', path: '/timer', titleKey: 'splash.features.timer.title' },
  { id: 'metronome', path: '/metronome', titleKey: 'splash.features.metronome.title' },
  { id: 'soundscape', path: '/soundscape', titleKey: 'splash.features.soundscape.title' },
  { id: 'status', path: '/status', titleKey: 'splash.features.status.title' },
  { id: 'harold', path: '/harold', titleKey: 'splash.features.harold.title' },
  { id: 'jam', path: '/jam', titleKey: 'splash.features.jam.title' },
  { id: 'deconstruction', path: '/deconstruction', titleKey: 'splash.features.deconstruction.title' },
  { id: 'reflection', path: '/reflection', titleKey: 'splash.features.reflection.title' },
];

export function isPrimaryNavItemActive(item: PrimaryNavItem, pathname: string) {
  if (item.path === '/') return pathname === '/';
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function isToolNavItemActive(item: ToolNavItem, pathname: string) {
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}
