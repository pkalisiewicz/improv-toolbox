/**
 * Improv Toolbox — custom icon family.
 *
 * Rounded-line style: 24×24 grid, 2px rounded strokes, `currentColor`.
 * One glyph per feature + the shared UI/control set. See createIcon for the
 * shared SVG wrapper. Solid accents (dots, hubs) opt in with fill="currentColor".
 */
import { createIcon } from './createIcon';

/* ── Feature glyphs ──────────────────────────────────────────────────────── */

// Main / launcher — stage portal with the brand pip
export const IconMain = createIcon('IconMain', (
  <>
    <path d="M4 20V8.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V20" />
    <path d="M8 20v-7.5a4 4 0 0 1 8 0V20" />
    <path d="M3 20h18" />
    <circle cx="12" cy="10" r="1.25" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Archetype wheel — segmented disc + pointer
export const IconWheel = createIcon('IconWheel', (
  <>
    <path d="M12 3.2 9.7 6.2h4.6z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 6v15M4.5 13.5h15M6.7 8.2l10.6 10.6M17.3 8.2 6.7 18.8" />
    <circle cx="12" cy="13.5" r="1.5" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Scene generator — stage with curtains
export const IconScene = createIcon('IconScene', (
  <>
    <path d="M3 4h18" />
    <path d="M5.5 4v12c2.2 0 3.3-1.4 3.3-4.5V4" />
    <path d="M18.5 4v12c-2.2 0-3.3-1.4-3.3-4.5V4" />
    <circle cx="12" cy="11" r="1.3" fill="var(--icon-accent)" stroke="none" />
    <path d="M3 20h18" />
  </>
));

// Warmups — star-jump figure
export const IconWarmup = createIcon('IconWarmup', (
  <>
    <circle cx="12" cy="5" r="2.2" />
    <path d="M12 7.5v6M12 9.5 7.8 8M12 9.5 16.2 8M12 13.5 9 19.5M12 13.5 15 19.5" />
    <circle cx="12" cy="10.5" r="1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Facts / glossary — open book
export const IconFacts = createIcon('IconFacts', (
  <>
    <path d="M12 6.5v13" />
    <path d="M12 6.5C10 5 7 4.6 4 5.2v12.6c3-.6 6-.2 8 1.3 2-1.5 5-1.9 8-1.3V5.2C17 4.6 14 5 12 6.5z" />
    <circle cx="12" cy="9.5" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// More hub — toolbox
export const IconMore = createIcon('IconMore', (
  <>
    <rect x="3" y="8" width="18" height="11.5" rx="2.2" />
    <path d="M3 13.2h18" />
    <path d="M9 8V6.2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V8" />
    <path d="M10 13.2v1.8M14 13.2v1.8" />
    <circle cx="12" cy="11" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Timer — stopwatch
export const IconTimer = createIcon('IconTimer', (
  <>
    <circle cx="12" cy="14" r="7" />
    <path d="M12 14V9.6M12 14l2.8 1.8M9.5 3.2h5M12 3.2v3.4M18.6 8.2l1.4-1.4" />
    <circle cx="12" cy="14" r="1.3" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Character builder — theatre mask
export const IconCharacter = createIcon('IconCharacter', (
  <>
    <path d="M5.5 4.5c4.3-1.2 8.7-1.2 13 0 0 6.2-1.4 11.4-6.5 14C6.9 15.9 5.5 10.7 5.5 4.5z" />
    <path d="M9.4 9h.01M14.6 9h.01" />
    <path d="M9.6 13c1.5 1.1 3.3 1.1 4.8 0" />
    <circle cx="12" cy="7" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Prompt cards — card with a star
export const IconPrompts = createIcon('IconPrompts', (
  <>
    <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
    <path d="M12 7.5l1.3 2.7 2.9.4-2.1 2 .5 2.9L12 16.1 9.5 17.5l.5-2.9-2.1-2 2.9-.4z" />
    <circle cx="12" cy="12" r="0.95" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Audience suggestions — die (five pips)
export const IconSuggestions = createIcon('IconSuggestions', (
  <>
    <rect x="4" y="4" width="16" height="16" rx="3.2" />
    <circle cx="8.8" cy="8.8" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="8.8" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.05" fill="var(--icon-accent)" stroke="none" />
    <circle cx="8.8" cy="15.2" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="15.2" r="1.05" fill="currentColor" stroke="none" />
  </>
));

// Format library — closed book with spine
export const IconFormats = createIcon('IconFormats', (
  <>
    <path d="M6.5 3.5H17a1.5 1.5 0 0 1 1.5 1.5v15H8a1.5 1.5 0 0 1-1.5-1.5z" />
    <path d="M6.5 17h12M10 3.5v13.5" />
    <circle cx="10" cy="6.5" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Reflection — thought bubble
export const IconReflection = createIcon('IconReflection', (
  <>
    <path d="M16.5 13.5a4.5 4.5 0 1 0-8.4-2.2A3.6 3.6 0 0 0 8 18.5h8a3 3 0 0 0 .5-5z" />
    <circle cx="6" cy="20.5" r="1.3" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Soundscape — speaker with waves
export const IconSoundscape = createIcon('IconSoundscape', (
  <>
    <path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5z" />
    <path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a8 8 0 0 1 0 10" />
    <circle cx="7" cy="12" r="1.05" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Status randomizer — ascending bars
export const IconStatus = createIcon('IconStatus', (
  <>
    <path d="M3 20h18" />
    <path d="M5.5 20v-5.5M10.5 20v-9M15.5 20v-6.5M20 20V8" />
    <circle cx="20" cy="6.4" r="1.2" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Story spine — connected story beats
export const IconSpine = createIcon('IconSpine', (
  <>
    <path d="M4 18.5 9 12l4 3 7-9" />
    <circle cx="4" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="13" cy="15" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="20" cy="6" r="1.6" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Jam caller — circus tent
export const IconJam = createIcon('IconJam', (
  <>
    <path d="M12 3v3" />
    <circle cx="12" cy="3" r="1.2" fill="var(--icon-accent)" stroke="none" />
    <path d="M12 6C6.8 6 3.8 10.2 3 14h18c-.8-3.8-3.8-8-9-8z" />
    <path d="M3 14v5.5h18V14M12 6v13.5M8 19.5l4-5.5 4 5.5" />
  </>
));

// Principles — lightbulb
export const IconPrinciples = createIcon('IconPrinciples', (
  <>
    <path d="M12 3a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.4 1.3 2.4h5c0-1 .5-1.7 1.3-2.4A6 6 0 0 0 12 3z" />
    <path d="M9.5 19h5M10.5 21.5h3" />
    <circle cx="12" cy="9.5" r="1.2" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Monologue — microphone
export const IconMonologue = createIcon('IconMonologue', (
  <>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    <circle cx="12" cy="6.5" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Genres — film clapper
export const IconGenres = createIcon('IconGenres', (
  <>
    <path d="M3.5 9.2 4.6 5l16.4 1.3-.6 3z" />
    <path d="M8.2 5.4 6.6 8.9M13 5.8l-1.6 3.5M17.6 6.2 16 9.7" />
    <rect x="3.5" y="9.2" width="17" height="9.8" rx="1.8" />
    <circle cx="6.5" cy="14" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Harold beat caller — target
export const IconHarold = createIcon('IconHarold', (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.5" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Emotion wheel — heart
export const IconEmotion = createIcon('IconEmotion', (
  <>
    <path d="M12 20.5C4.5 16 4 10.8 4 8.8a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 2-.5 7.2-8 11.7z" />
    <circle cx="12" cy="10.5" r="1.15" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Scene constraints — prohibition sign
export const IconConstraints = createIcon('IconConstraints', (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M6 6 18 18" />
  </>
));

// Metronome
export const IconMetronome = createIcon('IconMetronome', (
  <>
    <path d="M9 4h6l3 16H6z" />
    <path d="M6.6 15h10.8" />
    <path d="M12 18 16 6.5" />
    <circle cx="13.6" cy="12" r="1.15" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Game variants — puzzle piece
export const IconVariants = createIcon('IconVariants', (
  <>
    <path d="M10 4.5a2 2 0 0 1 4 0V6h2.4a1 1 0 0 1 1 1v2.6H16a2 2 0 1 0 0 4h1.4V17a1 1 0 0 1-1 1H14v-1.5a2 2 0 1 0-4 0V18H6.6a1 1 0 0 1-1-1v-3.4H7a2 2 0 1 0 0-4H5.6V7a1 1 0 0 1 1-1H10z" />
    <circle cx="11.5" cy="11.3" r="1.1" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Replay — loop arrows
export const IconReplay = createIcon('IconReplay', (
  <>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
    <path d="M20 4v4.5h-4.5" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
    <path d="M4 20v-4.5h4.5" />
    <circle cx="12" cy="12" r="1.2" fill="var(--icon-accent)" stroke="none" />
  </>
));

// Deconstruction — magnifier with plus (examine)
export const IconDeconstruction = createIcon('IconDeconstruction', (
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.2 15.2 20 20" />
    <path d="M8 10.5h5M10.5 8v5" />
    <circle cx="10.5" cy="10.5" r="0.95" fill="var(--icon-accent)" stroke="none" />
  </>
));

/* ── UI / control glyphs ─────────────────────────────────────────────────── */

export const IconRefresh = createIcon('IconRefresh', (
  <path d="M20 11.5A8 8 0 1 0 18 17M20 5v6h-6" />
));

export const IconShuffle = createIcon('IconShuffle', (
  <>
    <path d="M17 4.5 20.5 8 17 11.5M17 12.5 20.5 16 17 19.5" />
    <path d="M3.5 7.5h3.2l4 6h5.8M3.5 16.5h3.2l2.4-3.6M13.5 10.4l1.5-2.9h2.7" />
  </>
));

export const IconArrowLeft = createIcon('IconArrowLeft', (
  <path d="M19 12H5M12 19l-7-7 7-7" />
));

export const IconArrowRight = createIcon('IconArrowRight', (
  <path d="M5 12h14M12 5l7 7-7 7" />
));

export const IconChevronLeft = createIcon('IconChevronLeft', (
  <path d="M15 5.5 8.5 12 15 18.5" />
));

export const IconChevronRight = createIcon('IconChevronRight', (
  <path d="M9 5.5 15.5 12 9 18.5" />
));

export const IconChevronDown = createIcon('IconChevronDown', (
  <path d="M5.5 9 12 15.5 18.5 9" />
));

export const IconClose = createIcon('IconClose', (
  <path d="M6 6l12 12M18 6 6 18" />
));

export const IconPlus = createIcon('IconPlus', (
  <path d="M12 5v14M5 12h14" />
));

export const IconMinus = createIcon('IconMinus', (
  <path d="M5 12h14" />
));

export const IconCheck = createIcon('IconCheck', (
  <path d="M5 13l4 4 10-11" />
));

export const IconPlay = createIcon('IconPlay', (
  <path d="M7 5.2c0-.8.9-1.3 1.6-.9l10 6.8c.6.4.6 1.4 0 1.8l-10 6.8c-.7.4-1.6-.1-1.6-.9z" />
));

export const IconPause = createIcon('IconPause', (
  <path d="M9 4.5v15M15 4.5v15" />
));

export const IconDownload = createIcon('IconDownload', (
  <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 20h14" />
));

export const IconSun = createIcon('IconSun', (
  <>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
  </>
));

export const IconMoon = createIcon('IconMoon', (
  <path d="M19.5 14.6A7.7 7.7 0 0 1 9.4 4.5 8.2 8.2 0 1 0 19.5 14.6z" />
));

export const IconGlobe = createIcon('IconGlobe', (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </>
));

export const IconSparkles = createIcon('IconSparkles', (
  <>
    <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4z" />
    <path d="M18.5 15l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
  </>
));

export const IconHeart = createIcon('IconHeart', (
  <path d="M12 20.5C4.5 16 4 10.8 4 8.8a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 2-.5 7.2-8 11.7z" />
));

export const IconHeartFilled = createIcon('IconHeartFilled', (
  <path
    d="M12 20.5C4.5 16 4 10.8 4 8.8a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 2-.5 7.2-8 11.7z"
    fill="currentColor"
  />
));

export const IconEye = createIcon('IconEye', (
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.6" />
  </>
));

export const IconEyeOff = createIcon('IconEyeOff', (
  <>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.2A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.4 16.4 0 0 1-3.4 4M6.3 8.2A16.3 16.3 0 0 0 2.5 12S6 18.5 12 18.5a9.6 9.6 0 0 0 3.3-.6" />
    <path d="M9.6 11.1a2.6 2.6 0 0 0 3.4 3.4" />
  </>
));

export const IconVolume = createIcon('IconVolume', (
  <>
    <path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5z" />
    <path d="M15.5 9.5a4 4 0 0 1 0 5" />
  </>
));

export const IconCoffee = createIcon('IconCoffee', (
  <>
    <path d="M5 8.5h12v4a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" />
    <path d="M17 9.5h2a2 2 0 0 1 0 4h-2" />
    <path d="M6.5 3.5v2M9.5 3.5v2M12.5 3.5v2M4 20.5h14" />
  </>
));

// Fullscreen / expand — corner brackets
export const IconExpand = createIcon('IconExpand', (
  <>
    <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9" />
    <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9" />
    <path d="M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15" />
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15" />
  </>
));

// Loop — repeat arrows
export const IconLoop = createIcon('IconLoop', (
  <>
    <path d="M4 9V8a3 3 0 0 1 3-3h10l-2.5-2.5M14.5 5 17 7.5" />
    <path d="M20 15v1a3 3 0 0 1-3 3H7l2.5 2.5M9.5 19 7 16.5" />
  </>
));

// Skip back 10s — rewind arrow
export const IconSkipBack = createIcon('IconSkipBack', (
  <>
    <path d="M5 12a7 7 0 1 0 2.1-5L4 9.5" />
    <path d="M4 4v5.5h5.5" />
  </>
));

// Skip forward 10s — fast-forward arrow
export const IconSkipForward = createIcon('IconSkipForward', (
  <>
    <path d="M19 12a7 7 0 1 1-2.1-5L20 9.5" />
    <path d="M20 4v5.5h-5.5" />
  </>
));

// Tap tempo — pointing hand / tap
export const IconTap = createIcon('IconTap', (
  <>
    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10" />
    <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M15 11v-.5a1.5 1.5 0 0 1 3 0V15a5 5 0 0 1-5 5h-1.5a4 4 0 0 1-3-1.3L6 16.2a1.6 1.6 0 0 1 2.3-2.2L9.5 15" />
  </>
));

// Stop — square
export const IconStop = createIcon('IconStop', (
  <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
));

/* ── Ambient / soundscape glyphs ─────────────────────────────────────────── */

// Rain — cloud with falling drops
export const IconRain = createIcon('IconRain', (
  <>
    <path d="M7 14a4 4 0 0 1-.5-7.96 5 5 0 0 1 9.5-1.04A3.5 3.5 0 0 1 16.5 14H7z" />
    <path d="M8 17.5 7 20M12 17.5 11 20M16 17.5 15 20" />
  </>
));

// City — skyline of buildings on a baseline
export const IconCity = createIcon('IconCity', (
  <>
    <path d="M3 21h18" />
    <path d="M5 21V9h4v12" />
    <path d="M11 21V4h4v17" />
    <path d="M17 21v-7h2v7" />
    <path d="M6.5 12.5h1M6.5 16h1M12.5 8h1M12.5 12h1M12.5 16h1" />
  </>
));

// Forest — layered pine tree
export const IconForest = createIcon('IconForest', (
  <>
    <path d="M12 3 7.5 10h9z" />
    <path d="M12 8 6 16h12z" />
    <path d="M12 16v5M9.5 21h5" />
  </>
));

// Storm — cloud with a lightning bolt
export const IconStorm = createIcon('IconStorm', (
  <>
    <path d="M7 13a4 4 0 0 1-.5-7.96 5 5 0 0 1 9.5-1.04A3.5 3.5 0 0 1 16.5 13H7z" />
    <path d="M12.5 13 9.5 18h3l-1.5 4" />
  </>
));

// Fireplace — flame
export const IconFireplace = createIcon('IconFireplace', (
  <path d="M12 3c3.5 3 5 6 5 9a5 5 0 0 1-10 0c0-1.9.8-3.4 2-4.5.2 1.3 1 2.2 2 2.6C12.3 8 11 5.5 12 3z" />
));

// Ocean — rolling waves
export const IconOcean = createIcon('IconOcean', (
  <>
    <path d="M3 8q3 3 6 0t6 0 6 0" />
    <path d="M3 13q3 3 6 0t6 0 6 0" />
    <path d="M3 18q3 3 6 0t6 0 6 0" />
  </>
));

// Elevator — up/down indicator
export const IconElevator = createIcon('IconElevator', (
  <>
    <path d="M12 4v16" />
    <path d="M8 8.5 12 4l4 4.5" />
    <path d="M8 15.5 12 20l4-4.5" />
  </>
));

/* ── Content / meta glyphs ───────────────────────────────────────────────── */

// Location — map pin
export const IconLocation = createIcon('IconLocation', (
  <>
    <path d="M12 21c4-4.6 6-7.9 6-11a6 6 0 1 0-12 0c0 3.1 2 6.4 6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </>
));

// Users — two people (relationship / player count)
export const IconUsers = createIcon('IconUsers', (
  <>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.3a3 3 0 0 1 0 5.4" />
    <path d="M15.5 13.7A5.5 5.5 0 0 1 20.5 19" />
  </>
));

// Bolt — situation spark
export const IconBolt = createIcon('IconBolt', (
  <path d="M13 3 5 13h6l-1 8 8-10h-6z" />
));

// Briefcase — occupation
export const IconBriefcase = createIcon('IconBriefcase', (
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </>
));

// Target — want / goal
export const IconTarget = createIcon('IconTarget', (
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </>
));

// Speech — dialogue bubble
export const IconSpeech = createIcon('IconSpeech', (
  <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5L5 20.5V16H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
));
