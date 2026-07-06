# Improv Toolbox — Redesign Brief (2026 / Elevated, single-accent)

Apply this when restyling any page. **Change presentation only — never change logic, state,
hooks, data, i18n `t()` keys, routes, or behavior.** The app must work exactly as before.

## North star
Premium, modern, high-craft, interactive. Light green-tinted canvas + ONE fresh-green accent used
identically everywhere. Crisp custom line icons. Strong Fredoka headings. Fluid ease-out
motion + tactile micro-interactions. NO bounce/elastic. NO emoji as UI icons.

## Tokens (already defined in `src/index.css` + Tailwind v4 `@theme`)
- Text: `text-ink` (primary), `text-ink-muted` (secondary). NEVER use `text-gray-700/500/400`
  for body/labels — replace with `text-ink` / `text-ink-muted`.
- Surfaces: page bg is `surface-2` (set globally). Cards: `bg-white`. Borders: `border-line`.
- Accent (the ONLY accent): `brand-50…700`. Use `text-brand-600/700`, `bg-brand-50/100/400`,
  `border-brand-200`. Replace every per-feature color (emerald/rose/violet/etc.) with `brand-*`.
- Per-feature CSS vars (set by PageContainer): `var(--feature)`, `var(--feature-soft)`,
  `var(--feature-ink)` — currently all green. Use via `bg-[var(--feature-soft)]` etc. or just `brand-*`.
- Radius: `rounded-[var(--radius-sm|md|lg|xl)]` (0.5 / 0.75 / 1 / 1.5rem).
- Elevation: `shadow-[var(--shadow-card)]`, hover `shadow-[var(--shadow-pop)]`. No `shadow-sm`.
- Motion: `ease-[var(--ease-out)]` or `ease-[var(--ease-out-strong)]`, durations 150–250ms.
  Press: `active:scale-95`. NO `cubic-bezier` overshoot, NO `animate-bounce`.
- Headings use Fredoka automatically (h1/h2/h3) or add `font-display`.

## Shared components (prefer these over hand-rolled markup)
- `PageHeader` (`src/components/ui/PageHeader.tsx`): `<PageHeader feature="X" title={t('..')} subtitle={t('..')} action={<...>} />`
  — replaces every hand-rolled page header (the `<div className="mb-6"><h1>…`). `feature` MUST
  match the page's `PageContainer feature="X"`.
- `Button` (`variant`: primary | accent | secondary | ghost | danger; `size`: sm|md|lg|xl).
  Primary = green + ink, AA-safe. Put icons as first child: `<Button><IconX size={18}/>{label}</Button>`.
- `Card` — token elevation; pass `onClick` for hover-lift interactive cards. Do NOT use the
  `border-l-4` side-stripe accent (banned). For accent, use the PageHeader icon + soft tint instead.
- `Chip` (`src/components/ui/Chip.tsx`): the standard filter pill. `<Chip active={..} onClick={..}>{label}</Chip>`.
  Replace ALL hand-rolled filter pills (genre/category/difficulty/level) with this.
- `Badge` — `color="feature"` for the green-tinted badge; or existing named colors for data.

## Icons (`src/components/icons`) — use these, never emoji, for UI/controls
Feature glyphs: IconWheel, IconScene, IconWarmup, IconFacts, IconMore, IconTimer, IconCharacter,
IconPrompts, IconSuggestions, IconFormats, IconReflection, IconSoundscape, IconStatus, IconSpine,
IconJam, IconPrinciples, IconMonologue, IconGenres, IconHarold, IconEmotion, IconConstraints,
IconMetronome, IconVariants, IconReplay, IconDeconstruction.
UI/controls: IconRefresh, IconShuffle, IconArrowLeft, IconArrowRight, IconChevronLeft,
IconChevronRight, IconChevronDown, IconClose, IconPlus, IconMinus, IconCheck, IconPlay, IconPause,
IconDownload, IconGlobe, IconSparkles, IconEye, IconEyeOff, IconVolume, IconCoffee.
Replace: 🔄/↻→IconRefresh, ▶/⏸→IconPlay/IconPause, ←→→IconArrowLeft/Right, ▼→IconChevronDown,
✕→IconClose, +/−→IconPlus/IconMinus, ✓→IconCheck, 🎲→IconShuffle, 🔊→IconVolume, 👁→IconEye, etc.
**Keep emoji only where it is genuine CONTENT/DATA** (archetype glyphs, emotion families,
genre/soundscape flavor, a single celebratory moment). When unsure, prefer a custom icon.

## Emoji UI-control → icon (common cases)
prev/next nav arrows, regenerate/reroll/shuffle buttons, expand/collapse chevrons, play/pause,
reveal/hide eye, close, +/− steppers → ALL become custom icons in a tinted square chip
(`grid place-items-center w-9 h-9 rounded-[var(--radius-md)] bg-brand-50 text-brand-600`) or
inside a `Button`.

## Interaction polish (the "2026 / interactive" feel)
- Lists/grids: add `stagger` class to the container for sequenced entrance.
- Tappable cards/tiles: hover lift + `active:scale-[0.99]`, `cursor-pointer`, `transition` ease-out.
- All interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400`.
- Min 44px touch targets; 8px+ gaps. Respect existing reduced-motion (global guard already set).
- One primary CTA per screen; secondary actions visually subordinate.

## Reference implementations (read these first)
- `src/pages/SplashPage.tsx` — list rows with icon chips, hero, sections, coffee card.
- `src/pages/WheelPage.tsx` — PageHeader, token buttons, Badge, custom icons, data colors kept.

## Per-page checklist
1. Replace hand-rolled header → `PageHeader feature="<same as PageContainer>"`.
2. Swap all `gray-*` text → `ink` / `ink-muted`; `border-gray-*` → `border-line`.
3. Swap every non-brand accent color → `brand-*` (keep functional DATA colors: archetype/status
   level/emotion-family palettes — those carry meaning).
4. Filters → `Chip`. Headers/controls emoji → custom icons. Cards → token radius/shadow, no side-stripe.
5. Add `stagger` to primary lists; add focus-visible + cursor-pointer to interactives.
6. Keep ALL hooks/state/handlers/`t()` keys/props identical. Do not touch data files.
