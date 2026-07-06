import type { ReactNode } from 'react';
import { FEATURES, type FeatureName } from '../../theme/features';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Shows the feature's custom glyph in a soft tinted badge beside the title. */
  feature?: FeatureName;
  /** Trailing action (e.g. a regenerate button), right-aligned. */
  action?: ReactNode;
  className?: string;
}

/**
 * Editorial masthead: feature glyph + heavy Fraunces title + optional action,
 * underscored by a bold ink rule. Used on tool pages; bespoke screens may omit.
 */
export function PageHeader({ title, subtitle, feature, action, className = '' }: PageHeaderProps) {
  const Icon = feature ? FEATURES[feature].Icon : null;
  return (
    <div className={`mb-6 lg:mb-8 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="shrink-0 grid place-items-center w-10 h-10 rounded-[var(--radius-md)] border-2 border-ink lg:h-14 lg:w-14"
            style={{ backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' }}
          >
            <Icon size={26} />
          </span>
        )}
        <h1 className="min-w-0 flex-1 text-[1.9rem] font-bold text-ink [font-variation-settings:'opsz'_72,'WONK'_1] lg:text-[2.85rem]">
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && <p className="text-sm text-ink-muted mt-2 text-pretty lg:text-lg">{subtitle}</p>}
      <div className="mt-3 h-0.5 w-full bg-ink/90 rounded-full lg:mt-5" />
    </div>
  );
}
