import { describe, expect, it } from 'vitest';
import { selectRevenueCatApiKey } from '../../native/tipJar';

describe('selectRevenueCatApiKey', () => {
  it('uses the iOS key in production even when a test store key is present', () => {
    expect(
      selectRevenueCatApiKey('ios', {
        DEV: false,
        VITE_RC_USE_TEST_STORE: undefined,
        VITE_RC_TEST_KEY: 'test_key',
        VITE_RC_IOS_KEY: 'appl_key',
        VITE_RC_ANDROID_KEY: 'goog_key',
      }),
    ).toBe('appl_key');
  });

  it('uses the RevenueCat test store key in dev when present', () => {
    expect(
      selectRevenueCatApiKey('ios', {
        DEV: true,
        VITE_RC_USE_TEST_STORE: undefined,
        VITE_RC_TEST_KEY: 'test_key',
        VITE_RC_IOS_KEY: 'appl_key',
        VITE_RC_ANDROID_KEY: 'goog_key',
      }),
    ).toBe('test_key');
  });

  it('uses the Android key for non-iOS production builds', () => {
    expect(
      selectRevenueCatApiKey('android', {
        DEV: false,
        VITE_RC_USE_TEST_STORE: undefined,
        VITE_RC_TEST_KEY: 'test_key',
        VITE_RC_IOS_KEY: 'appl_key',
        VITE_RC_ANDROID_KEY: 'goog_key',
      }),
    ).toBe('goog_key');
  });

  it('can use the RevenueCat test store key in local production-mode native installs', () => {
    expect(
      selectRevenueCatApiKey('ios', {
        DEV: false,
        VITE_RC_USE_TEST_STORE: 'true',
        VITE_RC_TEST_KEY: 'test_key',
        VITE_RC_IOS_KEY: undefined,
        VITE_RC_ANDROID_KEY: undefined,
      }),
    ).toBe('test_key');
  });
});
