import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconButton } from '../components/ui/IconButton';
import { EmptyState } from '../components/ui/EmptyState';
import { IconShuffle, IconPlus, IconMinus, IconEye, IconEyeOff, IconStatus } from '../components/icons';
import { shuffleItems } from '../utils/randomBag';

function shuffle(count: number): number[] {
  const pool = Array.from({ length: 10 }, (_, i) => i + 1);
  return shuffleItems(pool).slice(0, count);
}

// Functional data colors — status level carries meaning (low / mid / high).
function numColor(n: number): string {
  if (n <= 3) return 'bg-blue-500';
  if (n <= 6) return 'bg-amber-500';
  return 'bg-red-500';
}

export function StatusPage() {
  const { t } = useTranslation();
  const [count, setCount] = useState(5);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  const hasNumbers = numbers.length > 0;

  const doShuffle = () => {
    setNumbers(shuffle(count));
    setRevealed(Array(count).fill(false));
  };

  const revealCard = (i: number) => {
    if (!hasNumbers) return;
    setRevealed((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const revealAll = () => setRevealed(Array(count).fill(true));
  const hideAll = () => setRevealed(Array(count).fill(false));

  return (
    <PageContainer feature="status">
      <div className="space-y-6">
        <PageHeader feature="status" title={t('status.title')} subtitle={t('status.subtitle')} />

        {/* Player count */}
        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{t('status.players')}</span>
          <div className="flex items-center gap-4">
            <IconButton
              Icon={IconMinus}
              label={t('status.players')}
              shape="round"
              onClick={() => setCount((c) => Math.max(2, c - 1))}
            />
            <span className="text-2xl font-black text-ink w-8 text-center tabular-nums">{count}</span>
            <IconButton
              Icon={IconPlus}
              label={t('status.players')}
              shape="round"
              onClick={() => setCount((c) => Math.min(10, c + 1))}
            />
          </div>
        </Card>

        {/* Shuffle button */}
        <Button size="lg" fullWidth onClick={doShuffle}>
          <IconShuffle size={20} />
          {t('status.shuffle')}
        </Button>

        {/* Cards grid */}
        {hasNumbers && (
          <>
            <div className={`grid gap-3 stagger ${count <= 4 ? 'grid-cols-2' : count <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {numbers.map((n, i) => (
                <button
                  key={i}
                  onClick={() => revealCard(i)}
                  className={`rounded-[var(--radius-lg)] aspect-square flex flex-col items-center justify-center transition-all duration-200 ease-[var(--ease-out)] active:scale-95 border-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 ${
                    revealed[i]
                      ? `${numColor(n)} border-transparent text-white shadow-[var(--shadow-card)]`
                      : 'bg-surface border-line text-ink-muted hover:border-brand-200'
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">
                    {t('status.player')} {i + 1}
                  </div>
                  {revealed[i] ? (
                    <div className="text-4xl font-black leading-none">{n}</div>
                  ) : (
                    <div className="text-3xl font-bold opacity-30">?</div>
                  )}
                </button>
              ))}
            </div>

            {/* Reveal / hide all */}
            <div className="flex gap-3">
              <Button variant="primary" size="md" onClick={revealAll} className="flex-1">
                <IconEye size={16} />
                {t('status.revealAll')}
              </Button>
              <Button variant="secondary" size="md" onClick={hideAll} className="flex-1">
                <IconEyeOff size={16} />
                {t('status.hideAll')}
              </Button>
            </div>
          </>
        )}

        {!hasNumbers && (
          <EmptyState Icon={IconStatus} title={t('status.hint')} />
        )}
      </div>
    </PageContainer>
  );
}
