# Improv Toolbox — Designer Hand-off (Blank-Slate Redesign)

> **Read this first.** This brief describes the app **by what it does**, not by how it
> currently looks. There is an existing visual design — **ignore it entirely.** Your job is to
> invent a fresh visual language and layout system from the functionality below. No colors,
> fonts, icons, or layouts are prescribed. Where this document mentions a visual ("a big card,"
> "a grid"), treat it as a *functional requirement* (what must be possible), not a design.

---

## 0. The ask in one line

Redesign an entire offline, mobile-first improv-comedy toolkit (one launcher + 24 self-contained
tools = 26 screens) from a clean slate, driven only by what each tool does and how it's used in
the room.

---

## 1. What this product is

**Improv Toolbox** is a free, installable, fully-offline mobile web app (PWA) that bundles a large
set of small, single-purpose tools improvisers use during practice and performance. Think of it as
a **stage-manager's pocket toolbox**: open a tool, get exactly what you need in one or two taps,
put the phone down, keep the energy in the room.

It is not a content app you sit and read, and not a social/account product. There is no login, no
backend, no network dependency. Every tool is self-contained and works on a plane, backstage, or in
a windowless rehearsal room with no signal.

The 24 tools fall into three functional jobs:

1. **Generators / draw decks** — "give me a random thing to play with *right now*" (a scene
   premise, a character, an emotion, a prompt, a constraint).
2. **Reference libraries** — "let me look something up or learn it" (warmup games, formats,
   principles, glossary).
3. **Run-the-room utilities** — "help me run this rehearsal or show" (timer, metronome, soundscape,
   status game, Harold board, jam set-list, deconstruction notebook).

---

## 2. Who uses it & where (these ARE the design constraints)

- **Users:** improvisers, improv teachers, and troupe/jam hosts — beginner to pro.
- **Moment of use:** mid-rehearsal, warming up backstage, running a workshop, hosting a jam. Short,
  repeated, interruptible sessions. The job is "give me the next prompt/structure/randomizer
  instantly," never "make me read."
- **Physical context:** one-handed, thumb-driven, often in **low light** (black-box theatre /
  rehearsal room). Frequently **offline**.
- **Two reading distances matter:**
  - *Arm's length* — most tools (browsing, configuring, building a queue).
  - **Across a room** — draw cards, the timer, and "show mode" screens must be legible to a
    performer or audience several meters away. This is a hard, recurring requirement.

