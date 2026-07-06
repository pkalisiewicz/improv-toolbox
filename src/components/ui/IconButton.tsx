import type { ButtonHTMLAttributes, ComponentType } from 'react';
import type { IconProps } from '../icons/createIcon';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Glyph from the custom icon family. */
  Icon: ComponentType<IconProps>;
  /** Accessible label (required — icon-only control). */
  label: string;
  variant?: 'soft' | 'outline' | 'ghost';
  shape?: 'square' | 'round';
  size?: 'sm' | 'md' | 'lg';
  iconSize?: number;
}

const VARIANT: Record<string, string> = {
  // Tinted gold chip — the standard reroll / stepper affordance. Ink glyph on a
  // gold tint (gold-as-text fails AA); the icon's own gold pip carries the accent.
  soft:    'bg-brand-50 text-ink hover:bg-brand-100',
  // Outline poster control.
  outline: 'border-2 border-line text-ink-muted hover:border-ink hover:text-ink',
  // Minimal — transport / inline controls.
  ghost:   'text-ink-muted hover:text-ink hover:bg-ink/[0.05]',
};

const SIZE: Record<string, { box: string; icon: number }> = {
  sm: { box: 'w-9 h-9',   icon: 16 },
  md: { box: 'w-10 h-10', icon: 18 },
  lg: { box: 'w-12 h-12', icon: 20 },
};

/**
 * One shared icon-only control so every reroll, stepper, and transport button
 * speaks the same vocabulary (was hand-rolled differently on ~8 pages). Square
 * by default; `round` for steppers/transport.
 */
export function IconButton({
  Icon, label, variant = 'soft', shape = 'square', size = 'md', iconSize, className = '', ...props
}: IconButtonProps) {
  const s = SIZE[size];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`
        shrink-0 grid place-items-center ${s.box}
        ${shape === 'round' ? 'rounded-full' : 'rounded-[var(--radius-md)]'}
        ${VARIANT[variant]}
        cursor-pointer transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-out)]
        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500
        ${className}
      `}
    >
      <Icon size={iconSize ?? s.icon} />
    </button>
  );
}
