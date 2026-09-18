import { describe, expect, it } from 'vitest';
import { GRADES, levelsFor, levelsForGrade, SUBJECTS } from '../content/catalog';
import { gradeWillBeComplete, nextGradeAfter } from './gradeProgression';
import { commitAttempt, levelState, markLessonLearned, MASTERY_TARGET } from './progression';
import type { QuestwoodState } from './types';

function state(): QuestwoodState {
  return {
    version: 1,
    profile: { id: 'learner-1', name: 'Avery', avatar: '🦉', selectedGrade: '2', stars: 0, createdAt: '2026-01-01T00:00:00Z' },
    attempts: [], mastery: {}, progress: {}, completedToday: 0,
  };
}

describe('progression', () => {
  it('provides a visible 40-lesson journey with ten-part practice for every grade', () => {
    for (const grade of GRADES) {
      expect(levelsForGrade(grade)).toHaveLength(40);
      for (const subject of Object.keys(SUBJECTS) as Array<keyof typeof SUBJECTS>) {
        const levels = levelsFor(grade, subject);
        expect(levels).toHaveLength(10);
        for (const level of levels) {
          const questions = level.config.questions as unknown[] | undefined;
          if (questions) expect(questions).toHaveLength(10);
        }
      }
    }
  });

  it('keeps every level available while secure mastery remains a separate goal', () => {
    const [first, second] = levelsFor('2', 'math');
    const updated = commitAttempt(state(), first, { accuracy: 1, attempts: 3, hintsUsed: 0, durationSeconds: 20 }, 'attempt-1');
    expect(updated.mastery[first.skillId].score).toBeGreaterThanOrEqual(50);
    expect(updated.mastery[first.skillId].score).toBeLessThan(MASTERY_TARGET);
    expect(levelState(second, updated)).toBe('available');
  });

  it('is idempotent when the same completion is delivered twice', () => {
    const [first] = levelsFor('2', 'science');
    const once = commitAttempt(state(), first, { accuracy: 1, attempts: 1, hintsUsed: 0, durationSeconds: 10 }, 'attempt-1');
    const twice = commitAttempt(once, first, { accuracy: 1, attempts: 1, hintsUsed: 0, durationSeconds: 10 }, 'attempt-1');
    expect(twice).toEqual(once);
    expect(twice.profile.stars).toBe(10);
  });

  it('keeps a future level playable before earlier evidence exists', () => {
    const [, second] = levelsFor('K', 'english');
    expect(levelState(second, state())).toBe('available');
  });

  it('awards one learning star only the first time a mini-lesson is started', () => {
    const [first] = levelsFor('2', 'english');
    const learned = markLessonLearned(state(), first);
    const reopened = markLessonLearned(learned, first);
    expect(learned.profile.stars).toBe(1);
    expect(reopened).toEqual(learned);
  });

  it('moves forward only after the last incomplete grade level is passed', () => {
    const levels = levelsFor('2', 'math');
    const current = state();
    for (const level of levels.slice(0, -1)) current.progress[level.id] = { levelId: level.id, state: 'complete', updatedAt: '2026-01-01T00:00:00Z' };
    expect(gradeWillBeComplete(current, levels.at(-1)!, 1)).toBe(false);
    for (const level of levelsFor('2', 'english').concat(levelsFor('2', 'science'), levelsFor('2', 'social'))) {
      current.progress[level.id] = { levelId: level.id, state: 'complete', updatedAt: '2026-01-01T00:00:00Z' };
    }
    expect(gradeWillBeComplete(current, levels.at(-1)!, 1)).toBe(true);
    expect(nextGradeAfter('2')).toBe('3');
    expect(nextGradeAfter('5')).toBeUndefined();
  });
});
