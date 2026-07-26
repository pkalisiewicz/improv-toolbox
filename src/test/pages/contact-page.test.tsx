import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '../test-utils';

describe('ContactPage', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function renderContactPage(formId = 'testform123') {
    vi.stubEnv('VITE_FORMSPREE_FORM_ID', formId);
    const { ContactPage } = await import('../../pages/ContactPage');
    render(<ContactPage />);
  }

  it('sends the form through Formspree and shows confirmation', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'I have an idea for a new tool.');
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/testform123',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(await screen.findByText('contact.success.title')).toBeInTheDocument();
  });

  it('shows accessible required-field errors and focuses the first invalid field', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage();
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    const email = screen.getByLabelText('contact.form.email.label');
    const message = screen.getByLabelText('contact.form.message.label');
    const emailError = screen.getByText('contact.validation.emailRequired');
    const messageError = screen.getByText('contact.validation.messageRequired');

    expect(email).toHaveFocus();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-describedby', emailError.id);
    expect(message).toHaveAttribute('aria-invalid', 'true');
    expect(message).toHaveAttribute('aria-describedby', messageError.id);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validates malformed email and short message before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'not-an-email');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'Too short');
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    expect(screen.getByText('contact.validation.emailInvalid')).toBeInTheDocument();
    expect(screen.getByText('contact.validation.messageTooShort')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps the form available when the service rejects the submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('contact.error');
    expect(screen.getByLabelText('contact.form.message.label')).toHaveValue('This message is long enough.');
  });

  it('shows a specific retry message when Formspree rate-limits submissions', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('contact.rateLimited');
  });

  it('does not attempt submission when no Formspree form ID is configured', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage('');
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'This message is long enough.');
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('contact.configurationError');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validates fields before reporting an offline submission error', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('navigator', { ...navigator, onLine: false });
    const user = userEvent.setup();

    await renderContactPage();
    await user.click(screen.getByRole('button', { name: 'contact.form.submit' }));

    expect(screen.getByText('contact.validation.emailRequired')).toBeInTheDocument();
    expect(screen.getByText('contact.validation.messageRequired')).toBeInTheDocument();
    expect(screen.queryByText('contact.error')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('prevents concurrent duplicate submissions', async () => {
    let resolveRequest!: (value: { ok: boolean; status: number }) => void;
    const fetchMock = vi.fn().mockImplementation(
      () => new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'This message is long enough.');

    const form = screen.getByRole('button', { name: 'contact.form.submit' }).closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(fetchMock).toHaveBeenCalledOnce();
    resolveRequest({ ok: true, status: 200 });
    expect(await screen.findByText('contact.success.title')).toBeInTheDocument();
  });

  it('recovers when the contact service does not respond', async () => {
    const fetchMock = vi.fn().mockImplementation(
      (_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    await renderContactPage();
    await user.type(screen.getByLabelText('contact.form.email.label'), 'player@example.com');
    await user.type(screen.getByLabelText('contact.form.message.label'), 'This message is long enough.');

    vi.useFakeTimers();
    fireEvent.submit(screen.getByRole('button', { name: 'contact.form.submit' }).closest('form')!);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(15_000);
    });

    expect(screen.getByRole('alert')).toHaveTextContent('contact.timeout');
    expect(screen.getByRole('button', { name: 'contact.form.submit' })).toBeEnabled();
    expect(screen.getByLabelText('contact.form.message.label')).toHaveValue('This message is long enough.');
  });
});
