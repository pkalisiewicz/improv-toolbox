import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimer } from '../hooks/useTimer';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { IconPlay, IconPause, IconRefresh, IconExpand, IconClose } from '../components/icons';

const PRESETS = [
  { label: '30s',    seconds: 30  },
  { label: '1 min',  seconds: 60  },
  { label: '2 min',  seconds: 120 },
  { label: '3 min',  seconds: 180 },
  { label: '5 min',  seconds: 300 },
  { label: '10 min', seconds: 600 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function TimerPage() {
  const { t } = useTranslation();
  const { remaining, duration, state, progress, setPreset, start, pause, reset } = useTimer();
  const [fullscreen, setFullscreen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const isDone = state === 'done';
  const isRunning = state === 'running';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - progress);

  if (fullscreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${isDone ? 'bg-red-500' : 'bg-ink-fill'} transition-colors cursor-pointer`}
        onClick={() => { if (isDone) { reset(); setFullscreen(false); } }}
      >
        <div className="text-white font-bold tabular-nums leading-none" style={{ fontSize: 'clamp(5rem, 20vw, 12rem)' }}>
          {formatTime(remaining)}
        </div>
        {isDone ? (
          <p className="text-white text-2xl mt-6 animate-pulse">{t('timer.done')}</p>
        ) : (
          <div className="flex gap-6 mt-10">
            <button
              onClick={(e) => { e.stopPropagation(); if (isRunning) { pause(); } else { start(); } }}
              className="text-white bg-white/20 hover:bg-white/30 rounded-full w-16 h-16 grid place-items-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-white"
            >
              {isRunning ? <IconPause size={26} /> : <IconPlay size={26} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="text-white bg-white/20 hover:bg-white/30 rounded-full w-16 h-16 grid place-items-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-white"
            >
              <IconRefresh size={24} />
            </button>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-white rounded-full px-2 py-1"
        >
          <IconClose size={16} /> {t('timer.exitFullscreen')}
        </button>
      </div>
    );
  }

  return (
    <PageContainer feature="timer">
      <div>
        <PageHeader feature="timer" title={t('timer.title')} subtitle={t('timer.subtitle')} />

        {/* Preset buttons */}
        <div className="flex gap-2 mb-6 flex-wrap stagger">
          {PRESETS.map((p) => (
            <Chip
              key={p.seconds}
              active={duration === p.seconds && state === 'idle'}
              onClick={() => setPreset(p.seconds)}
              className="flex-1 justify-center min-w-[3.5rem]"
            >
              {p.label}
            </Chip>
          ))}
          <input
            type="number"
            min="1"
            inputMode="numeric"
            placeholder={t('timer.customPlaceholder')}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onBlur={() => {
              const v = parseInt(customInput);
              if (v > 0) setPreset(v);
              setCustomInput('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            className="flex-1 py-1.5 px-3.5 text-sm text-center border border-line rounded-full min-w-[4rem] outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-400 bg-surface text-ink"
          />
        </div>

        {/* Circular progress */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--feature-soft)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className={`transition-all duration-1000 ${isDone ? 'text-red-500' : 'text-[var(--feature)]'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold tabular-nums ${isDone ? 'text-red-500' : 'text-ink'}`}>
                {formatTime(remaining)}
              </span>
            </div>
          </div>
          {isDone && (
            <p className="text-red-500 font-semibold mt-3 animate-pulse text-lg">{t('timer.done')}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-4">
          <Button
            size="lg"
            onClick={isRunning ? pause : start}
            className="flex-1"
          >
            {isRunning ? <IconPause size={20} /> : <IconPlay size={20} />}
            {isRunning ? t('timer.pause') : t('timer.start')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={reset}
            title={t('timer.reset')}
            aria-label={t('timer.reset')}
          >
            <IconRefresh size={20} />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setFullscreen(true)}
            title={t('timer.fullscreen')}
            aria-label={t('timer.fullscreen')}
          >
            <IconExpand size={20} />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
