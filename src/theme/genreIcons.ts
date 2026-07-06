import { createElement, type ComponentType } from 'react';
import type { IconProps } from '../components/icons/createIcon';
import {
  IconBolt,
  IconEye,
  IconEyeOff,
  IconFormats,
  IconMetronome,
  IconScene,
  IconSparkles,
  IconTarget,
  IconEmotion,
} from '../components/icons';

const GENRE_ICONS: Record<string, ComponentType<IconProps>> = {
  horror: IconEyeOff,
  western: IconTarget,
  film_noir: IconEye,
  musical: IconMetronome,
  documentary: IconFormats,
  sci_fi: IconSparkles,
  romance: IconEmotion,
  action: IconBolt,
};

export function getGenreIcon(id: string): ComponentType<IconProps> {
  return GENRE_ICONS[id] ?? IconScene;
}

interface GenreGlyphProps extends IconProps {
  id: string;
}

export function GenreGlyph({ id, ...props }: GenreGlyphProps) {
  return createElement(getGenreIcon(id), props);
}
