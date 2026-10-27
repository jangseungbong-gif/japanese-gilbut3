export interface UserProgress {
  // item id -> [check1, check2, check3] for the 3-times speech practice
  speechChecks: Record<string, [boolean, boolean, boolean]>;
  bookmarked: string[];
  quizHighScore: number;
  totalQuizzesTaken: number;
  speechSpeed: number; // 0.8, 1.0, 1.2
}

const STORAGE_KEY = 'nihongo_master_progress_v1';

export const defaultProgress: UserProgress = {
  speechChecks: {},
  bookmarked: [],
  quizHighScore: 0,
  totalQuizzesTaken: 0,
  speechSpeed: 1.0,
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return { ...defaultProgress, ...parsed };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}
