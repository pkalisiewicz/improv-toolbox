import type { DeconstructionPhase, NoteCategory } from '../types';

export const SESSIONS_STORAGE_KEY = 'deconstruction-sessions';
export const ACTIVE_SESSION_STORAGE_KEY = 'deconstruction-active-session';
export const DRAFT_STORAGE_KEY = 'deconstruction-draft';

export const DECONSTRUCTION_PHASES: DeconstructionPhase[] = [
  { id: 'opening',     labelKey: 'deconstruction.phases.opening',     tipKey: 'deconstruction.tips.opening',     group: 1, type: 'narrative' },
  { id: 'thematic1',   labelKey: 'deconstruction.phases.thematic1',   tipKey: 'deconstruction.tips.thematic',    group: 2, type: 'deconstruct' },
  { id: 'thematic2',   labelKey: 'deconstruction.phases.thematic2',   tipKey: 'deconstruction.tips.thematic',    group: 2, type: 'deconstruct' },
  { id: 'return1',     labelKey: 'deconstruction.phases.return1',     tipKey: 'deconstruction.tips.return1',     group: 3, type: 'narrative' },
  { id: 'commentary1', labelKey: 'deconstruction.phases.commentary1', tipKey: 'deconstruction.tips.commentary',  group: 4, type: 'deconstruct' },
  { id: 'commentary2', labelKey: 'deconstruction.phases.commentary2', tipKey: 'deconstruction.tips.commentary',  group: 4, type: 'deconstruct' },
  { id: 'commentary3', labelKey: 'deconstruction.phases.commentary3', tipKey: 'deconstruction.tips.commentary',  group: 4, type: 'deconstruct' },
  { id: 'commentary4', labelKey: 'deconstruction.phases.commentary4', tipKey: 'deconstruction.tips.commentary',  group: 4, type: 'deconstruct' },
  { id: 'commentary5', labelKey: 'deconstruction.phases.commentary5', tipKey: 'deconstruction.tips.commentary',  group: 4, type: 'deconstruct' },
  { id: 'theRun',      labelKey: 'deconstruction.phases.theRun',      tipKey: 'deconstruction.tips.theRun',      group: 5, type: 'narrative' },
  { id: 'finale',      labelKey: 'deconstruction.phases.finale',      tipKey: 'deconstruction.tips.finale',      group: 6, type: 'deconstruct' },
];

export interface NoteCategoryDef {
  id: NoteCategory;
  labelKey: string;
  bg: string;
  border: string;
  text: string;
  darkBg: string;
  darkText: string;
}

// Character is last — specific character buttons come first in the UI
export const NOTE_CATEGORIES: NoteCategoryDef[] = [
  { id: 'scene',      labelKey: 'deconstruction.noteCategories.scene',      bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     darkBg: 'bg-sky-500/15',     darkText: 'text-sky-50'      },
  { id: 'theme',      labelKey: 'deconstruction.noteCategories.theme',      bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   darkBg: 'bg-amber-500/15',   darkText: 'text-amber-50'    },
  { id: 'callback',   labelKey: 'deconstruction.noteCategories.callback',   bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', darkBg: 'bg-emerald-500/15', darkText: 'text-emerald-50'  },
  { id: 'game_move',  labelKey: 'deconstruction.noteCategories.gamemove',   bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  darkBg: 'bg-violet-500/15',  darkText: 'text-violet-50'   },
  { id: 'misc',       labelKey: 'deconstruction.noteCategories.misc',       bg: 'bg-surface-3',  border: 'border-line',        text: 'text-ink-muted',   darkBg: 'bg-white/10',       darkText: 'text-white'       },
  { id: 'character',  labelKey: 'deconstruction.noteCategories.character',  bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    darkBg: 'bg-rose-500/15',    darkText: 'text-rose-50'     },
];

export const CATEGORY_MAP = Object.fromEntries(NOTE_CATEGORIES.map((c) => [c.id, c])) as Record<NoteCategory, NoteCategoryDef>;

export const GROUP_LABELS: Record<number, string> = {
  1: 'deconstruction.groups.1',
  2: 'deconstruction.groups.2',
  3: 'deconstruction.groups.3',
  4: 'deconstruction.groups.4',
  5: 'deconstruction.groups.5',
  6: 'deconstruction.groups.6',
};
