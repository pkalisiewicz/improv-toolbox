import type { ButtonHTMLAttributes } from 'react';
import { IconHeart, IconHeartFilled } from '../icons';

interface FavoriteButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active: boolean;
  label: string;
  tone?: 'surface' | 'brand';
  toolName?: string;
}

const TONE = {
  surface: 'bg-surface text-ink-muted border-ink/15 group-hover:text-ink group-hover:border-ink/35',
  brand: 'bg-ink/10 text-ink border-ink/20 group-hover:bg-ink/15',
} as const;

export function FavoriteButton({
  active,
  label,
  tone = 'surface',
  toolName,
  className = '',
  ...props
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      data-favorite-control={toolName}
      {...props}
      className={`
        group grid place-items-center w-11 h-11 rounded-full
        cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink
        ${className}
      `}
    >
      <span
        data-favorite-button-shell
        className={`
          grid place-items-center w-9 h-9 rounded-full border
          ${active ? 'bg-brand-500 text-ink border-ink shadow-[2px_2px_0_0_var(--color-brand-600)]' : TONE[tone]}
          transition-[background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out)]
          group-active:bg-brand-100
        `}
      >
        <span data-favorite-icon-inactive className={active ? 'hidden' : 'block'}>
          <IconHeart size={17} strokeWidth={2} />
        </span>
        <span data-favorite-icon-active className={active ? 'block' : 'hidden'}>
          <IconHeartFilled size={17} strokeWidth={2.2} />
        </span>
      </span>
    </button>
  );
}
