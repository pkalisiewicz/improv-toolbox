import { IS_NATIVE_BUILD } from './platform';

/**
 * Tactile feedback for the App. Every call dynamically imports the Capacitor
 * plugin and no-ops on the Site (the IS_NATIVE_BUILD guard lets Rollup drop the
 * import entirely). Failures are swallowed so a missing engine never breaks a
 * draw.
 */
async function impact(style: 'light' | 'medium' | 'heavy'): Promise<void> {
  if (!IS_NATIVE_BUILD) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
    await Haptics.impact({ style: map[style] });
  } catch {
    /* no haptics engine */
  }
}

async function notify(type: 'success' | 'warning' | 'error'): Promise<void> {
  if (!IS_NATIVE_BUILD) return;
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');
    const map = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };
    await Haptics.notification({ type: map[type] });
  } catch {
    /* no haptics engine */
  }
}

export const haptics = {
  /** A single draw / reroll — a light tick. */
  draw: () => void impact('light'),
  /** Kicking off the archetype wheel — a firmer thud. */
  spin: () => void impact('medium'),
  /** The wheel landing on a result — a celebratory success pattern. */
  land: () => void notify('success'),
  /**
   * The workshop timer finishing. Native: a success haptic. Web (Site): keep the
   * original vibration pattern so the PWA behaviour is unchanged.
   */
  timerDone: () => {
    if (IS_NATIVE_BUILD) {
      void notify('success');
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  },
};
