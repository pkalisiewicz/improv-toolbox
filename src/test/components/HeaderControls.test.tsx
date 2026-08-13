import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '../test-utils';

const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
const IOS_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)';

async function renderHeaderControls({
  native,
  userAgent = DESKTOP_USER_AGENT,
  contactShortcut = false,
}: {
  native: boolean;
  userAgent?: string;
  contactShortcut?: boolean;
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
  render(<HeaderControls tone="ink" contactShortcut={contactShortcut} />);

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

  it('offers every supported language in the native App', async () => {
    const user = userEvent.setup();
    const { persistLang } = await renderHeaderControls({ native: true });

    const languageSelect = screen.getByRole('combobox', { name: 'app.chooseLanguage' });
    expect(languageSelect).toHaveTextContent('EN · English');
    expect(languageSelect).toHaveTextContent('PL · Polski');
    expect(languageSelect).toHaveTextContent('CS · Čeština');

    await user.selectOptions(languageSelect, 'cs');
    expect(persistLang).toHaveBeenCalledWith('cs');
  });

  it('uses a one-tap language toggle on iOS Site/PWA builds', async () => {
    await renderHeaderControls({ native: false, userAgent: IOS_USER_AGENT });

    expect(screen.queryByRole('combobox', { name: 'app.chooseLanguage' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /app\.chooseLanguage/ })).toHaveTextContent(/^(PL|EN)$/);
  });

  it('offers contact as an optional quick action', async () => {
    await renderHeaderControls({ native: true, contactShortcut: true });

    expect(screen.getByRole('link', { name: 'contact.quickAction' })).toHaveAttribute('href', '/contact');
  });
});
