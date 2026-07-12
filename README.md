# Improv Toolbox

A free toolbox for improv coaches and players: 24 stage-ready tools in one
app, in English and Polish, working fully offline.

Use it three ways:

- **Web / PWA**: [improv-toolbox.com](https://www.improv-toolbox.com) — add it
  to your home screen and it runs like a native app, no store needed
- **iOS and Android**: native builds of the same app, via Capacitor
- **Self-hosted**: clone this repo and run it yourself

*Czytasz po polsku? Zobacz [README.pl.md](README.pl.md).*

## The tools

**Core**

| Tool | What it does |
|---|---|
| Archetype Wheel | Spins an animated wheel to assign one of 12 character archetypes to each player, no repeats |
| Scene Generator | Draws a full scene setup (location, relationship, situation, mood, era) with a genre filter and per-element reroll |
| Warmup Games | 69 games with rules and coaching tips, filterable by level and player count |
| Improv Facts | 60 facts on history, technique, and famous improvisers |

**Practice and rehearsal**

Timer with fullscreen mode and end-of-round vibration · Character Builder
(six rerollable traits) · Prompt Cards · Audience Suggestions with a
grab-bag mode · Format Library (18 formats from Harold to BAT) ·
Reflection Prompts for post-scene debriefs · Rehearsal soundscapes (rain,
cafe, ocean, and more) · BPM Metronome with tap tempo · Story Spine
Generator · Scene Constraints · Emotion Wheel (48 emotions in 6 families)

**Show tools**

Jam Caller Board with a fullscreen show mode · Harold Beat Caller · Status
Randomizer with tap-to-reveal cards · Game Variant Generator · Genre Style
Cards · Monologue Seeds · Improv Principles flash cards · Scene Replay ·
Deconstruction tracker with inline notes

## Development

Requires Node 22.

```bash
nvm use 22
npm install
npm run dev        # dev server
npm run build      # production build (also type-checks)
npm run test       # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
```

Built with React 19, TypeScript (strict), Vite 7, Tailwind CSS 4,
react-i18next, and React Router in framework mode with build-time
prerendering. There is no backend and no account system: all data lives in
plain TypeScript arrays under `src/data/`, and user state stays on the
device in localStorage.

The app ships bilingual. `improv-toolbox.com` defaults to English, other
domains default to Polish, and a header toggle persists your choice.
Translations live in `src/locales/en/` and `src/locales/pl/`.

### Contributing translations

Translations are managed in the public
[Improv Toolbox project on Crowdin](https://crowdin.com/project/improv-toolbox).
English is the source language, and each locale is a checked-in JSON file at
`src/locales/[locale]/translation.json`. Crowdin periodically proposes translated
files through a GitHub pull request; the app never contacts Crowdin at runtime.

To add or update a language:

1. Join the Crowdin project and translate or review the relevant language there.
2. A maintainer runs the **Crowdin translations** GitHub workflow (source changes
   also run it automatically).
3. Review and merge the pull request opened from `crowdin/translations`.
4. For a brand-new language, also add the locale to `src/languages.ts` and load its
   JSON file in `src/i18n.ts` before merging the first export.

Maintainers must configure three repository secrets:

- `CROWDIN_PROJECT_ID`: the numeric ID from the Crowdin project's API page.
- `CROWDIN_PERSONAL_TOKEN`: a Crowdin token with project read, source-file
  read/write, and translation read access.
- `CROWDIN_GITHUB_TOKEN`: a fine-grained GitHub token with repository Contents and
  Pull requests read/write access. Using a dedicated token ensures the translation
  pull request triggers the normal CI workflows.

The sync runs daily, on English source changes, or by manual dispatch. Its mapping
lives in `crowdin.yml`; credentials must never be committed. Vercel bundles the
reviewed, checked-in locale files during the normal application build.

## Native builds (Capacitor)

The `ios/` and `android/` directories hold the native shells. Both load the
same React bundle as the web app.

```bash
npm run sync:native   # build the web bundle and sync it into both platforms
npm run ios:dev       # run on an iOS simulator or device
```

Copy `.env.example` to `.env.local` first. Native device builds read your
Apple team ID from `IOS_DEVELOPMENT_TEAM`; analytics and the tip jar stay
disabled unless you provide keys. Android additionally needs Android Studio
and JDK 21.

## License

The source code is available under the [MIT license](LICENSE).

The "Improv Toolbox" name, the snake mascot, and the brand icons are not
covered by the MIT license. Do not use them to brand other applications.
