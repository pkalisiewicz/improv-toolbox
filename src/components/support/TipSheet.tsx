import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IconClose } from '../icons';
import { onOpenTipSheet, getTipOptions, purchaseTip, type TipOption } from '../../native/tipJar';

type Phase = 'loading' | 'choose' | 'buying' | 'thanks' | 'error' | 'unavailable';

/**
 * Global in-app tip sheet, mounted once in AppFrame (native only). Opens when
 * any SupportCreatorButton fires openTipSheet(). Tiers are loaded live from
 * RevenueCat, so this renders whatever is configured in the dashboard.
 */
export function TipSheet() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('loading');
  const [options, setOptions] = useState<TipOption[]>([]);

  useEffect(
    () =>
      onOpenTipSheet(() => {
        setOpen(true);
        setPhase('loading');
        void getTipOptions().then((opts) => {
          setOptions(opts);
          setPhase(opts.length > 0 ? 'choose' : 'unavailable');
        });
      }),
    [],
  );

  const close = useCallback(() => setOpen(false), []);

  const buy = useCallback(async (option: TipOption) => {
    setPhase('buying');
    const result = await purchaseTip(option);
    if (result === 'success') setPhase('thanks');
    else if (result === 'cancelled') setPhase('choose');
    else setPhase('error');
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={close}>
      <div
        className="w-full max-w-md mx-auto bg-surface border-t-2 border-ink rounded-t-[26px] p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('tip.title')}
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="font-display font-bold text-ink text-xl leading-tight">{t('tip.title')}</h2>
          <button
            onClick={close}
            className="shrink-0 grid place-items-center w-9 h-9 -mr-1 -mt-1 rounded-full text-ink-faint hover:text-ink hover:bg-surface-3 transition-colors"
            aria-label={t('tip.close')}
          >
            <IconClose size={18} />
          </button>
        </div>
        <p className="text-sm text-ink-muted leading-snug mb-5">{t('tip.subtitle')}</p>

        {phase === 'loading' && (
          <p className="py-8 text-center text-sm text-ink-faint">{t('tip.loading')}</p>
        )}

        {phase === 'unavailable' && (
          <p className="py-8 text-center text-sm text-ink-muted">{t('tip.unavailable')}</p>
        )}

        {(phase === 'choose' || phase === 'buying') && (
          <div className="grid gap-2.5">
            {options.map((option) => (
              <button
                key={option.productId}
                onClick={() => buy(option)}
                disabled={phase === 'buying'}
                className="flex items-center justify-between gap-3 w-full px-4 py-3.5 bg-surface border-2 border-ink rounded-[var(--radius-md)] text-left font-bold text-ink shadow-[var(--shadow-card)] hover:bg-brand-50 active:scale-[0.99] transition-[background-color,transform] duration-150 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <span className="min-w-0 truncate">{option.title}</span>
                <span className="shrink-0 rounded-full bg-brand-500 text-ink px-3 py-1 text-sm tabular-nums">
                  {option.priceString}
                </span>
              </button>
            ))}
            {phase === 'buying' && (
              <p className="pt-1 text-center text-xs text-ink-faint">{t('tip.processing')}</p>
            )}
          </div>
        )}

        {phase === 'thanks' && (
          <div className="py-6 text-center">
            <p className="font-display font-bold text-ink text-lg mb-1">{t('tip.thanksTitle')}</p>
            <p className="text-sm text-ink-muted mb-5">{t('tip.thanksBody')}</p>
            <button
              onClick={close}
              className="px-5 py-2.5 bg-brand-500 text-ink font-bold rounded-[var(--radius-md)] border-2 border-ink shadow-[var(--shadow-card)] active:scale-95 transition-transform"
            >
              {t('tip.done')}
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div className="py-6 text-center">
            <p className="text-sm text-ink-muted mb-4">{t('tip.error')}</p>
            <button
              onClick={() => setPhase('choose')}
              className="px-5 py-2.5 bg-surface text-ink font-bold rounded-[var(--radius-md)] border-2 border-ink active:scale-95 transition-transform"
            >
              {t('tip.retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
