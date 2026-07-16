import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';

/**
 * Privacy policy. One page covers both surfaces the codebase ships: the web
 * Site (Vercel Analytics) and the native App (Aptabase + RevenueCat tips). The
 * `more` feature theme keeps the brand accent bar; no glyph on the masthead.
 */
export function PrivacyPage() {
  const { t } = useTranslation();
  const shortItems = t('privacy.short.items', { returnObjects: true }) as string[];
  const providerItems = t('privacy.providers.items', { returnObjects: true }) as string[];
  const email = t('privacy.contact.email');

  return (
    <PageContainer feature="more">
      <div>
        <PageHeader title={t('privacy.title')} subtitle={t('privacy.subtitle')} />
        <p className="-mt-3 mb-7 text-xs font-semibold uppercase tracking-wide text-ink-faint lg:text-sm">
          {t('privacy.lastUpdated')}
        </p>

        <section className="mb-9 rounded-[var(--radius-lg)] border-2 border-ink/10 bg-brand-50 p-4 lg:p-6">
          <h2 className="mb-3 font-label text-sm font-extrabold text-ink lg:text-base">
            {t('privacy.short.title')}
          </h2>
          <ul className="space-y-2">
            {shortItems.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted lg:text-base">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-8">
          <Section title={t('privacy.noServer.title')}>
            <P>{t('privacy.noServer.body')}</P>
          </Section>

          <Section title={t('privacy.local.title')}>
            <P>{t('privacy.local.body')}</P>
          </Section>

          <Section title={t('privacy.analytics.title')}>
            <P>{t('privacy.analytics.web')}</P>
            <P>{t('privacy.analytics.app')}</P>
          </Section>

          <Section title={t('privacy.purchases.title')}>
            <P>{t('privacy.purchases.body')}</P>
          </Section>

          <Section title={t('privacy.messages.title')}>
            <P>{t('privacy.messages.body')}</P>
          </Section>

          <Section title={t('privacy.providers.title')}>
            <ul className="space-y-2">
              {providerItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted lg:text-base">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t('privacy.store.title')}>
            <P>{t('privacy.store.body')}</P>
          </Section>

          <Section title={t('privacy.never.title')}>
            <P>{t('privacy.never.body')}</P>
          </Section>

          <Section title={t('privacy.rights.title')}>
            <P>{t('privacy.rights.body')}</P>
          </Section>

          <Section title={t('privacy.children.title')}>
            <P>{t('privacy.children.body')}</P>
          </Section>

          <Section title={t('privacy.changes.title')}>
            <P>{t('privacy.changes.body')}</P>
          </Section>

          <Section title={t('privacy.contact.title')}>
            <P>
              {t('privacy.contact.body')}{' '}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {email}
              </a>
            </P>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 font-label text-lg font-extrabold text-ink lg:text-xl">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-ink-muted text-pretty lg:text-base">{children}</p>;
}
