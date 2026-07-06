import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Archetype } from '../../types';
import { useTranslation } from 'react-i18next';
import { Snake } from '../icons/Snake';
import { ArchetypeGlyph } from '../../theme/archetypeIcons';

interface WheelCanvasProps {
  archetypes: Archetype[];
  onSpinComplete: (winnerIndex: number) => void;
  triggerSpin: boolean;
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

export function WheelCanvas({ archetypes, onSpinComplete, triggerSpin }: WheelCanvasProps) {
  const { t } = useTranslation();
  const prevTrigger = useRef(false);
  const isSpinningRef = useRef(false);
  const rotationRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const onSpinCompleteRef = useRef(onSpinComplete);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  useEffect(() => {
    if (!triggerSpin) {
      prevTrigger.current = false;
      return;
    }

    if (!prevTrigger.current && !isSpinningRef.current && archetypes.length > 0) {
      prevTrigger.current = true;
      isSpinningRef.current = true;

      const segmentAngle = 360 / archetypes.length;
      const winnerIndex = Math.floor(Math.random() * archetypes.length);
      const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
      const targetMod = normalizeDegrees(360 - normalizeDegrees(winnerCenterAngle));
      const currentRotation = rotationRef.current;
      const currentMod = normalizeDegrees(currentRotation);
      const deltaToTarget = normalizeDegrees(targetMod - currentMod);
      const fullTurns = prefersReducedMotion ? 0 : 5 + Math.floor(Math.random() * 2);
      const finalRotation = currentRotation + fullTurns * 360 + deltaToTarget;
      const duration = prefersReducedMotion ? 120 : 2800 + Math.floor(Math.random() * 300);

      rotationRef.current = finalRotation;
      setSpinDuration(duration);
      setIsSpinning(true);
      setRotation(finalRotation);

      timeoutRef.current = window.setTimeout(() => {
        isSpinningRef.current = false;
        prevTrigger.current = false;
        setIsSpinning(false);
        onSpinCompleteRef.current(winnerIndex);
      }, duration + (prefersReducedMotion ? 40 : 180));
    }
  }, [triggerSpin, archetypes, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const segmentAngle = archetypes.length > 0 ? 360 / archetypes.length : 0;

  const gradient = useMemo(() => {
    if (archetypes.length === 0) return '';

    const divider = Math.min(1.25, segmentAngle * 0.08);
    const gradientStops = archetypes.flatMap((arch, i) => {
      const startDeg = i * segmentAngle;
      const endDeg = (i + 1) * segmentAngle;
      return [
        `${arch.color} ${startDeg}deg ${endDeg - divider}deg`,
        `rgba(16, 34, 26, 0.32) ${endDeg - divider}deg ${endDeg}deg`,
      ];
    });
    return `conic-gradient(from 0deg, ${gradientStops.join(', ')})`;
  }, [archetypes, segmentAngle]);

  if (archetypes.length === 0) return null;

  const wheelStyle = {
    '--wheel-rotation': `${rotation}deg`,
    '--wheel-spin-duration': `${spinDuration}ms`,
    background: gradient,
  } as CSSProperties;

  return (
    <div className="relative flex w-full flex-col items-center gap-3">
      <div className={`wheel-stage ${isSpinning ? 'is-spinning' : ''}`} aria-label={t('wheel.title')}>
        <div className={`wheel-pointer ${isSpinning ? 'is-spinning' : ''}`} aria-hidden="true" />

        <div className="wheel-track" aria-hidden="true" />

        {/* Wheel */}
        <div
          className={`wheel-disc ${isSpinning ? 'is-spinning' : ''}`}
          style={wheelStyle}
        >
          {/* Segment labels */}
          {archetypes.map((arch, i) => {
            const angle = i * segmentAngle + segmentAngle / 2;
            const rad = ((angle - 90) * Math.PI) / 180;
            const radius = archetypes.length <= 4 ? 31 : archetypes.length <= 8 ? 34 : 36;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);

            return (
              <div
                key={arch.id}
                className="wheel-segment-label"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                <span className="wheel-segment-icon">
                  <ArchetypeGlyph
                    id={arch.id}
                    size={24}
                    strokeWidth={2.6}
                    className="text-white"
                  />
                </span>
                <span className="wheel-segment-name">{t(arch.nameKey)}</span>
              </div>
            );
          })}
        </div>

        {/* Center hub stays fixed while the wheel moves underneath it. */}
        <div className="wheel-hub" aria-hidden="true">
          <Snake size={27} color="var(--color-ink)" eye="var(--color-brand-500)" />
        </div>
      </div>

      <div className="min-h-6" aria-live="polite">
        {isSpinning && (
          <p className="text-sm font-semibold text-ink-muted">
            {t('wheel.spinning')}
          </p>
        )}
      </div>
    </div>
  );
}
