import type { AttemptEvent, GameResult, LevelDefinition, MasteryRecord, ProgressRecord, QuestwoodState } from './types';

export const MASTERY_TARGET = 80;

/** A completed lesson earns a dependable learning reward plus accuracy and calm-speed bonuses. */
export function starsForResult(result: GameResult): number {
  if (result.accuracy < 0.6) return 0;
  const speedBonus = result.durationSeconds <= 120 ? 2 : result.durationSeconds <= 240 ? 1 : 0;
  return 5 + Math.round(result.accuracy * 3) + speedBonus;
}

export function masteryAfter(previous: MasteryRecord | undefined, result: GameResult, now: string): MasteryRecord {
  const base = previous?.score ?? 0;
  const firstTryBonus = result.attempts === 1 ? 8 : 0;
  const hintAdjustment = Math.min(10, result.hintsUsed * 3);
  const evidenceAdjustment = Math.round(result.accuracy * 52) + firstTryBonus - hintAdjustment;
  const score = Math.max(0, Math.min(100, Math.round(base * 0.62 + evidenceAdjustment)));
  return { skillId: previous?.skillId ?? '', score, evidence: (previous?.evidence ?? 0) + 1, updatedAt: now };
}

export function levelState(level: LevelDefinition, state: QuestwoodState): ProgressRecord['state'] {
  const saved = state.progress[level.id]?.state;
  if (saved === 'complete') return 'complete';
  // Every level in a learner's current grade stays playable. Mastery guides
  // recommendations; it never permanently blocks a game from exploration.
  return 'available';
}

/** The first completed mini-lesson earns one learning star; reopening it does not duplicate the reward. */
export function markLessonLearned(state: QuestwoodState, level: LevelDefinition): QuestwoodState {
  const saved = state.progress[level.id];
  if (saved?.learned) return state;
  const now = new Date().toISOString();
  return {
    ...state,
    profile: { ...state.profile, stars: state.profile.stars + 1 },
    progress: { ...state.progress, [level.id]: { levelId: level.id, state: saved?.state ?? 'review', learned: true, updatedAt: now } },
  };
}

export function commitAttempt(state: QuestwoodState, level: LevelDefinition, result: GameResult, eventId: string): QuestwoodState {
  if (state.attempts.some((attempt) => attempt.id === eventId)) return state;
  const now = new Date().toISOString();
  const previous = state.mastery[level.skillId];
  const nextMastery = masteryAfter(previous, result, now);
  nextMastery.skillId = level.skillId;
  const attempt: AttemptEvent = {
    id: eventId, learnerId: state.profile.id, levelId: level.id, skillId: level.skillId, gameType: level.gameType,
    accuracy: result.accuracy, attempts: result.attempts, hintsUsed: result.hintsUsed, durationSeconds: result.durationSeconds,
    createdAt: now, contentVersion: '1.0.0',
  };
  const completed = result.accuracy >= 0.6;
  const earnedStars = completed ? starsForResult(result) : 0;
  return {
    ...state,
    profile: { ...state.profile, stars: state.profile.stars + earnedStars },
    attempts: [...state.attempts, attempt],
    mastery: { ...state.mastery, [level.skillId]: nextMastery },
    progress: { ...state.progress, [level.id]: { levelId: level.id, state: completed ? 'complete' : 'review', learned: state.progress[level.id]?.learned, updatedAt: now } },
    completedToday: state.completedToday + (completed ? 1 : 0),
  };
}