**Design implications you must honor:** big thumb targets low on the screen; high contrast for dark
rooms; instant response (no spinners — there's nothing to load); a clear "glanceable" mode for the
across-the-room tools.

---

## 3. What to throw away (do NOT carry any of this forward)

The current build has a deliberate aesthetic. **Discard all of it** and start fresh:

- ❌ The single "brand gold" accent color and the entire current palette.
- ❌ The current fonts (a serif display + a sans body).
- ❌ The bespoke line-icon family and the snake mascot *as the visual system* (the brand
  personality can stay — see §10 — but you are free to reinvent its expression).
- ❌ The "riso-poster / playbill" texture, hard poster-shadows, paper grain.
- ❌ The flat 2-column grid for the tool hub and the splash directory.
- ❌ All specific motion curves, radii, shadow tokens, spacing scales.

You inherit **zero** visual decisions. Only functionality, IA, and usage context are fixed.

---

## 4. Non-negotiable functional constraints

| Constraint | What it means for design |
|---|---|
| **Mobile-first PWA** | Portrait phone is the primary canvas. Must feel native installed (standalone, safe-area insets top & bottom). Tablet/desktop is a bonus, not the target. |
| **Fully offline** | No loading states, no empty-network states, no skeletons. Everything is instant. |
| **Bilingual EN / PL** | Every label is translated. **Polish strings run ~20–35% longer** than English — layouts must flex and never truncate or clip. A language toggle must always be reachable. |
| **Two-tap rule** | Core action of any tool reachable in ≤2 taps from opening it. |
| **Accessibility (WCAG AA)** | Body text ≥4.5:1, large/UI ≥3:1. Touch targets ≥44px with ≥8px gaps. Visible focus states. Respect `prefers-reduced-motion` (motion collapses to instant). **Meaning is never carried by color alone** — archetype identity, status bands (low/mid/high), and emotion families must also read via text/icon/shape. |
| **One-handed** | Primary controls live in the lower/thumb zone; avoid top-corner-only actions. |

---

## 5. Information architecture

There are **26 destinations**: 1 launcher + 5 "primary" surfaces + 20 "secondary" tools.

### Primary navigation
A persistent way to reach the **5 anchors**, available on every screen:
`Wheel · Scene · Warmup · Facts · More`. (Today this is a bottom tab bar — you may keep, replace,
or rethink the mechanism, but primary nav must be always-present and one-handed.)

### The "More" hub — your biggest IA opportunity
The other **20 tools** currently live behind "More" as an **undifferentiated flat grid with no
grouping, no search, no sort.** That's the weakest part of the product. Redesign this hub so a
hurried host can find a tool fast. Suggested functional grouping (you may regroup):

- **Generators & draws:** Character, Prompts, Suggestions, Monologue, Emotion, Constraints,
  Replay, Variants, Story Spine.
- **Reference & learning:** Formats, Principles, Genres. (Warmup & Facts are primary anchors.)
- **Run-the-room:** Timer, Metronome, Soundscape, Status, Harold, Jam, Deconstruction, Reflection.

Consider: search/filter, grouping headers, recently-used, or favoriting. Two tools are flagged
**"Alpha"** (Jam, Metronome) and need a subtle "experimental" marker.

### Navigating back
Sub-tools need an unambiguous way back to the hub (today "More" stays highlighted with no obvious
return — a known wart). Solve this cleanly in your nav model.

### Global chrome present on (almost) every screen
- App identity / home affordance (tapping it returns to the launcher).
- Language toggle.
- An "install / offline" affordance shown only when not yet installed (on iOS this opens a
  "how to add to home screen" instruction sheet; on Android it triggers the native install prompt).
- A per-tool header (tool name + short subtitle + optional single action like "Regenerate all").
- A "support / buy me a coffee" link (low-key, appears on launcher + hub).

### Launcher (route `/`)
A static home/index — **not** an onboarding flow (there is none today; adding light first-run
guidance is an open option, §8). It currently shows a hero with a primary CTA plus a directory of
all tools. Reinvent it as the welcoming front door.

---

## 6. Shared interaction primitives (design ONCE, reuse everywhere)

These recurring mechanics define the product's feel. Design each as a reusable pattern, not per
screen. The number of tools using each is in brackets.

1. **The Draw Stage** *(≈9 tools)* — the signature interaction. One large piece of content
   (a prompt/word/emotion/constraint) owns nearly the whole screen as a headline meant to be read
   **across a room**. **Tap anywhere to draw the next one.** Has: a small category "stamp" label, a
   position counter ("12 / 59"), an optional Prev/Next for sequential decks, and a primary "Draw /
   Next / Spin" button at the bottom. Used by: Prompts, Suggestions, Monologue, Constraints,
   Principles, Reflection, Emotion, Replay (and conceptually Scene). **This is the most important
   thing to get right.**

2. **Filter chip row** *(≈10 tools)* — a horizontally scrollable row of single-select pills
   (category / difficulty / level / genre / player-count). Selecting one usually re-draws or
   re-filters immediately.

3. **Reroll & Regenerate** *(Wheel, Scene, Character, Spine)* — every element shows a per-element
   "shuffle this one" control, plus a global "regenerate everything" action. Must feel tactile and
   instant.

4. **Tap-to-reveal cards** *(Status, Harold)* — face-down cards that flip to show a value on tap,
   with "Reveal all / Hide all" bulk controls. (Status also color-bands the revealed value by
   low/mid/high — needs a non-color cue too.)

5. **Fullscreen "show mode"** *(Timer, Jam, Deconstruction)* — a distraction-free performance
   overlay that replaces all chrome: a big focal element, a top bar (position counter + exit), and
   advance controls (tap-to-advance or prev/next), ending in a "done" state. **Today these are
   built separately three times — unify them into one show-mode shell.**

6. **List / queue builder** *(Jam, Deconstruction)* — text input + "add" (Enter to submit) +
   quick-add chips, producing a numbered list of rows each with a delete control, then a "Start"
   CTA that launches show mode.

7. **Steppers** *(Status player count, Timer custom, Deconstruction beats)* — +/− count controls
   and step-through-beats navigation with tappable progress segments.

8. **Detail card with meta badges** *(Warmup, Formats, Genres)* — a content card with a row of
   metadata badges (players, duration, difficulty, category) and body text; sometimes list→detail
   drill-down.

9. **Transport controls** *(Soundscape, Metronome, Timer)* — play/pause, seek bar, ±skip, and
   live numeric readouts.

10. **Multi-beat board** *(Harold, Deconstruction)* — a structured sequence of named beats shown as
    a board/stepper with progress, where each beat can be marked done.

11. **Inline confirm** *(Deconstruction)* — destructive actions confirm in place (Yes/No) rather
    than via a separate dialog.

12. **EmptyState** — a consistent first-run placeholder (icon + title + hint + optional action) for
    tools that start empty (Status before shuffle, Jam before adding games).

> **Persistence note:** all tools are **ephemeral** (state resets on reload) **except
> Deconstruction**, which saves multiple sessions, notes, and drafts. Only the language choice
> persists app-wide. Don't design "saved state" affordances for tools that don't have it — but the
> Deconstruction notebook genuinely needs session management UI.

---

## 7. The 26 screens, by functional family

Each entry: **what it does · key states · data scale · the interaction that defines it.**

### Launcher & Hub
- **Splash / Launcher** (`/`) — front door. Welcome + a primary CTA + a way into every tool. *Not*
  a tutorial. Reinvent as the welcoming index.
- **More hub** (`/more`) — directory of the 20 secondary tools. **Redesign for findability**
  (grouping/search) — see §5.

### Family A — Generators & Draw decks (instant inspiration)
- **Archetype Wheel** (`/wheel`, primary) — a spin-the-wheel that assigns 1 of 12 character
  archetypes to each of 2–8 players, one spin at a time. States: *setup* (pick player count, choose
  archetype pool, allow-duplicates toggle) → *spinning* (animated wheel, per-player) → *reveal*
  (winner card: emoji + name + description; re-spin option) → *leaderboard* (player→archetype list).
  Data: 12 archetypes. Defining interaction: a **physical-feeling spin animation** landing a pointer
  on a segment; pool shrinks as archetypes are assigned.
- **Scene Generator** (`/scene`, primary) — random scene premise: Location + Relationship +
  Situation, plus optional Mood + Time period. Genre filter (7 options) biases all pools. Per-element
  reroll + regenerate-all. Data: 134 elements. Defining interaction: stack of element cards, each
  individually re-shuffleable; collapsible "extras."
- **Character Builder** (`/character`) — assembles a 5-trait character (occupation, want, quirk,
  speech, emotion) + a 1–10 status shown as a 10-segment bar. Per-trait reroll + regenerate-all.
  Data: ~108 items.
- **Prompt Cards** (`/prompts`) — **Draw Stage.** Scene-starter prompts in 5 categories. 60 cards.
- **Audience Suggestions** (`/suggestions`) — **Draw Stage** for single suggestions across 6
  categories, **plus a "grab-bag" mode** that draws 4 ingredients at once (location/occupation/
  relationship/emotion) as a 4-row callsheet. 78 items.
- **Monologue Seeds** (`/monologue`) — **Draw Stage** flash deck of "Tell about a time when…"
  prompts, 7 categories. 58 seeds.
- **Emotion Wheel** (`/emotion`) — **Draw Stage**; draws one random emotion, filterable by 6 Ekman
  families. Random (not sequential) — "Spin" not "Next." 48 emotions.
- **Scene Constraints** (`/constraints`) — **Draw Stage**; a restriction to add to a scene, 4
  categories, sequential deck. 45 constraints.
- **Replay Modifiers** (`/replay`) — **Draw Stage**; "do the scene again, but with this twist," 5
  categories, with a full reshuffle action. 41 cards.
- **Game Variants** (`/variants`) — draws one game "twist" modifier; optional typed game name to
  label it; 4 category filters. 50 modifiers. Single result card.
- **Story Spine** (`/spine`) — a 6-beat narrative skeleton ("Once upon a time…" → "Ever since…"),
  one random seed per beat, per-beat reroll + "New story." 6 beats × 15 seeds = 90.

### Family B — Reference & learning libraries (browse / look up)
- **Warmup Games** (`/warmup`, primary) — filterable library of 54 games (level × player-count ×
  category, AND-combined) with a one-tap random picker that respects filters. Result = a detail card
  with badges (level, category, players, duration) + description + optional tip. Live filtered count.
- **Facts & Glossary** (`/facts`, primary) — **two sections via a segmented switch.** *Facts:* a
  shuffled, prev/next deck of 59 facts in 4 categories (with optional source line). *Glossary:* a
  live text-searchable, category-filterable A–Z list of 32 terms with definitions + an empty state.
- **Format Library** (`/formats`) — catalog of 18 long-form formats; difficulty filter; **list →
  detail** drill-down. List cards show name + badges (difficulty, players, duration, suggestion
  type); detail shows full description.
- **Improv Principles** (`/principles`) — **Draw Stage** flash-card deck of 41 principles (name +
  explanation + optional example), 6 categories, sequential with wrap-around.
- **Genre Style Cards** (`/genres`) — pick 1 of 8 genres → a card with 5 numbered style tips.
  Browse-by-selection (no random, no deck). 40 tips total.

### Family C — Run-the-room / performance utilities
- **Scene Timer** (`/timer`) — countdown with presets (30s/1/2/3/5/10m) + custom minutes, a
  circular progress ring, MM:SS readout, vibrate-on-done. **Has a fullscreen mode** (giant readout,
  goes red + tap-anywhere-to-reset when done). States: idle/running/paused/done × normal/fullscreen.
- **BPM Metronome** (`/metronome`, *Alpha*) — synthesized click, BPM 20–240 (slider + ±1/±5 +
  presets + **tap-tempo**), 4 time signatures, accented downbeat, a beat-dot visualizer. (iOS
  silent-switch workaround handled in code.)
- **Soundscape Player** (`/soundscape`) — loops 1 of 8 ambient environments under a scene.
  Tile grid → select & autoplay; transport panel (play/pause, seek bar, ±10s, loop, stop). 8 loops.
- **Status Randomizer** (`/status`) — deals each of 2–10 players a unique hidden number 1–10; **tap
  a card to privately reveal**; reveal-all/hide-all; revealed value banded low/mid/high (needs a
  non-color cue). Player-count stepper. Starts on an EmptyState until shuffled.
- **Harold Beat Caller** (`/harold`) — a live 12-beat Harold structure board (Opening → 3 rounds ×
  3 scenes → 2 group games). Tap a beat to mark done; progress bar; an audience-suggestion text
  field; celebration at 12/12; reset. **Multi-beat board.**
- **Jam Caller Board** (`/jam`, *Alpha*) — build an ordered set-list of games (free text + quick-add
  from the 18 formats), then **"Start Show" → fullscreen show mode** that walks game-by-game
  (large name + meta badges + numbered rules + "n/total" + prev/next/exit) ending in a done screen.
  **List builder + show mode.**
- **Deconstruction Notebook** (`/deconstruction`) — **the richest, only persistent tool.** A
  multi-session, beat-by-beat note-taking workbench for analyzing a deconstruction-format show.
  Create a session (optional suggestion title + up to 2 character names) → **show mode** stepper over
  11 named beats + a general bucket: mark beats done, write notes tagged by 1 of 6 categories,
  insert character tokens, delete notes; tappable progress segments; "completed / 11" count. A
  separate **summary mode** groups all notes by category for review. Manages a **list of saved past
  sessions** (open / summary / inline-confirm delete) and **auto-saves drafts**. Needs real
  session-management + note-composer UI. Persists to local storage.
- **Reflection Prompts** (`/reflection`) — **Draw Stage**; one debrief/reflection question at a
  time, 5 categories. Used post-scene/show. 20 prompts.

---

## 8. Open design questions & opportunities (please weigh in)

1. **Hub findability** — flat grid → grouped/searchable/favoritable? (Highest-impact change.)
2. **Unify "show mode"** — one shared fullscreen performance shell for Timer, Jam, Deconstruction
   (and possibly a "present this card" mode for any Draw Stage tool).
3. **Light onboarding?** — there's none today. Optional first-run hint or empty-states that teach.
4. **Reconcile the tool inventory** — the launcher, hub, and route table currently disagree on the
   list/order of tools; the redesign should present one canonical, intentional ordering.
5. **A "present across the room" affordance** — many draw decks would benefit from an explicit
   "big screen" toggle (some have it, most don't).
6. **Primary-nav set** — are Wheel/Scene/Warmup/Facts still the right 5 anchors, or should usage-
   driven favorites surface here?
7. **Reading-distance system** — a deliberate type scale that scales from "arm's length config" to
   "readable across a black box."

---

## 9. What we'd love back

- A **visual language** (type, color, spacing, elevation, motion, iconography) grounded in the
  product personality (§10) but entirely your invention.
- The **shared primitives** from §6 designed as components.
- **Key screens** designed end-to-end: the Launcher, the redesigned More hub, one Draw Stage tool,
  a filterable library (Warmup or Formats), a run-the-room tool with fullscreen show mode (Timer or
  Jam), and the Deconstruction notebook (the complex one).
- **States** for each: idle / configured / result / empty / done / fullscreen as applicable.
- Light **EN + PL** treatment proof (longest-string stress test).
- A responsive note for tablet/desktop (nice-to-have).

---

## 10. Voice & personality (true — but express it however you like)

The product's personality is **playful, generous, and confident — a witty stage-manager friend,
not a corporate utility.** Warm, direct, encouraging. Premium and tactile while staying joyful:
**craft over cuteness.** You are free to express this in any visual direction.

**Guardrails (what it must NOT feel like):**
- Generic "AI app" template — identical feature-card grids, gradient text, glass-everything,
  uppercase eyebrow labels on every section, stock icons.
- Childish / toy — rainbow confetti, cartoon bounce, Comic-Sans energy.
- Cold productivity SaaS — gray-on-gray dashboards, dense tables, navy-gradient hero.

These are guardrails, not a style — the actual look is yours to define from scratch.
