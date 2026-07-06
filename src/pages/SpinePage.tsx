import { useTranslation } from 'react-i18next';
import { useSpine } from '../hooks/useSpine';
import { SPINE_BEATS } from '../data/spine';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconButton } from '../components/ui/IconButton';
import { IconShuffle, IconRefresh } from '../components/icons';

export function SpinePage() {
  const { t } = useTranslation();
  const { currentSeeds, rerollBeat, regenerateAll } = useSpine();

  return (
    <PageContainer feature="spine">
      <div className="space-y-4">
        <PageHeader
          feature="spine"
          title={t('spine.title')}
          subtitle={t('spine.subtitle')}
          action={
            <Button variant="primary" size="sm" onClick={regenerateAll}>
              <IconShuffle size={16} />
              {t('spine.regenerateAll')}
            </Button>
          }
        />

        <div className="stagger space-y-3">
          {SPINE_BEATS.map((beat, index) => (
            <Card key={beat.id} className="p-4 lg:p-6">
              <div className="flex items-start justify-between gap-2 lg:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-1 lg:mb-2 lg:text-base">
                    {t(beat.labelKey)}
                  </p>
                  <p className="text-base font-bold text-ink leading-snug lg:text-2xl">
                    {t(currentSeeds[index])}
                  </p>
                </div>
                <IconButton Icon={IconRefresh} label={t('spine.reroll')} onClick={() => rerollBeat(index)} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
