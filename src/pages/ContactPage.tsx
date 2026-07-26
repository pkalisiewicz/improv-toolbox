import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { IconCheck, IconMail } from '../components/icons';
import { IS_NATIVE_BUILD } from '../native/platform';
import {
  getContactFormEndpoint,
  normalizeContactForm,
  validateContactField,
  validateContactForm,
  type ContactField,
  type ContactFormErrors,
} from '../utils/contactForm';

type SubmitStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'rate-limited'
  | 'configuration-error'
  | 'timeout'
  | 'error';

const CONTROL_CLASS =
  'min-h-12 w-full rounded-[var(--radius-md)] border-2 border-line bg-surface px-3.5 py-2.5 text-base text-ink outline-none transition-[border-color,background-color] duration-150 ease-[var(--ease-out)] placeholder:text-ink-faint hover:border-ink/40 focus:border-brand-600 focus:ring-2 focus:ring-brand-300/40 disabled:cursor-not-allowed disabled:opacity-60';
const INVALID_CONTROL_CLASS =
  'border-red-700 focus:border-red-700 focus:ring-red-300/40 dark:border-red-400 dark:focus:border-red-400';
const FIELD_ORDER: ContactField[] = ['name', 'email', 'topic', 'message'];
const CONTACT_REQUEST_TIMEOUT_MS = 15_000;

