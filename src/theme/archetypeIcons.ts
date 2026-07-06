import { createElement, type CSSProperties, type HTMLAttributes } from 'react';

import caregiverIcon from '../assets/archetype-icons/caregiver.png';
import creatorIcon from '../assets/archetype-icons/creator.png';
import explorerIcon from '../assets/archetype-icons/explorer.png';
import foolIcon from '../assets/archetype-icons/fool.png';
import heroIcon from '../assets/archetype-icons/hero.png';
import loverIcon from '../assets/archetype-icons/lover.png';
import mentorIcon from '../assets/archetype-icons/mentor.png';
import rebelIcon from '../assets/archetype-icons/rebel.png';
import sageIcon from '../assets/archetype-icons/sage.png';
import shadowIcon from '../assets/archetype-icons/shadow.png';
import tricksterIcon from '../assets/archetype-icons/trickster.png';
import villainIcon from '../assets/archetype-icons/villain.png';

const ARCHETYPE_ICON_SRC: Record<string, string> = {
  hero: heroIcon,
  fool: foolIcon,
  villain: villainIcon,
  mentor: mentorIcon,
  trickster: tricksterIcon,
  lover: loverIcon,
  sage: sageIcon,
  shadow: shadowIcon,
  rebel: rebelIcon,
  caregiver: caregiverIcon,
  creator: creatorIcon,
  explorer: explorerIcon,
};

export function getArchetypeIconSrc(id: string): string {
  return ARCHETYPE_ICON_SRC[id] ?? foolIcon;
}

interface ArchetypeGlyphProps extends HTMLAttributes<HTMLSpanElement> {
  id: string;
  size?: number;
  strokeWidth?: number;
}

export function ArchetypeGlyph({
  id,
  size = 24,
  strokeWidth: ignoredStrokeWidth,
  className = '',
  style,
  ...props
}: ArchetypeGlyphProps) {
  void ignoredStrokeWidth;

  const src = getArchetypeIconSrc(id);
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
