import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useSoundscape } from '../hooks/useSoundscape';
import type { SoundscapeId } from '../hooks/useSoundscape';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { IconButton } from '../components/ui/IconButton';
import type { IconProps } from '../components/icons/createIcon';
import {
  IconPlay, IconPause, IconClose, IconLoop, IconSkipBack, IconSkipForward,
  IconRain, IconCity, IconForest, IconCoffee, IconStorm, IconFireplace, IconOcean, IconElevator,
} from '../components/icons';

const SOUNDS: Array<{ id: SoundscapeId; Icon: ComponentType<IconProps>; labelKey: string }> = [
  { id: 'rain',      Icon: IconRain,      labelKey: 'soundscape.sounds.rain'      },
  { id: 'city',      Icon: IconCity,      labelKey: 'soundscape.sounds.city'      },
  { id: 'forest',    Icon: IconForest,    labelKey: 'soundscape.sounds.forest'    },
  { id: 'cafe',      Icon: IconCoffee,    labelKey: 'soundscape.sounds.cafe'      },
  { id: 'storm',     Icon: IconStorm,     labelKey: 'soundscape.sounds.storm'     },
  { id: 'fireplace', Icon: IconFireplace, labelKey: 'soundscape.sounds.fireplace' },
  { id: 'ocean',     Icon: IconOcean,     labelKey: 'soundscape.sounds.ocean'     },
  { id: 'elevator',  Icon: IconElevator,  labelKey: 'soundscape.sounds.elevator'  },
];

function fmt(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export function SoundscapePage() {
  const { t } = useTranslation();
  const {
    active, isPlaying, loop, currentTime, duration,
    play, stopAll, seek, skip, toggleLoop,
    pauseSeeking, commitSeeking,
  } = useSoundscape();

  const activeSound = SOUNDS.find((s) => s.id === active);

  return (
    <PageContainer feature="soundscape">
      <div className="space-y-6">
        <PageHeader feature="soundscape" title={t('soundscape.title')} subtitle={t('soundscape.subtitle')} />

        {/* Sound grid */}
        <div className="grid grid-cols-2 gap-3 w-full stagger">
          {SOUNDS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => play(s.id)}
                style={isActive ? { backgroundColor: 'var(--feature-soft)', borderColor: 'var(--color-ink)' } : undefined}
                className={`flex flex-col items-start gap-2 w-full rounded-[var(--radius-lg)] border-2 p-4 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-[var(--ease-out)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 ${
                  isActive
                    ? 'shadow-[var(--shadow-card)]'
                    : 'border-line bg-surface hover:border-ink hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]'
                }`}
              >
                <span
                  className="grid place-items-center w-10 h-10 rounded-[var(--radius-md)] border-2 border-ink"
                  style={{ backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' }}
                >
                  <s.Icon size={22} />
                </span>
                <div className="text-sm font-semibold text-ink">{t(s.labelKey)}</div>
                {isActive && (
                  <div className="flex items-center gap-1 text-xs font-bold text-[var(--feature-ink)]">
                    {isPlaying ? <IconPause size={12} /> : <IconPlay size={12} />}
                    {isPlaying ? t('soundscape.pause') : t('soundscape.play')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Player — shown when a sound is active */}
        {activeSound && (
          <div className="bg-surface rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-card)] p-4 space-y-3">
            {/* Title + stop */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--feature-ink)]">
                <activeSound.Icon size={20} />
                <span className="font-semibold text-ink text-sm">{t(activeSound.labelKey)}</span>
              </div>
              <button
                onClick={stopAll}
                className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors px-2 py-1 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-400"
              >
                <IconClose size={14} /> {t('soundscape.stop')}
              </button>
            </div>

            {/* Seek bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 1}
                step="0.5"
                value={currentTime}
                onPointerDown={pauseSeeking}
                onPointerUp={commitSeeking}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full accent-[var(--feature)]"
              />
              <div className="flex justify-between text-xs text-ink-muted tabular-nums">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={toggleLoop}
                title={t('soundscape.loop')}
                aria-pressed={loop}
                style={loop ? { backgroundColor: 'var(--feature-soft)', color: 'var(--feature-ink)' } : undefined}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-400 ${
                  loop ? '' : 'bg-surface-2 text-ink-muted hover:bg-brand-50'
                }`}
              >
                <IconLoop size={14} /> {t('soundscape.loop')}
              </button>
              <IconButton Icon={IconSkipBack} label="-10s" variant="ghost" shape="round" iconSize={22} onClick={() => skip(-10)} />
              <button
                onClick={() => play(active!)}
                aria-label={isPlaying ? t('soundscape.pause') : t('soundscape.play')}
                className="w-12 h-12 rounded-full bg-brand-400 hover:bg-brand-500 text-ink grid place-items-center transition-colors shadow-[var(--shadow-card)] cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400"
              >
                {isPlaying ? <IconPause size={22} /> : <IconPlay size={22} />}
              </button>
              <IconButton Icon={IconSkipForward} label="+10s" variant="ghost" shape="round" iconSize={22} onClick={() => skip(10)} />
            </div>

          </div>
        )}
      </div>
    </PageContainer>
  );
}
