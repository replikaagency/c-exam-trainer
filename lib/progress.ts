import { ExerciseStatus } from './types';

const STORAGE_KEY = 'c-exam-progress';

export type Understanding = 'good' | 'medium' | 'bad';

export interface ExerciseProgressData {
  status: ExerciseStatus;
  hintsRevealed: number;
  solutionViewed: boolean;
  pseudocodeViewed: boolean;
  lastAttempt: string;
  attemptText: string;
  timeSpentSeconds: number;
  understanding?: Understanding;
}

export type ProgressMap = Record<string, ExerciseProgressData>;

function getAll(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: ProgressMap) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress(slug: string): ExerciseProgressData | null {
  const all = getAll();
  return all[slug] ?? null;
}

export function getAllProgress(): ProgressMap {
  return getAll();
}

export function updateProgress(slug: string, updates: Partial<ExerciseProgressData>) {
  const all = getAll();
  const current = all[slug] ?? {
    status: 'not_started' as ExerciseStatus,
    hintsRevealed: 0,
    solutionViewed: false,
    pseudocodeViewed: false,
    lastAttempt: '',
    attemptText: '',
    timeSpentSeconds: 0,
  };

  const updated = { ...current, ...updates };

  // Only derive status if we're not just updating understanding
  const isOnlyUnderstanding = Object.keys(updates).every(k => k === 'understanding' || k === 'lastAttempt');
  if (!isOnlyUnderstanding) {
    if (updates.status === 'dominated') {
      updated.status = 'dominated';
    } else if (updated.status !== 'dominated') {
      if (updated.solutionViewed || updated.hintsRevealed > 0) {
        updated.status = 'with_hints';
      } else if (updated.attemptText && updated.attemptText.trim().length > 0 && updated.status === 'not_started') {
        updated.status = 'attempted';
      }
    }
  }

  all[slug] = updated;
  saveAll(all);
  return updated;
}

export function getBlockProgress(blockId: number, slugs: string[]): {
  total: number;
  notStarted: number;
  attempted: number;
  withHints: number;
  dominated: number;
} {
  const all = getAll();
  const result = { total: slugs.length, notStarted: 0, attempted: 0, withHints: 0, dominated: 0 };

  for (const slug of slugs) {
    const p = all[slug];
    if (!p || p.status === 'not_started') result.notStarted++;
    else if (p.status === 'attempted') result.attempted++;
    else if (p.status === 'with_hints') result.withHints++;
    else if (p.status === 'dominated') result.dominated++;
  }

  return result;
}

export function getWeakBlocks(blockSlugs: Record<number, string[]>): number[] {
  const all = getAll();
  const weak: number[] = [];
  for (const [blockIdStr, slugs] of Object.entries(blockSlugs)) {
    const blockId = Number(blockIdStr);
    let badOrMedium = 0;
    let rated = 0;
    for (const slug of slugs) {
      const p = all[slug];
      if (p?.understanding) {
        rated++;
        if (p.understanding === 'bad' || p.understanding === 'medium') badOrMedium++;
      }
    }
    if (rated >= 2 && badOrMedium / rated >= 0.5) {
      weak.push(blockId);
    }
  }
  return weak;
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
