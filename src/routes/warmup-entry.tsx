import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';
import { warmupBySlug } from '../seo/warmupEntries';
import { BUILD_LANG, canonicalUrl, hreflangLinks } from '../seo/config';
import pl from '../locales/pl/translation.json';
import en from '../locales/en/translation.json';
import { AppErrorPage } from '../pages/ErrorPage';

type WarmupCopy = { name?: string; description?: string; tips?: string };
const PL_WARMUPS = (pl as { warmups: Record<string, WarmupCopy> }).warmups;
const EN_WARMUPS = (en as { warmups: Record<string, WarmupCopy> }).warmups;
const WARMUP_COPY = BUILD_LANG === 'en' ? EN_WARMUPS : PL_WARMUPS;
const ENTRY_COPY = {
  en: {
    backToWarmups: 'Back to warmups',
    titleSuffix: 'improv warmup game | Improv Toolbox',
    ogSuffix: 'improv warmup game',
    players: 'Players',
    time: 'Time',
    level: 'Level',
    coachTip: 'Coach tip:',
  },
  pl: {
    backToWarmups: 'Wróć do rozgrzewek',
    titleSuffix: 'gra rozgrzewkowa impro | Skrzynka Improwizatora',
    ogSuffix: 'gra rozgrzewkowa impro',
    players: 'Osoby',
    time: 'Czas',
    level: 'Poziom',
    coachTip: 'Wskazówka trenera:',
  },
} as const;

export const meta: MetaFunction = ({ params }) => {
  const game = warmupBySlug(params.slug);
  if (!game) return [{ title: 'Improv Toolbox' }];
  const copy = WARMUP_COPY[game.id] ?? EN_WARMUPS[game.id] ?? PL_WARMUPS[game.id] ?? {};
  const entry = ENTRY_COPY[BUILD_LANG];
  const name = copy.name ?? game.id;
  const desc = (copy.description ?? '').slice(0, 160);
  const path = `/warmups/${params.slug}`;

  return [
    { title: `${name} - ${entry.titleSuffix}` },
    { name: 'description', content: desc },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl(path) },
    ...hreflangLinks({ en: path, pl: path }),
    { property: 'og:title', content: `${name} - ${entry.ogSuffix}` },
    { property: 'og:description', content: desc },
  ];
};

export default function WarmupEntry() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const game = warmupBySlug(slug);

  if (!game) {
    return <AppErrorPage variant="not-found" statusCode={404} />;
  }

  const entry = ENTRY_COPY[BUILD_LANG];
  const players = game.maxPlayers
    ? t('warmups.players_range', { min: game.minPlayers, max: game.maxPlayers })
    : t('warmups.players_min', { min: game.minPlayers });

  return (
    <article className="mx-auto max-w-2xl p-6 text-ink">
      <nav className="mb-4 text-sm">
        <Link to="/warmup" className="text-brand-700 underline">← {entry.backToWarmups}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold mb-3">{t(game.nameKey)}</h1>
      <p className="text-lg leading-relaxed mb-5">{t(game.descriptionKey)}</p>
      <ul className="flex flex-wrap gap-2 mb-5 text-sm">
        <li className="rounded-full border-2 border-ink px-3 py-1">{entry.players}: {players}</li>
        <li className="rounded-full border-2 border-ink px-3 py-1">{entry.time}: {t('warmups.minutes', { count: game.durationMinutes })}</li>
        <li className="rounded-full border-2 border-ink px-3 py-1">{entry.level}: {t(`warmups.levels.${game.level}`)}</li>
      </ul>
      {game.tipsKey && (
        <p className="leading-relaxed">
          <strong>{entry.coachTip}</strong> {t(game.tipsKey)}
        </p>
      )}
    </article>
  );
}
