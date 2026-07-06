import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  configureTipJar: vi.fn(),
  hideSplash: vi.fn(),
  i18n: {
    language: 'en',
    changeLanguage: vi.fn(),
  },
  persistLang: vi.fn(),
  readDurableLang: vi.fn(),
  setStatusBarStyle: vi.fn(),
}));

vi.mock('../../i18n', () => ({
  default: mocks.i18n,
}));

vi.mock('../../native/lang', () => ({
  persistLang: mocks.persistLang,
  readDurableLang: mocks.readDurableLang,
}));

vi.mock('../../native/tipJar', () => ({
  configureTipJar: mocks.configureTipJar,
}));

vi.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setStyle: mocks.setStatusBarStyle,
  },
  Style: {
    Dark: 'DARK',
  },
}));

vi.mock('@capacitor/splash-screen', () => ({
  SplashScreen: {
    hide: mocks.hideSplash,
  },
}));

describe('initNative', () => {
  beforeEach(() => {
    mocks.configureTipJar.mockReturnValue(Promise.resolve(false));
    mocks.hideSplash.mockResolvedValue(undefined);
    mocks.i18n.language = 'en';
    mocks.i18n.changeLanguage.mockResolvedValue(undefined);
    mocks.persistLang.mockResolvedValue(undefined);
    mocks.readDurableLang.mockResolvedValue(null);
    mocks.setStatusBarStyle.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('hides the splash after native setup completes', async () => {
    const { initNative } = await import('../../native/init');

    await initNative();

    expect(mocks.hideSplash).toHaveBeenCalledTimes(1);
  });

  it('still hides the splash when a native setup step never resolves', async () => {
    vi.useFakeTimers();
    mocks.readDurableLang.mockReturnValue(new Promise(() => {}));
    const { initNative } = await import('../../native/init');

    const initPromise = initNative();
    await vi.advanceTimersByTimeAsync(2_000);
    await initPromise;

    expect(mocks.hideSplash).toHaveBeenCalledTimes(1);
  }, 1_000);
});
