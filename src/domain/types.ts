export type Grade = 'K' | '1' | '2' | '3' | '4' | '5';
export type SubjectId = 'math' | 'english' | 'science' | 'social';
export type GameType = 'answer-dash' | 'number-builder' | 'word-forge' | 'discovery-lab' | 'map-explorer';
export type CompletionState = 'locked' | 'available' | 'complete' | 'review';

export interface LearnerProfile {
  id: string;
  name: string;
  age?: number;
  avatar: string;
  selectedGrade: Grade;
  stars: number;
  createdAt: string;
}

export interface LevelDefinition {
  id: string;
  grade: Grade;
  subject: SubjectId;
  title: string;
  concept: string;
  gameType: GameType;
  skillId: string;
  prerequisite?: string;
  config: Record<string, unknown>;
}

export interface AttemptEvent {
  id: string;
  learnerId: string;
  levelId: string;
  skillId: string;
  gameType: GameType;
  accuracy: number;
  attempts: number;
  hintsUsed: number;
  durationSeconds: number;
  createdAt: string;
  contentVersion: string;
}

export interface MasteryRecord { skillId: string; score: number; evidence: number; updatedAt: string }
export interface ProgressRecord { levelId: string; state: CompletionState; updatedAt: string; learned?: boolean }

export interface QuestwoodState {
  version: 1;
  profile: LearnerProfile;
  attempts: AttemptEvent[];
  mastery: Record<string, MasteryRecord>;
  progress: Record<string, ProgressRecord>;
  completedToday: number;
}

export interface GameResult {
  accuracy: number;
  attempts: number;
  hintsUsed: number;
  durationSeconds: number;
}
