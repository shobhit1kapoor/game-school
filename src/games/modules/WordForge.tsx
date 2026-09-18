import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../../domain/types';
import { playSound } from '../../lib/sound';
type WordQuestion = { prompt: string; choices: string[]; correct: number };
const words: WordQuestion[] = [{ prompt: 'Choose the word that starts with the /sh/ sound.', choices: ['ship', 'sun', 'tap'], correct: 0 }, { prompt: 'Choose the word that means happy.', choices: ['glad', 'sad', 'cold'], correct: 0 }, { prompt: 'Choose a complete sentence.', choices: ['The dog runs.', 'dog the runs', 'runs dog the'], correct: 0 }];
export function WordForge({ level, onFinish }: { level: LevelDefinition; onFinish: (result: Omit<GameResult, 'durationSeconds'>) => void }) {
  const questions = (level.config.questions as WordQuestion[] | undefined) ?? words;
  const [step, setStep] = useState(0); const [correct, setCorrect] = useState(0); const [attempts, setAttempts] = useState(0); const item = questions[step];
  const select = (index: number) => { const right = index === item.correct; const nextAttempts = attempts + 1; const nextCorrect = correct + Number(right); playSound(right ? 'correct' : 'wrong'); setAttempts(nextAttempts); if (step === questions.length - 1) onFinish({ accuracy: nextCorrect / questions.length, attempts: nextAttempts, hintsUsed: 0 }); else { setCorrect(nextCorrect); setStep((value) => value + 1); } };
  return <section className="play-area forge-game"><div className="forge-illustration">📚<span>✦</span></div><p className="step-label">Word card {step + 1} of {questions.length}</p><h3>{item.prompt}</h3><div className="word-choices">{item.choices.map((choice, index) => <button key={choice} onClick={() => select(index)}>{choice}</button>)}</div></section>;
}
