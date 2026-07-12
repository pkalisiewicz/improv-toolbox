import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Snake } from '../components/icons/Snake';
import {
  IconArrowLeft,
  IconPrompts,
  IconRefresh,
  IconScene,
  IconWarmup,
} from '../components/icons';

export type AppErrorVariant = 'not-found' | 'crash';

interface AppErrorPageProps {
  variant: AppErrorVariant;
  statusCode?: number;
}

const quickMoves = [
  { to: '/scene', labelKey: 'error.actions.scene', fallback: 'Scene', Icon: IconScene },
  { to: '/warmup', labelKey: 'error.actions.warmup', fallback: 'Warmup', Icon: IconWarmup },
  { to: '/prompts', labelKey: 'error.actions.prompts', fallback: 'Prompts', Icon: IconPrompts },
];

const copyFallbacks = {
  notFound: {
    kicker: '404',
    title: 'OHO, you got lost!',
    body: 'It was supposed to be "Yes, and". It became "No no". Don\'t worry, I got you. Come back to the toolbox.',
  },
  crash: {
    kicker: '500',
    title: 'OHO, something broke!',
    body: 'It was supposed to be "Yes, and". It became "No no". Don\'t worry, I got you. Reload or come back to the toolbox.',
  },
} as const;

const actionFallbacks = {
  home: 'Back',
  retry: 'Reload',
  quickMoves: 'Or pick a tool',
} as const;

export function AppErrorPage({ variant, statusCode }: AppErrorPageProps) {
  const { t } = useTranslation();
  const isNotFound = variant === 'not-found';
  const copyKey = isNotFound ? 'notFound' : 'crash';
  const status = statusCode?.toString() ?? (isNotFound ? '404' : '500');
  const tx = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const reload = () => {
    window.location.reload();
  };

  return (
    <section
      aria-labelledby="error-title"
      className="relative flex min-h-full overflow-hidden bg-surface-2 px-4 py-6 text-ink lg:px-8 lg:py-8"
    >
      <div aria-hidden className="absolute left-0 top-0 h-1.5 w-full bg-brand-500" />

      <div className="mx-auto grid w-full max-w-6xl content-center gap-6 pt-3 lg:grid-cols-[minmax(21rem,0.95fr)_minmax(24rem,1.05fr)] lg:items-center lg:gap-10">
        <div className="error-stage" aria-hidden="true">
          <span className="error-stage-code">{status}</span>
          <span className="error-cue-card error-cue-card-a"><span /></span>
          <span className="error-cue-card error-cue-card-b"><span /></span>
          <span className="error-cue-card error-cue-card-c"><span /></span>
          <span className="error-mascot-light">
            <Snake
              size={86}
              color="var(--color-ink)"
              eye="var(--color-brand-500)"
              className="error-mascot"
            />
          </span>
        </div>

        <div className="min-w-0">
          <h1
            id="error-title"
            className="max-w-[13ch] text-[2.85rem] font-black leading-[0.95] tracking-[0.005em] text-ink [overflow-wrap:anywhere] lg:text-[4.75rem]"
          >
            {tx(`error.${copyKey}.title`, copyFallbacks[copyKey].title)}
          </h1>

          <p className="mt-4 max-w-[42rem] text-base leading-relaxed text-ink-muted text-pretty lg:mt-5 lg:text-xl">
            {tx(`error.${copyKey}.body`, copyFallbacks[copyKey].body)}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-8">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-ink bg-brand-500 px-5 py-3 text-base font-extrabold text-ink shadow-[var(--shadow-hard)] transition-[transform,box-shadow,background-color] duration-150 ease-[var(--ease-out)] hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
            >
              <IconArrowLeft size={19} />
              {tx('error.actions.home', actionFallbacks.home)}
            </Link>

            {!isNotFound && (
              <button
                type="button"
                onClick={reload}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-ink bg-surface px-5 py-3 text-base font-extrabold text-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-surface-3 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
              >
                <IconRefresh size={19} />
                {tx('error.actions.retry', actionFallbacks.retry)}
              </button>
            )}
          </div>

          <nav aria-label={tx('error.quickMoves', actionFallbacks.quickMoves)} className="mt-7 lg:mt-9">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-label text-sm font-extrabold text-ink lg:text-base">
                {tx('error.quickMoves', actionFallbacks.quickMoves)}
              </span>
              <span aria-hidden className="h-0.5 flex-1 rounded-full bg-ink/20" />
            </div>

            <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))]">
              {quickMoves.map(({ to, labelKey, fallback, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex min-h-16 items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-3.5 py-3 text-left shadow-[var(--shadow-card)] transition-[background-color,border-color] duration-150 ease-[var(--ease-out)] hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-brand-50 text-brand-700 transition-colors duration-150 group-hover:bg-brand-100">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 font-label text-sm font-extrabold leading-tight text-ink lg:text-base">
                    {tx(labelKey, fallback)}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
