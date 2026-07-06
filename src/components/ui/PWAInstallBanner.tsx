import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
}

/**
 * Bottom-sheet modal with step-by-step iOS install instructions.
 * Shown when the user taps the "Offline mode?" header button on iOS Safari,
 * which has no beforeinstallprompt — only manual Share → Add to Home Screen.
 */
export function PWAInstallModal({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-t-2xl w-full max-w-md mx-auto p-6 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-ink text-base">{t('install.modalTitle')}</h2>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink-muted transition-colors text-lg leading-none"
            aria-label={t('install.close')}
          >
            ✕
          </button>
        </div>

        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⬆️</span>
            <p className="text-sm text-ink" dangerouslySetInnerHTML={{ __html: t('install.iosStep1') }} />
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl mt-0.5">➕</span>
            <p className="text-sm text-ink" dangerouslySetInnerHTML={{ __html: t('install.iosStep2') }} />
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl mt-0.5">✅</span>
            <p className="text-sm text-ink" dangerouslySetInnerHTML={{ __html: t('install.iosStep3') }} />
          </li>
        </ol>
      </div>
    </div>
  );
}
