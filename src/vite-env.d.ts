/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Site builds: the single baked language (per domain). See seo/config.ts. */
  readonly VITE_BUILD_LANG?: string;
  /** Set to 'native' only by the build:native script (Capacitor App build). */
  readonly VITE_BUILD_TARGET?: 'native';
  /** Aptabase app key for the native App's anonymous analytics. */
  readonly VITE_APTABASE_KEY?: string;
  /** RevenueCat public SDK keys for the in-app tip jar (per platform). */
  readonly VITE_RC_IOS_KEY?: string;
  readonly VITE_RC_ANDROID_KEY?: string;
  /**
   * RevenueCat Test Store key (`test_…`). When set, it overrides the platform
   * keys and routes purchases to the dashboard Test Store. DEV/TEST ONLY.
   */
  readonly VITE_RC_TEST_KEY?: string;
  /**
   * Allows local production-mode native installs (`npm run ios:standalone`) to
   * use the Test Store key. Never set for TestFlight/App Store builds.
   */
  readonly VITE_RC_USE_TEST_STORE?: 'true';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
