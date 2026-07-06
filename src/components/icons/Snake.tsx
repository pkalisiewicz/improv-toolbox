import type { CSSProperties, HTMLAttributes } from 'react';
import snakeMascot from '../../assets/brand/snake-mascot.png';

interface SnakeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Pixel size for width & height. Default 30. */
  size?: number;
  /** Body + raised-head color. Default ink. */
  color?: string;
  /** Eye color. Default brand. */
  eye?: string;
  /** Forked-tongue color. Defaults to the eye color. */
  tongue?: string;
}

/**
 * The Improv Toolbox mascot. The body is a generated Codex image asset used as
 * a CSS mask, so it stays crisp while still inheriting the app color system.
 */
export function Snake({
  size = 30,
  color = 'var(--color-ink)',
  eye = 'var(--color-brand-500)',
  tongue = eye,
  className = '',
  style,
  ...props
}: SnakeProps) {
  const rootStyle = {
    width: size,
    height: size,
    color,
    ...style,
  } as CSSProperties;

  const bodyStyle = {
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url(${snakeMascot})`,
    maskImage: `url(${snakeMascot})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      {...props}
      className={`relative inline-block shrink-0 ${className}`.trim()}
      style={rootStyle}
    >
      <span className="absolute inset-0" style={bodyStyle} />
      <span
        className="absolute rounded-full"
        style={{
          left: '58%',
          top: '22%',
          width: '8%',
          height: '8%',
          backgroundColor: eye,
        }}
      />
      <span
        className="absolute block h-[7%] w-[19%] origin-left"
        style={{
          left: '73%',
          top: '28%',
          color: tongue,
        }}
      >
        <span
          className="absolute left-0 top-1/2 h-[32%] w-full -translate-y-1/2 rounded-full bg-current"
          style={{ transform: 'translateY(-50%) rotate(-9deg)', transformOrigin: 'left center' }}
        />
        <span
          className="absolute right-0 top-0 h-[32%] w-[46%] rounded-full bg-current"
          style={{ transform: 'rotate(-31deg)', transformOrigin: 'left center' }}
        />
        <span
          className="absolute right-0 bottom-0 h-[32%] w-[46%] rounded-full bg-current"
          style={{ transform: 'rotate(31deg)', transformOrigin: 'left center' }}
        />
      </span>
    </span>
  );
}
