import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../../domain/types';
import { playSound } from '../../lib/sound';
type MapQuestion = { prompt: string; choices: string[]; correct: number };
const locations: MapQuestion[] = [{ prompt: 'Which symbol helps you understand a map?', choices: ['Legend', 'Recipe', 'Diary'], correct: 0 }, { prompt: 'Which direction is at the top of most maps?', choices: ['North', 'South', 'West'], correct: 0 }, { prompt: 'A map key explains…', choices: ['symbols', 'jokes', 'weather'], correct: 0 }];
export function MapExplorer({ level, onFinish }: { level: LevelDefinition; onFinish: (result: Omit<GameResult, 'durationSeconds'>) => void }) {
  const questions = (level.config.questions as MapQuestion[] | undefined) ?? locations;
  const [index, setIndex] = useState(0); const [correct, setCorrect] = useState(0); const [attempts, setAttempts] = useState(0); const prompt = questions[index];
  const choose = (choice: number) => { const right = choice === prompt.correct; const nextCorrect = correct + Number(right); const nextAttempts = attempts + 1; playSound(right ? 'correct' : 'wrong'); setAttempts(nextAttempts); if (index === questions.length - 1) onFinish({ accuracy: nextCorrect / questions.length, attempts: nextAttempts, hintsUsed: 0 }); else { setCorrect(nextCorrect); setIndex((value) => value + 1); } };
  return <section className="play-area map-game"><div className="compass">N<br /><span>W · ✦ · E</span><br />S</div><h3>{prompt.prompt}</h3><div className="map-path">🏠 <span>— — —</span> 🏛️ <span>— — —</span> 🌳</div><div className="word-choices">{prompt.choices.map((choice, index) => <button key={choice} onClick={() => choose(index)}>{choice}</button>)}</div></section>;
}
