import { createElement, type CSSProperties, type HTMLAttributes } from 'react';
import callbackIcon from '../assets/deconstruction-icons/callback.png';
import characterIcon from '../assets/deconstruction-icons/character.png';
import gameMoveIcon from '../assets/deconstruction-icons/game-move.png';
import miscIcon from '../assets/deconstruction-icons/misc.png';
import sceneIcon from '../assets/deconstruction-icons/scene.png';
import themeIcon from '../assets/deconstruction-icons/theme.png';
import type { NoteCategory } from '../types';

const NOTE_CATEGORY_ICON_SRC: Record<NoteCategory, string> = {
  scene: sceneIcon,
  theme: themeIcon,
  callback: callbackIcon,
  game_move: gameMoveIcon,
  misc: miscIcon,
  character: characterIcon,
};

export function getNoteCategoryIconSrc(id: NoteCategory): string {
  return NOTE_CATEGORY_ICON_SRC[id] ?? sceneIcon;
}

interface NoteCategoryGlyphProps extends HTMLAttributes<HTMLSpanElement> {
  id: NoteCategory;
  size?: number;
  strokeWidth?: number;
}

export function NoteCategoryGlyph({
  id,
  size = 24,
  strokeWidth: ignoredStrokeWidth,
  className = '',
  style,
  ...props
}: NoteCategoryGlyphProps) {
  void ignoredStrokeWidth;

  const src = getNoteCategoryIconSrc(id);
  const maskStyle = {
    width: size,
    height: size,
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    ...style,
  } as CSSProperties;

  return createElement('span', {
    'aria-hidden': true,
    ...props,
    className: `inline-block shrink-0 ${className}`.trim(),
    style: maskStyle,
  });
}
