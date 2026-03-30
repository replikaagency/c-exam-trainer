// ============================================================
// TIPOS PRINCIPALES
// ============================================================

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type BlockId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ExerciseStatus = 'not_started' | 'attempted' | 'with_hints' | 'dominated';
export type SourceType = 'real' | 'generated';

export interface Block {
  id: BlockId;
  title: string;
  description: string;
  concepts: string[];
}

export interface HintLevel {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  content: string;
}

export interface Exercise {
  slug: string;
  title: string;
  blockId: BlockId;
  difficulty: Difficulty;
  sourceType: SourceType;
  sourceRef?: string; // ej. "PR4/TanquePR"
  concepts: string[];
  pattern: string; // patrón mental en una frase
  patternSteps: string[]; // pasos del patrón
  commonMistakes: string[];
  statement: string;
  inputSpec: string;
  outputSpec: string;
  exampleInput: string;
  exampleOutput: string;
  pseudocode: string;
  solutionCode: string;
  hints: HintLevel[];
  estimatedMinutes: number;
  tags: string[];
}

// ============================================================
// PROGRESO DEL USUARIO (localStorage)
// ============================================================

export interface ExerciseAttempt {
  timestamp: string;
  hintsUsed: number;
  solutionViewed: boolean;
  attemptText: string;
  timeSpentSeconds: number;
}

export interface ExerciseProgress {
  slug: string;
  status: ExerciseStatus;
  hintsUsed: number; // máximo de pistas pedidas (0-5)
  solutionViewed: boolean;
  attempts: ExerciseAttempt[];
  lastAttemptDate: string | null;
  totalTimeSeconds: number;
  dominated: boolean; // resuelto sin ver solución y con ≤ 2 pistas
}

export interface WeaknessSignal {
  concept: string;
  blockId: BlockId;
  signalCount: number;
  lastDetected: string;
}

export interface SimulacroSession {
  id: string;
  date: string;
  exerciseSlugs: string[];
  mode: 'normal' | 'strict';
  timeLimitSeconds: number;
  timeUsedSeconds: number;
  results: SimulacroResult[];
  completed: boolean;
}

export interface SimulacroResult {
  slug: string;
  hintsUsed: number;
  solutionViewed: boolean;
  attemptText: string;
  selfScore: 0 | 1 | 2 | 3; // 0=no intentado, 1=no logré, 2=con ayuda, 3=logré
}

export interface UserProgress {
  exerciseProgress: Record<string, ExerciseProgress>;
  simulacroHistory: SimulacroSession[];
  weaknessSignals: WeaknessSignal[];
  studyDays: string[]; // ISO date strings
  lastActivity: string | null;
  dailyChallengeDate: string | null;
  dailyChallengeSlug: string | null;
}

// ============================================================
// ESTADÍSTICAS DERIVADAS
// ============================================================

export interface ProgressStats {
  total: number;
  notStarted: number;
  attempted: number;
  withHints: number;
  dominated: number;
  solutionViewed: number;
  byBlock: Record<BlockId, BlockStats>;
  streak: number;
  weakConcepts: string[];
}

export interface BlockStats {
  blockId: BlockId;
  total: number;
  dominated: number;
  attempted: number;
  withHints: number;
  notStarted: number;
  completionPercent: number;
}
