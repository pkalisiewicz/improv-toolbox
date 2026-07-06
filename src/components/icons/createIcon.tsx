import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Pixel size for both width & height. Default 24. */
  size?: number;
}

/**
 * Factory for the Improv Toolbox custom icon family.
 *
 * Every icon shares one visual language: a 24×24 grid, 2px rounded strokes,
 * `currentColor` (so it inherits text color — feature hue, brand, muted, etc.),
 * and round line joins. Active/colored states are handled by the consumer via
 * `currentColor`; icons themselves stay single-color and theme-agnostic.
 */
export function createIcon(displayName: string, paths: ReactNode) {
  function Icon({ size = 24, strokeWidth = 2, className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
