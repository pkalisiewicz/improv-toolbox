import type { ComponentType } from 'react';
import type { IconProps } from '../components/icons/createIcon';
import {
  IconMain, IconWheel, IconScene, IconWarmup, IconFacts, IconMore, IconTimer, IconCharacter,
  IconPrompts, IconSuggestions, IconFormats, IconReflection, IconSoundscape, IconStatus,
  IconSpine, IconJam, IconPrinciples, IconMonologue, IconGenres, IconHarold, IconEmotion,
  IconConstraints, IconMetronome, IconVariants, IconReplay, IconDeconstruction,
} from '../components/icons';

export type FeatureName =
  | 'wheel' | 'scene' | 'warmup' | 'facts' | 'more'
  | 'timer' | 'character' | 'prompts' | 'suggestions' | 'formats'
  | 'reflection' | 'soundscape' | 'status' | 'spine' | 'jam'
  | 'principles' | 'monologue' | 'genres' | 'harold' | 'emotion'
  | 'constraints' | 'metronome' | 'variants' | 'replay' | 'deconstruction'
  | 'splash';

export interface FeatureTheme {
  /** Vivid mid-tone — top accent, active states. */
  accent: string;
  /** Light tint — soft fills/backgrounds. */
  soft: string;
  /** Readable-on-white dark tone — text/icons on light surfaces (≥4.5:1). */
  ink: string;
  /** Custom rounded-line glyph for this feature. */
  Icon: ComponentType<IconProps>;
}

/**
 * ONE accent used identically across the app (anti-slop discipline). Features
 * are distinguished by their custom icon, not by color. `A` is the single
 * source for the brand-gold accent; reverting to per-feature hues later just
 * means giving each entry its own accent/soft/ink.
 */
const A = {
  accent: 'var(--color-brand-500)', /* brand gold — top accent bar, active nav states */
  soft:   'var(--color-brand-100)', /* light gold tint — soft icon/chip fills on paper */
  ink:    'var(--color-brand-700)', /* bronze — glyphs/text on soft + paper (AA on light) */
} as const;

export const FEATURES: Record<FeatureName, FeatureTheme> = {
  wheel:          { ...A, Icon: IconWheel },
  scene:          { ...A, Icon: IconScene },
  warmup:         { ...A, Icon: IconWarmup },
  facts:          { ...A, Icon: IconFacts },
  more:           { ...A, Icon: IconMore },
  timer:          { ...A, Icon: IconTimer },
  character:      { ...A, Icon: IconCharacter },
  prompts:        { ...A, Icon: IconPrompts },
  suggestions:    { ...A, Icon: IconSuggestions },
  formats:        { ...A, Icon: IconFormats },
  reflection:     { ...A, Icon: IconReflection },
  soundscape:     { ...A, Icon: IconSoundscape },
  status:         { ...A, Icon: IconStatus },
  spine:          { ...A, Icon: IconSpine },
  jam:            { ...A, Icon: IconJam },
  principles:     { ...A, Icon: IconPrinciples },
  monologue:      { ...A, Icon: IconMonologue },
  genres:         { ...A, Icon: IconGenres },
  harold:         { ...A, Icon: IconHarold },
  emotion:        { ...A, Icon: IconEmotion },
  constraints:    { ...A, Icon: IconConstraints },
  metronome:      { ...A, Icon: IconMetronome },
  variants:       { ...A, Icon: IconVariants },
  replay:         { ...A, Icon: IconReplay },
  deconstruction: { ...A, Icon: IconDeconstruction },
  splash:         { ...A, Icon: IconMain },
};

/** Inline style object setting the per-feature CSS variables. */
export function featureVars(name: FeatureName): Record<string, string> {
  const f = FEATURES[name];
  return {
    '--feature': f.accent,
    '--feature-soft': f.soft,
    '--feature-ink': f.ink,
  };
}
