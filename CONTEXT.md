# Improv Toolbox

A bilingual (Polish/English) PWA of randomizers and reference tools for improv performers and coaches. This glossary captures the domain language; it is not a spec.

## Scene generator

**Element**:
A single drawable item in one dimension of a scene — one Location, Relationship, Situation, Mood, or Time Period. Modelled as `SceneElement` (`id`, `textKey`, `category[]`).
_Avoid_: card, option, item, value

**Dimension**:
One of the five axes a scene is drawn from: Location, Relationship, Situation, Mood, Time Period. Each Dimension has its own Pool.
_Avoid_: field, slot, type

**Pool**:
The full set of candidate Elements for one Dimension (e.g. all Locations). Filtered by Genre before drawing.
_Avoid_: list, array, bank

**Scene**:
The full 5-Element draw shown to the user — one Element per Dimension. Modelled as `ScenePreset`. The combined Scene is astronomically unlikely to repeat; the felt repetition is at the Element level.
_Avoid_: preset, combo, result

**Genre**:
A flavour tag on each Element (`comedy`, `drama`, `romantic`, `thriller`, `absurd`, `historical`) plus the `all` filter. An Element may carry several Genres. Selecting a Genre pre-filters every Pool.
_Avoid_: category, tag, style

**Draw**:
A single act of picking — either one Element (per-Dimension reroll) or a whole new Scene (regenerate all).
_Avoid_: roll, spin, generate, shuffle

## Discovery surface

**Tool**:
An interactive randomizer surface — one of the routes a performer reaches for in the moment to draw, read, and put the phone down (Wheel, Scene generator, Warmup, etc.). Serves the *in-session* job. Distinct from an Entry.
_Avoid_: page, widget, feature

**Entry**:
A single canonical, indexable page *about* one named item — one Warmup game, Format, or Principle — carrying enough unique text to deserve a search ranking. Serves the *discovery* job (a stranger arriving from a search engine), not the in-session job. One stable URL per Entry per language.
_Avoid_: page, card, article, post

**Aggregate Entry**:
One dense Entry covering a whole Pool of thin items that don't each merit an Entry (e.g. all Scene Locations on one page, all Emotions on one page). Keeps thin content out of the index while still capturing the topic. May later be split into per-item Entries where search demand justifies it.
_Avoid_: list page, category page, index

## Distribution

The same Tools reach users through two distributions that differ in how they handle language. Do not conflate them — "the app" and "the website" are now distinct things.

**Site**:
The web distribution. Each language is its own build on its own domain (English on `improv-toolbox.com`, Polish on `skrzynka-improwizatora.pl`). A Site is monolingual; choosing the other language means moving to the other Site. Serves the discovery job — indexable Entries, one stable URL per page per language.
_Avoid_: web, PWA, page

**App**:
The native distribution — one installable binary on the App Store and Google Play. Unlike a Site, a single App carries **both** languages at once: it opens in the device's language and offers an in-app Language switch. There is one App per store, not one App per language. Serves the in-session job in the room.
_Avoid_: wrapper, build, binary

**Language**:
The chosen language of the surface. On a Site, Language is fixed at build time and switched by moving between Sites. In the App, Language is chosen at runtime — seeded from the device, changeable in-app, and remembered.
_Avoid_: locale, translation, i18n
