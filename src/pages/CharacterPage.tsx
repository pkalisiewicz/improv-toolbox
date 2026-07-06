import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharacter } from '../hooks/useCharacter';
import type { CharacterProfile } from '../hooks/useCharacter';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconButton } from '../components/ui/IconButton';
import type { IconProps } from '../components/icons/createIcon';
import {
  IconRefresh, IconBriefcase, IconTarget, IconSparkles, IconSpeech, IconEmotion, IconStatus,
} from '../components/icons';

interface TraitCardProps {
  Icon: ComponentType<IconProps>;
  label: string;
  value: string;
  onRegenerate: () => void;
}

function TraitCard({ Icon, label, value, onRegenerate }: TraitCardProps) {
  return (
    <Card className="p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 lg:mb-2 lg:gap-3">
            <span className="text-[var(--feature-ink)] [&_svg]:h-4 [&_svg]:w-4 lg:[&_svg]:h-6 lg:[&_svg]:w-6"><Icon size={16} /></span>
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide lg:text-base">{label}</span>
          </div>
          <p className="text-ink font-medium text-base leading-snug lg:text-2xl">{value}</p>
        </div>
        <IconButton Icon={IconRefresh} label={label} size="sm" onClick={onRegenerate} />
      </div>
    </Card>
  );
}

const TRAIT_CONFIG: Array<{
  key: Exclude<keyof CharacterProfile, 'status'>;
  Icon: ComponentType<IconProps>;
  labelKey: string;
}> = [
  { key: 'occupation', Icon: IconBriefcase, labelKey: 'character.occupation' },
  { key: 'want',       Icon: IconTarget,    labelKey: 'character.want'       },
  { key: 'quirk',      Icon: IconSparkles,  labelKey: 'character.quirk'      },
  { key: 'speech',     Icon: IconSpeech,    labelKey: 'character.speechType' },
  { key: 'emotion',    Icon: IconEmotion,   labelKey: 'character.emotion'    },
];

export function CharacterPage() {
  const { t } = useTranslation();
  const { profile, regenerateAll, regenerateTrait } = useCharacter();

  return (
    <PageContainer feature="character">
      <PageHeader
          feature="character"
          title={t('character.title')}
          subtitle={t('character.subtitle')}
          action={
            <Button variant="primary" size="sm" onClick={regenerateAll}>
              <IconRefresh size={16} />
              {t('character.regenerateAll')}
            </Button>
          }
        />

        <div className="space-y-3 stagger">
          {TRAIT_CONFIG.map(({ key, Icon, labelKey }) => (
            <TraitCard
              key={key}
              Icon={Icon}
              label={t(labelKey)}
              value={t(profile[key].textKey)}
              onRegenerate={() => regenerateTrait(key)}
            />
          ))}

          {/* Status card */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-[var(--feature-ink)] [&_svg]:h-4 [&_svg]:w-4 lg:[&_svg]:h-6 lg:[&_svg]:w-6"><IconStatus size={16} /></span>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide lg:text-base">{t('character.status')}</span>
              </div>
              <IconButton Icon={IconRefresh} label={t('character.status')} size="sm" onClick={() => regenerateTrait('status')} />
            </div>
            <div className="mt-2 flex items-center gap-2 lg:mt-4 lg:gap-4">
              <div className="flex gap-1 flex-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-full transition-colors lg:h-5 ${
                      i < profile.status ? 'bg-brand-400' : 'bg-brand-50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-brand-600 w-8 text-right lg:w-12 lg:text-3xl">{profile.status}</span>
            </div>
          </Card>
        </div>
    </PageContainer>
  );
}
