import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

/**
 * Pill filter used everywhere (genre/category/difficulty filters).
 * Selected = solid ink pill (a struck stamp); idle = outline on paper.
 */
export function Chip({ children, active = false, className = '', ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold rounded-full border-2 lg:px-5 lg:py-2 lg:text-base
        cursor-pointer transition-[background-color,border-color,color,transform] duration-150 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-500
        ${active
          ? 'bg-ink-fill text-on-ink border-ink'
          : 'bg-surface text-ink-muted border-line hover:border-ink hover:text-ink'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
