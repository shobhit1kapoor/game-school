import { GRADES, levelsForGrade } from '../content/catalog';
import type { Grade, LevelDefinition, QuestwoodState } from './types';

export function gradeWillBeComplete(state: QuestwoodState, completedLevel: LevelDefinition, accuracy: number): boolean {
  if (accuracy < 0.6) return false;
  return levelsForGrade(completedLevel.grade).every((level) => (
    level.id === completedLevel.id || state.progress[level.id]?.state === 'complete'
  ));
}

export function nextGradeAfter(grade: Grade): Grade | undefined {
  const index = GRADES.indexOf(grade);
  return index < GRADES.length - 1 ? GRADES[index + 1] : undefined;
}
