import type { ReactNode } from 'react';
import { IS_NATIVE_BUILD } from '../../native/platform';
import { openTipSheet } from '../../native/tipJar';

/** The creator's external tip page — used on the web Site (and Android, where
 * external links are allowed). */
export const BUYMEACOFFEE_URL = 'https://buymeacoffee.com/przemekk';

/**
 * Wraps the "support the creator" card content. On the web Site it's an external
 * link to buymeacoffee; in the native App it opens the in-app TipSheet (IAP),
 * because a worldwide external donation link isn't App-Store-compliant on iOS
 * outside the US (docs/adr/0002). Same visuals, branched behavior.
 */
export function SupportCreatorButton({
  className,
  children,
  ariaLabel,
  favoriteReflow,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Mirrors the `data-favorite-reflow` hook the cards use for layout reflow. */
  favoriteReflow?: boolean;
}) {
  const reflow = favoriteReflow ? { 'data-favorite-reflow': true } : {};
  if (IS_NATIVE_BUILD) {
    return (
      <button type="button" onClick={openTipSheet} className={className} aria-label={ariaLabel} {...reflow}>
        {children}
      </button>
    );
  }
  return (
    <a
      href={BUYMEACOFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      {...reflow}
    >
      {children}
    </a>
  );
}
