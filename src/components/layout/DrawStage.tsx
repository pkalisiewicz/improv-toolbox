import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from './PageContainer';
import { BackToMore } from './BackToMore';
import { Button } from '../ui/Button';
import { type FeatureName } from '../../theme/features';
import { haptics } from '../../native/haptics';

interface DrawStageProps {
  feature: FeatureName;
  /** Tool name — small masthead overline. */
  title: string;
  /** Filter row (chips), horizontally scrollable. */
  filters?: ReactNode;
  /** Stamped category label above the draw. */
  stampLabel?: ReactNode;
  /** Changes when the draw changes — re-triggers the reveal animation. */
  itemKey: string | number;
  /** The headline content — the draw itself. */
  children: ReactNode;
  /** Optional content under the headline (badge, meta). */
  footnote?: ReactNode;
  onDraw: () => void;
  drawLabel: string;
  drawIcon?: ReactNode;
  /** When set, renders a Prev control beside the primary (deck-navigation tools). */
  onPrev?: () => void;
  prevLabel?: string;
  prevIcon?: ReactNode;
  /** e.g. "12 / 59". */
  counter?: string;
  /** Headline type scale. */
  size?: 'xl' | 'lg';
}

/**
 * The anti-card draw screen: the content owns the whole stage. Tap anywhere to
 * draw again; the headline pulls in like a card under a spotlight. Shared by the
 * "draw one thing" tools (prompts, suggestions, monologue, constraints, ...).
 */
export function DrawStage({
  feature, title, filters, stampLabel, itemKey, children, footnote,
  onDraw, drawLabel, drawIcon, onPrev, prevLabel, prevIcon, counter, size = 'xl',
}: DrawStageProps) {
  const { t } = useTranslation();
  const scale = size === 'xl'
    ? 'text-[clamp(2rem,8.5vw,3.3rem)]'
    : 'text-[clamp(1.5rem,6vw,2.3rem)]';

  // Every draw across the "draw one thing" tools flows through here, so this is
  // the one place a tactile tick is wired for all of them.
  const handleDraw = () => {
    haptics.draw();
    onDraw();
  };
  const handlePrev = onPrev
    ? () => {
        haptics.draw();
        onPrev();
      }
    : undefined;

  return (
    <PageContainer feature={feature} frame={false}>
      <div className="flex flex-1 min-h-0 flex-col max-w-md mx-auto w-full lg:mx-0 lg:max-w-6xl lg:px-8 xl:px-10 lg:py-8">
        <div className="flex min-h-0 flex-1 flex-col lg:min-h-[calc(100dvh-6.75rem)]">
            {/* Masthead */}
            <div className="px-4 pt-4 lg:px-0 lg:pt-0">
              <BackToMore className="mb-3" />
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 font-display text-lg font-semibold text-ink leading-tight break-words [overflow-wrap:anywhere] [font-variation-settings:'opsz'_40] lg:text-2xl">
                  {title}
                </p>
                {counter && (
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-ink-muted border-2 border-ink rounded-full px-2.5 py-0.5">
                    {counter}
                  </span>
                )}
              </div>
              {filters && (
                <div className="-mx-4 px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1 lg:mx-0 lg:px-0">
                  {filters}
                </div>
              )}
            </div>

            {/* Stage — tap anywhere to draw */}
            <div
              onClick={handleDraw}
              className="group relative flex-1 w-full flex flex-col items-center justify-center text-center px-6 py-8 lg:px-10 cursor-pointer spotlight focus-visible:outline-none"
            >
              {stampLabel && (
                <span className="mb-6 inline-flex -rotate-2 items-center gap-1.5 border-2 border-ink px-3 py-1 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_var(--color-ink)]"
                  style={{ backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' }}>
                  {stampLabel}
                </span>
              )}
              <div key={itemKey} className={`animate-draw-in font-display font-semibold text-ink text-balance leading-[1.04] [font-variation-settings:'opsz'_96,'WONK'_1] ${scale}`}>
                {children}
              </div>
              {footnote && <div className="mt-5">{footnote}</div>}
              <span className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint">
                {t('common.tapHint')}
              </span>
            </div>

            {/* Primary action (+ optional Prev for deck navigation) */}
            <div className="px-4 pb-5 pt-2 flex gap-2.5 lg:px-0 lg:pb-0">
              {handlePrev && (
                <Button variant="secondary" size="xl" onClick={handlePrev} aria-label={prevLabel} className="shrink-0 px-5">
                  {prevIcon}
                </Button>
              )}
              <Button variant="primary" size="xl" fullWidth onClick={handleDraw}>
                {drawIcon}
                {drawLabel}
              </Button>
            </div>
        </div>
      </div>
    </PageContainer>
  );
}
