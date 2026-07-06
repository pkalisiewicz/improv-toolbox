import { useTranslation } from 'react-i18next';
import { useMetronome } from '../hooks/useMetronome';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { Badge } from '../components/ui/Badge';
import { IconButton } from '../components/ui/IconButton';
import { IconPlay, IconStop, IconPlus, IconMinus, IconTap, IconVolume } from '../components/icons';
import type { TimeSignature } from '../hooks/useMetronome';

const PRESETS: Array<{ bpm: number; labelKey: string }> = [
  { bpm: 60,  labelKey: 'metronome.presets.slow' },
  { bpm: 80,  labelKey: 'metronome.presets.speech' },
  { bpm: 110, labelKey: 'metronome.presets.fast' },
  { bpm: 120, labelKey: 'metronome.presets.musical' },
  { bpm: 160, labelKey: 'metronome.presets.patter' },
];

const TIME_SIGS: TimeSignature[] = [2, 3, 4, 6];

export function MetronomePage() {
  const { t } = useTranslation();
  const { bpm, isRunning, beat, timeSig, setBpm, setTimeSignature, toggle, tap } = useMetronome();

  const beats = Array.from({ length: timeSig }, (_, i) => i);

  return (
    <PageContainer feature="metronome">
      <div className="space-y-6">
        <PageHeader
          feature="metronome"
          title={t('metronome.title')}
          subtitle={t('metronome.subtitle')}
          action={<Badge color="feature">Alpha</Badge>}
        />

        {/* iOS sound hint */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--feature-soft)] border border-brand-200 text-xs text-[var(--feature-ink)]">
          <IconVolume size={16} className="shrink-0" />
          <span>{t('metronome.iosHint')}</span>
        </div>

        {/* Beat visualizer */}
        <div className="flex justify-center items-center gap-3 h-8">
          {beats.map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-75 ${
                isRunning && beat === i
                  ? i === 0
                    ? 'w-6 h-6 bg-brand-500 shadow-[var(--shadow-pop)]'
                    : 'w-5 h-5 bg-brand-300'
                  : 'w-3 h-3 bg-brand-100'
              }`}
            />
          ))}
        </div>

        {/* BPM display */}
        <div className="bg-surface rounded-[var(--radius-lg)] border border-line shadow-[var(--shadow-card)] p-6 text-center">
          <div className="text-7xl font-black text-ink tabular-nums leading-none mb-1">
            {bpm}
          </div>
          <div className="text-sm text-ink-muted font-medium">BPM</div>

          {/* +/- controls */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={() => setBpm(bpm - 5)}
              aria-label="-5 BPM"
              className="relative w-12 h-12 grid place-items-center rounded-full border-2 border-line text-ink-muted hover:border-brand-300 hover:text-brand-600 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400"
            >
              <IconMinus size={18} /><span className="absolute -bottom-0.5 right-1 text-[10px] font-bold">5</span>
            </button>
            <IconButton Icon={IconMinus} label="-1 BPM" variant="outline" shape="round" onClick={() => setBpm(bpm - 1)} />
            <IconButton Icon={IconPlus} label="+1 BPM" variant="outline" shape="round" onClick={() => setBpm(bpm + 1)} />
            <button
              onClick={() => setBpm(bpm + 5)}
              aria-label="+5 BPM"
              className="relative w-12 h-12 grid place-items-center rounded-full border-2 border-line text-ink-muted hover:border-brand-300 hover:text-brand-600 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400"
            >
              <IconPlus size={18} /><span className="absolute -bottom-0.5 right-1 text-[10px] font-bold">5</span>
            </button>
          </div>

          {/* BPM slider */}
          <input
            type="range"
            min={20}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full mt-4 accent-[var(--feature)]"
          />
          <div className="flex justify-between text-xs text-ink-muted mt-1">
            <span>20</span><span>240</span>
          </div>
        </div>

        {/* Time signature */}
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
            {t('metronome.timeSignature')}
          </p>
          <div className="flex gap-2">
            {TIME_SIGS.map((ts) => (
              <Chip
                key={ts}
                active={timeSig === ts}
                onClick={() => setTimeSignature(ts)}
                className="flex-1 justify-center"
              >
                {ts}/4
              </Chip>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
            {t('metronome.presets.label')}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Chip
                key={p.bpm}
                active={bpm === p.bpm}
                onClick={() => setBpm(p.bpm)}
              >
                {t(p.labelKey)} <span className="opacity-70">({p.bpm})</span>
              </Chip>
            ))}
          </div>
        </div>

        {/* Tap tempo + Start/Stop */}
        <div className="flex gap-3">
          <Button variant="accent" size="lg" onClick={tap} className="flex-1">
            <IconTap size={18} />
            {t('metronome.tap')}
          </Button>
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="lg"
            onClick={toggle}
            className="flex-1"
          >
            {isRunning ? <IconStop size={18} /> : <IconPlay size={18} />}
            {isRunning ? t('metronome.stop') : t('metronome.start')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
