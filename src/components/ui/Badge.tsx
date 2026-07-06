import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'amber' | 'green' | 'blue' | 'purple' | 'red' | 'gray' | 'pink' | 'cyan' | 'feature';
  className?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  amber:  'bg-amber-100 text-amber-800',
  green:  'bg-emerald-100 text-emerald-800',
  blue:   'bg-sky-100 text-sky-800',
  purple: 'bg-violet-100 text-violet-800',
  red:    'bg-rose-100 text-rose-800',
  gray:   'bg-surface-3 text-ink-muted',
  pink:   'bg-pink-100 text-pink-800',
  cyan:   'bg-cyan-100 text-cyan-800',
  feature: '',
};

export function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  const featureStyle: CSSProperties | undefined =
    color === 'feature'
      ? { backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' }
      : undefined;
  return (
    <span
      style={featureStyle}
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5 rounded-full text-xs font-semibold lg:px-3 lg:py-1 lg:text-sm
        ${COLOR_CLASSES[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