export function ContactPage() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const activeRequestRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    activeRequestRef.current?.abort();
  }, []);

  const errorMessage = (field: ContactField) => {
    const code = fieldErrors[field];
    return code ? t(`contact.validation.${code}`) : undefined;
  };

  const clearFieldError = (field: ContactField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateField = (field: ContactField, value: string) => {
    const error = validateContactField(field, value);
    setFieldErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (activeRequestRef.current) return;

    const data = new FormData(form);
    const honey = String(data.get('_gotcha') ?? '');

    // Bots tend to fill every field. Treat a filled honeypot as a successful
    // submission without sending anything or revealing the filter.
    if (honey) {
      setStatus('success');
      form.reset();
      return;
    }

    const values = normalizeContactForm({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      topic: String(data.get('topic') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    const errors = validateContactForm(values);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('idle');
      const firstInvalidField = FIELD_ORDER.find((field) => errors[field]);
      if (firstInvalidField) {
        (form.elements.namedItem(firstInvalidField) as HTMLElement | null)?.focus();
      }
      return;
    }

    if (!navigator.onLine) {
      setStatus('error');
      return;
    }

    const endpoint = getContactFormEndpoint();
    if (!endpoint) {
      setStatus('configuration-error');
      return;
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    let didTimeOut = false;
    const timeoutId = window.setTimeout(() => {
      didTimeOut = true;
      controller.abort();
    }, CONTACT_REQUEST_TIMEOUT_MS);

    setStatus('submitting');

    try {
      const topic = values.topic;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          topic: t(`contact.form.topic.${topic}`),
          message: values.message,
          _subject: `Improv Toolbox contact: ${t(`contact.form.topic.${topic}`)}`,
          language: i18n.language,
          source: IS_NATIVE_BUILD ? 'native-app' : 'website',
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        setStatus('rate-limited');
        return;
      }

      if (!response.ok) {
        throw new Error('Contact form submission failed');
      }

      form.reset();
      setFieldErrors({});
      setStatus('success');
    } catch {
      if (didTimeOut) {
        setStatus('timeout');
      } else if (!controller.signal.aborted) {
        setStatus('error');
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
    }
  }

  const submitting = status === 'submitting';

  return (
    <PageContainer feature="more">
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />

      <div className="lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
        <section className="mb-7 lg:mb-0 lg:pt-3" aria-labelledby="contact-intro-title">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-brand-100 text-brand-700 lg:h-14 lg:w-14">
            <IconMail size={27} />
          </span>
          <h2 id="contact-intro-title" className="font-label text-xl font-extrabold text-ink lg:text-2xl">
            {t('contact.intro.title')}
          </h2>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-muted text-pretty lg:text-base">
            {t('contact.intro.body')}
          </p>
          <p className="mt-4 text-sm font-semibold text-brand-700 lg:text-base">
            {t('contact.intro.replyTime')}
          </p>
        </section>

        <div className="rounded-[var(--radius-lg)] bg-surface-3 p-4 sm:p-5 lg:p-7">
          {status === 'success' ? (
            <div className="flex min-h-72 flex-col items-start justify-center" role="status" aria-live="polite">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-ink">
                <IconCheck size={25} />
              </span>
              <h2 className="mt-4 font-label text-2xl font-extrabold text-ink lg:text-3xl">
                {t('contact.success.title')}
              </h2>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-muted lg:text-base">
                {t('contact.success.body')}
              </p>
              <Button type="button" variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
                {t('contact.success.again')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
              <div className="space-y-5">
                <Field
                  label={t('contact.form.name.label')}
                  htmlFor="contact-name"
                  optional={t('contact.form.optional')}
                  error={errorMessage('name')}
                  errorId="contact-name-error"
                >
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    onChange={() => clearFieldError('name')}
                    onBlur={(event) => validateField('name', event.currentTarget.value)}
                    className={`${CONTROL_CLASS} ${fieldErrors.name ? INVALID_CONTROL_CLASS : ''}`}
                    placeholder={t('contact.form.name.placeholder')}
                  />
                </Field>

                <Field
                  label={t('contact.form.email.label')}
                  htmlFor="contact-email"
                  error={errorMessage('email')}
                  errorId="contact-email-error"
                >
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    maxLength={254}
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    onChange={() => clearFieldError('email')}
                    onBlur={(event) => validateField('email', event.currentTarget.value)}
                    className={`${CONTROL_CLASS} ${fieldErrors.email ? INVALID_CONTROL_CLASS : ''}`}
                    placeholder={t('contact.form.email.placeholder')}
                  />
                </Field>

                <Field
                  label={t('contact.form.topic.label')}
                  htmlFor="contact-topic"
                  error={errorMessage('topic')}
                  errorId="contact-topic-error"
                >
                  <select
                    id="contact-topic"
                    name="topic"
                    required
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.topic}
                    aria-describedby={fieldErrors.topic ? 'contact-topic-error' : undefined}
                    onChange={(event) => validateField('topic', event.currentTarget.value)}
                    className={`${CONTROL_CLASS} ${fieldErrors.topic ? INVALID_CONTROL_CLASS : ''}`}
                  >
                    <option value="feedback">{t('contact.form.topic.feedback')}</option>
                    <option value="bug">{t('contact.form.topic.bug')}</option>
                    <option value="idea">{t('contact.form.topic.idea')}</option>
                    <option value="other">{t('contact.form.topic.other')}</option>
                  </select>
                </Field>

                <Field
                  label={t('contact.form.message.label')}
                  htmlFor="contact-message"
                  error={errorMessage('message')}
                  errorId="contact-message-error"
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={7}
                    disabled={submitting}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    onChange={() => clearFieldError('message')}
                    onBlur={(event) => validateField('message', event.currentTarget.value)}
                    className={`${CONTROL_CLASS} min-h-40 resize-y ${fieldErrors.message ? INVALID_CONTROL_CLASS : ''}`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                </Field>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-company">Company</label>
                  <input id="contact-company" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </div>
              </div>

              {status === 'rate-limited' && (
                <div role="alert" className="mt-5 rounded-[var(--radius-md)] bg-amber-50 px-3.5 py-3 text-sm font-semibold leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                  {t('contact.rateLimited')}
                </div>
              )}

              {status === 'configuration-error' && (
                <div role="alert" className="mt-5 rounded-[var(--radius-md)] bg-red-50 px-3.5 py-3 text-sm font-semibold leading-relaxed text-red-800 dark:bg-red-950/40 dark:text-red-200">
                  {t('contact.configurationError')}
                </div>
              )}

              {status === 'error' && (
                <div role="alert" className="mt-5 rounded-[var(--radius-md)] bg-red-50 px-3.5 py-3 text-sm font-semibold leading-relaxed text-red-800 dark:bg-red-950/40 dark:text-red-200">
                  {t('contact.error')}
                </div>
              )}

              {status === 'timeout' && (
                <div role="alert" className="mt-5 rounded-[var(--radius-md)] bg-red-50 px-3.5 py-3 text-sm font-semibold leading-relaxed text-red-800 dark:bg-red-950/40 dark:text-red-200">
                  {t('contact.timeout')}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={submitting}
                aria-disabled={submitting}
                className="mt-6"
              >
                {t(submitting ? 'contact.form.sending' : 'contact.form.submit')}
              </Button>

              <p className="mt-4 text-xs leading-relaxed text-ink-muted text-pretty lg:text-sm">
                {t('contact.form.privacy.before')}{' '}
                <Link to="/privacy" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-ink">
                  {t('contact.form.privacy.link')}
                </Link>
                {t('contact.form.privacy.after')}
              </p>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-bold text-ink lg:text-base">
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-ink-faint">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-semibold leading-snug text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
