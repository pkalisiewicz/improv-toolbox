// ─── Archetype Wheel ─────────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  nameKey: string;
  descriptionKey: string;
  color: string;
}

export interface AssignedResult {
  playerNumber: number;
  archetype: Archetype;
}

export type WheelPhase = 'setup' | 'spinning' | 'reveal' | 'done';

// ─── Scene Preset ─────────────────────────────────────────────────────────────

export type SceneCategory =
  | 'romantic'
  | 'comedy'
  | 'drama'
  | 'thriller'
  | 'absurd'
  | 'historical';

export interface SceneElement {
  id: string;
  textKey: string;
  category: SceneCategory[];
}

export interface ScenePreset {
  location: SceneElement;
  relationship: SceneElement;
  situation: SceneElement;
  mood: SceneElement;
  timePeriod: SceneElement;
}

// ─── Warmup Games ─────────────────────────────────────────────────────────────

export type WarmupCategory =
  | 'physical'
  | 'vocal'
  | 'focus'
  | 'ensemble'
  | 'storytelling'
  | 'character';

export type WarmupLevel = 'beginner' | 'intermediate' | 'advanced';

export interface WarmupGame {
  id: string;
  nameKey: string;
  descriptionKey: string;
  minPlayers: number;
  maxPlayers: number | null;
  durationMinutes: number;
  category: WarmupCategory;
  level: WarmupLevel;
  tipsKey?: string;
}

// ─── Improv Facts ─────────────────────────────────────────────────────────────

export type FactCategory = 'history' | 'technique' | 'tips' | 'famous';

export interface ImprovFact {
  id: string;
  textKey: string;
  category: FactCategory;
  sourceKey?: string;
}

// ─── Character Builder ────────────────────────────────────────────────────────

export interface CharacterTrait {
  id: string;
  textKey: string;
}

// ─── Prompt Cards ─────────────────────────────────────────────────────────────

export type PromptCategory =
  | 'first_line'
  | 'occupation'
  | 'location'
  | 'what_not_to_say'
  | 'title';

export interface PromptCard {
  id: string;
  textKey: string;
  category: PromptCategory;
}

// ─── Audience Suggestions ─────────────────────────────────────────────────────

export type SuggestionCategory =
  | 'location'
  | 'occupation'
  | 'relationship'
  | 'emotion'
  | 'movie_title'
  | 'word';

export interface Suggestion {
  id: string;
  textKey: string;
  category: SuggestionCategory;
}

// ─── Improv Formats ───────────────────────────────────────────────────────────

export type FormatDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ImprovFormat {
  id: string;
  nameKey: string;
  descriptionKey: string;
  rulesKey: string;
  minPlayers: number;
  maxPlayers: number | null;
  durationMinutes: number;
  difficulty: FormatDifficulty;
  suggestionType: string;
}

export type PlanItemType = 'warmup' | 'scene' | 'exercise' | 'break';

export interface PlanItem {
  id: string;
  type: PlanItemType;
  name: string;
  duration: number;
  warmupId?: string;
}

// ─── Reflection Prompts ───────────────────────────────────────────────────────

export type ReflectionCategory = 'game' | 'crow' | 'ensemble' | 'edit' | 'character';

export interface ReflectionPrompt {
  id: string;
  textKey: string;
  category: ReflectionCategory;
}

// ─── Improv Principles ────────────────────────────────────────────────────────

export type PrincipleCategory = 'foundation' | 'character' | 'status' | 'editing' | 'ensemble' | 'stagecraft';

export interface ImprovPrinciple {
  id: string;
  nameKey: string;
  textKey: string;
  exampleKey?: string;
  category: PrincipleCategory;
}

// ─── Monologue Seeds ──────────────────────────────────────────────────────────

export type MonologueCategory = 'embarrassment' | 'surprise' | 'pride' | 'fear' | 'childhood' | 'work' | 'relationships';

export interface MonologueSeed {
  id: string;
  textKey: string;
  category: MonologueCategory;
}

// ─── Genre Style Cards ────────────────────────────────────────────────────────

export interface GenreCard {
  id: string;
  nameKey: string;
  tipKeys: string[];
}

// ─── Emotion Wheel ────────────────────────────────────────────────────────────

export type EmotionFamily = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust';

export interface Emotion {
  id: string;
  textKey: string;
  family: EmotionFamily;
}

// ─── Scene Constraints ────────────────────────────────────────────────────────

export type ConstraintCategory = 'speech' | 'physical' | 'structural' | 'relational';

export interface SceneConstraint {
  id: string;
  textKey: string;
  category: ConstraintCategory;
}

// ─── Game Modifiers ───────────────────────────────────────────────────────────

export type ModifierCategory = 'restriction' | 'role' | 'format' | 'constraint';

export interface GameModifier {
  id: string;
  textKey: string;
  category: ModifierCategory;
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

export type GlossaryCategory = 'foundation' | 'longform' | 'editing' | 'stagecraft';

export interface GlossaryTerm {
  id: string;
  termKey: string;
  definitionKey: string;
  category: GlossaryCategory;
}

// ─── Scene Replay Cards ───────────────────────────────────────────────────────

export type ReplayCategory = 'physicality' | 'genre' | 'emotional' | 'structural' | 'character';

export interface ReplayCard {
  id: string;
  textKey: string;
  category: ReplayCategory;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type TabId = 'splash' | 'wheel' | 'scene' | 'warmup' | 'facts';

// ─── Deconstruction ──────────────────────────────────────────────────────────

export type DeconstructionPhaseId =
  | 'opening'
  | 'thematic1'
  | 'thematic2'
  | 'return1'
  | 'commentary1'
  | 'commentary2'
  | 'commentary3'
  | 'commentary4'
  | 'commentary5'
  | 'theRun'
  | 'finale';

export interface DeconstructionPhase {
  id: DeconstructionPhaseId;
  labelKey: string;
  tipKey: string;
  group: 1 | 2 | 3 | 4 | 5 | 6;
  type: 'narrative' | 'deconstruct';
}

export type NoteCategory = 'character' | 'scene' | 'theme' | 'callback' | 'game_move' | 'misc';

export interface DeconstructionNote {
  id: string;
  category: NoteCategory;
  text: string;
  phaseId?: DeconstructionPhaseId;
  timestamp: number;
}

export interface DeconstructionSession {
  id: string;
  suggestion: string;
  characters: [string, string];
  notes: DeconstructionNote[];
  completedPhaseIds: DeconstructionPhaseId[];
  createdAt: number;
  updatedAt: number;
}
