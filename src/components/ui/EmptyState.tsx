import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '../icons/createIcon';

interface EmptyStateProps {
  /** Feature/illustrative glyph shown in a soft poster badge. */
  Icon: ComponentType<IconProps>;
  /** Short, warm line that sets up the action. */
  title: string;
  /** Optional supporting hint. */
  hint?: string;
  /** Optional action (e.g. a Button) under the copy. */
  action?: ReactNode;
  className?: string;
}

/**
 * First-run / empty placeholder with stage-manager personality: a glyph stamped
 * in a soft poster badge, a confident title, and an optional nudge. Replaces the
 * flat "nothing here" gray line. Uses the page's --feature vars for the badge.
 */
export function EmptyState({ Icon, title, hint, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-10 ${className}`}>
      <span
        className="grid place-items-center w-16 h-16 rounded-[var(--radius-lg)] border-2 border-ink shadow-[var(--shadow-hard)] mb-4 -rotate-2"
        style={{ backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' }}
      >
        <Icon size={32} />
      </span>
      <p className="font-display font-semibold text-ink text-xl leading-tight text-balance [font-variation-settings:'opsz'_48,'WONK'_1]">
        {title}
      </p>
      {hint && <p className="text-sm text-ink-muted mt-1.5 max-w-xs text-pretty">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
