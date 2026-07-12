import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '../test-utils';

const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
const IOS_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)';

async function renderHeaderControls({
  native,
  userAgent = DESKTOP_USER_AGENT,
}: {
  native: boolean;
  userAgent?: string;
}) {
  vi.resetModules();

  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });

  const persistLang = vi.fn().mockResolvedValue(undefined);
  vi.doMock('../../native/platform', () => ({ IS_NATIVE_BUILD: native }));
  vi.doMock('../../native/lang', () => ({ persistLang }));

  const { HeaderControls } = await import('../../components/layout/HeaderControls');
  render(<HeaderControls tone="ink" />);

  return { persistLang };
}

afterEach(() => {
  cleanup();
  vi.resetModules();
  vi.doUnmock('../../native/platform');
  vi.doUnmock('../../native/lang');
});

describe('HeaderControls', () => {
  it('keeps the Site language switcher as a native select', async () => {
    await renderHeaderControls({ native: false });

    expect(screen.getByRole('combobox', { name: 'app.chooseLanguage' })).toBeInTheDocument();
  });

  it('uses a one-tap language toggle in the native App', async () => {
    const user = userEvent.setup();
    const { persistLang } = await renderHeaderControls({ native: true });

    expect(screen.queryByRole('combobox', { name: 'app.chooseLanguage' })).not.toBeInTheDocument();

    const languageButton = screen.getByRole('button', { name: /app\.chooseLanguage/ });
    expect(languageButton).toHaveTextContent('PL');

    await user.click(languageButton);

    expect(persistLang).toHaveBeenCalledWith('pl');
  });

  it('uses a one-tap language toggle on iOS Site/PWA builds', async () => {
    await renderHeaderControls({ native: false, userAgent: IOS_USER_AGENT });

    expect(screen.queryByRole('combobox', { name: 'app.chooseLanguage' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /app\.chooseLanguage/ })).toHaveTextContent(/^(PL|EN)$/);
  });
});
