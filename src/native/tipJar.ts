import { IS_NATIVE_BUILD } from './platform';
import type { PurchasesPackage } from '@revenuecat/purchases-capacitor';

/**
 * The native tip jar (docs/adr/0002). Worldwide shipping makes an external
 * "buy me a coffee" link non-compliant on iOS outside the US, so in-app tips go
 * through RevenueCat (StoreKit + Play Billing) instead.
 *
 * Tiers are NOT hardcoded — they come from the RevenueCat "current" offering, so
 * they can be added/repriced in the dashboard without an app update, and each
 * `priceString` is already localized per store. No-op on the web Site, where the
 * cards keep their buymeacoffee.com link.
 */
export interface TipOption {
  productId: string;
  /** Store-localized price, e.g. "$2.99" / "11,99 zł". */
  priceString: string;
  title: string;
  pkg: PurchasesPackage;
}

export type TipResult = 'success' | 'cancelled' | 'unavailable' | 'error';

// --- pub/sub: any support card calls openTipSheet(); the global TipSheet host
// (mounted once in AppFrame) subscribes via onOpenTipSheet(). ---
type Listener = () => void;
const openListeners = new Set<Listener>();

export function openTipSheet(): void {
  openListeners.forEach((l) => l());
}

export function onOpenTipSheet(listener: Listener): () => void {
  openListeners.add(listener);
  return () => {
    openListeners.delete(listener);
  };
}

let configurePromise: Promise<boolean> | null = null;

type RevenueCatEnv = Pick<
  ImportMetaEnv,
  'DEV' | 'VITE_RC_USE_TEST_STORE' | 'VITE_RC_TEST_KEY' | 'VITE_RC_IOS_KEY' | 'VITE_RC_ANDROID_KEY'
>;

export function selectRevenueCatApiKey(platform: string, env: RevenueCatEnv): string | undefined {
  if ((env.DEV || env.VITE_RC_USE_TEST_STORE === 'true') && env.VITE_RC_TEST_KEY) {
    return env.VITE_RC_TEST_KEY;
  }
  return platform === 'ios' ? env.VITE_RC_IOS_KEY : env.VITE_RC_ANDROID_KEY;
}

/** Configure RevenueCat once with the platform's public SDK key. Returns false
 * (and the tip jar stays gracefully unavailable) when no key is set. */
export function configureTipJar(): Promise<boolean> {
  if (!IS_NATIVE_BUILD) return Promise.resolve(false);
  if (!configurePromise) {
    configurePromise = (async () => {
      try {
        const { Purchases, LOG_LEVEL } = await import('@revenuecat/purchases-capacitor');
        const { Capacitor } = await import('@capacitor/core');
        // A Test Store key (`test_...`) is allowed only in dev mode. Native
        // production builds must use the platform key so TestFlight/App Store
        // purchases resolve against the real StoreKit products.
        const apiKey = selectRevenueCatApiKey(Capacitor.getPlatform(), import.meta.env);
        if (!apiKey) return false;
        await Purchases.configure({ apiKey });
        if (import.meta.env.DEV) {
          await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        }
        return true;
      } catch {
        return false;
      }
    })();
  }
  return configurePromise;
}

/** The tiers from the current RevenueCat offering, cheapest first. */
export async function getTipOptions(): Promise<TipOption[]> {
  if (!(await configureTipJar())) return [];
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return [];
    return current.availablePackages
      .map((pkg) => ({
        productId: pkg.product.identifier,
        priceString: pkg.product.priceString,
        title: pkg.product.title,
        pkg,
      }))
      .sort((a, b) => a.pkg.product.price - b.pkg.product.price);
  } catch {
    return [];
  }
}

/** Buy a tip. Consumables are auto-consumed by RevenueCat, so they can be
 * bought again. */
export async function purchaseTip(option: TipOption): Promise<TipResult> {
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.purchasePackage({ aPackage: option.pkg });
    return 'success';
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'userCancelled' in e && (e as { userCancelled?: boolean }).userCancelled) {
      return 'cancelled';
    }
    return 'error';
  }
}
