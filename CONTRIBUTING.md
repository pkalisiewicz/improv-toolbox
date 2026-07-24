# Contributing to Improv Toolbox

Thanks for your interest in improving Improv Toolbox! Contributions of all
sizes are welcome — bug reports, translations, new tools, and fixes.

## Governance model

This is an open project with a **single maintainer** ([@pkalisiewicz](https://github.com/pkalisiewicz)).

- All changes land on `main` through a **pull request**.
- `main` is protected: nobody pushes to it directly, and every PR needs the
  maintainer's approving review before it can merge.
- The maintainer merges. Contributors do not need — and will not have — merge
  rights on `main`.

This keeps the app's direction and quality consistent while still welcoming
outside contributions.

## How to contribute

1. **Open an issue first** for anything beyond a trivial fix, so we can agree on
   the approach before you spend time on it.
2. **Fork** the repository and create a branch from `main`
   (e.g. `fix/timer-vibration` or `feat/new-warmup`).
3. Make your change (see _Development_ below).
4. Run the quality gates and make sure they pass.
5. **Open a pull request** against `main`. Fill in the PR template.
6. The maintainer reviews. Address feedback by pushing more commits to your
   branch. Once approved, the maintainer merges.

## Development

Node 22 is required.

```bash
npm install
npm run dev        # dev server
npm run build      # production build (also type-checks)
npm run lint       # ESLint
npm run test       # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
```

Before opening a PR, please make sure `npm run lint`, `npm run build`, and
`npm run test` all pass.

### Project conventions

- **TypeScript strict mode** with `verbatimModuleSyntax` — use `import type` for
  type-only imports.
- Data lives as plain TypeScript arrays in `src/data/`; each page has a matching
  hook in `src/hooks/`.
- The app is **bilingual**. If you touch user-facing text, update **both**
  `src/locales/en/translation.json` and `src/locales/pl/translation.json`.
  Translations are also managed via Crowdin — see the README for that workflow.
- Mobile-first, offline-first. Keep it working as a PWA.

## Translations

The fastest way to help with languages is through the Crowdin workflow described
in the README. For a brand-new language you can also open a PR that adds the
locale to `src/languages.ts` and loads its JSON in `src/i18n.ts`.

## What not to include

- **No secrets.** Never commit `.env*` files, API keys, keystores, or
  provisioning profiles.
- **Brand assets are reserved.** The "Improv Toolbox" name, the snake mascot,
  and the brand icons are **not** covered by the MIT license. Contributions must
  not repurpose them to brand other applications.

## License of contributions

By submitting a pull request, you agree that your contribution is licensed under
the project's [MIT license](LICENSE).

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold it.
