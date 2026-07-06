import type { CSSProperties, ReactNode } from 'react';
import { featureVars, type FeatureName } from '../../theme/features';
import { BackToMore } from './BackToMore';

interface PageContainerProps {
  children: ReactNode;
  /** Feature identity — sets --feature / --feature-soft / --feature-ink + top accent. */
  feature?: FeatureName;
  /**
   * Canonical page frame: centered max-width column + standard padding +
   * an in-frame "back to More" affordance on sub-pages. Default true. Pass
   * `false` for full-bleed screens (DrawStage, WheelCanvas) that own their own
   * layout — those manage padding + back affordance themselves.
   */
  frame?: boolean;
  /** Legacy fallback: Tailwind bg class for the top accent bar. */
  accentColor?: string;
}

export function PageContainer({ children, feature, frame = true, accentColor }: PageContainerProps) {
  const style = feature ? (featureVars(feature) as CSSProperties) : undefined;

  return (
    <div className="flex flex-col min-h-full" style={style}>
      {/* Restrained bold accent bar — the one consistent poster element atop every page. */}
      <div
        className={`h-1.5 w-full shrink-0 ${feature ? '' : accentColor ?? 'bg-brand-500'}`}
        style={feature ? { backgroundColor: 'var(--feature)' } : undefined}
      />
      {frame ? (
        <div className="desktop-type-scale w-full max-w-md mx-auto px-4 pt-5 pb-9 lg:mx-0 lg:max-w-5xl lg:px-8 xl:px-10 lg:py-8">
          <div className="min-w-0">
            <BackToMore className="mb-4" />
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
