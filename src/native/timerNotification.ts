import { IS_NATIVE_BUILD } from './platform';
import i18n from '../i18n';

/**
 * The workshop Timer's native backstop. A JS setInterval is suspended while the
 * WebView is backgrounded, so a host who locks the phone would never be alerted.
 * We schedule a Local Notification at the target end time when the timer starts;
 * the OS fires it even if the App is backgrounded or killed. Cancelled whenever
 * the timer is paused or reset. No-op on the Site.
 */
const TIMER_NOTIF_ID = 1001;
let permissionRequested = false;

async function ensurePermission(
  LocalNotifications: typeof import('@capacitor/local-notifications').LocalNotifications,
): Promise<boolean> {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;
  if (permissionRequested) return false;
  permissionRequested = true;
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}

export async function scheduleTimerDone(seconds: number): Promise<void> {
  if (!IS_NATIVE_BUILD || seconds <= 0) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    if (!(await ensurePermission(LocalNotifications))) return;
    await LocalNotifications.schedule({
      notifications: [
        {
          id: TIMER_NOTIF_ID,
          title: i18n.t('timer.notificationTitle'),
          body: i18n.t('timer.notificationBody'),
          schedule: { at: new Date(Date.now() + seconds * 1000) },
        },
      ],
    });
  } catch {
    /* plugin unavailable / permission denied */
  }
}

export async function cancelTimerDone(): Promise<void> {
  if (!IS_NATIVE_BUILD) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: TIMER_NOTIF_ID }] });
  } catch {
    /* nothing scheduled */
  }
}
