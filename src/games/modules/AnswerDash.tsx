import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../../domain/types';
import { playSound } from '../../lib/sound';

type Question = { prompt: string; choices: string[]; correct: number };
const QUESTIONS: Question[] = [
  { prompt: 'Which number has more value?', choices: ['47', '74', '44'], correct: 1 },
  { prompt: 'What is 30 + 7?', choices: ['37', '307', '10'], correct: 0 },
  { prompt: 'Which shows seven tens?', choices: ['7', '70', '700'], correct: 1 },
];

export function AnswerDash({ level, onFinish }: { level: LevelDefinition; onFinish: (result: Omit<GameResult, 'durationSeconds'>) => void }) {
  const [index, setIndex] = useState(0); const [correct, setCorrect] = useState(0); const [attempts, setAttempts] = useState(0); const [feedback, setFeedback] = useState('Choose a glowing trail to keep moving.');
  const questions = (level.config.questions as Question[] | undefined) ?? QUESTIONS;
  const question = questions[index];
  const choose = (choice: number) => { const right = choice === question.correct; const nextCorrect = correct + Number(right); const nextAttempts = attempts + 1; playSound(right ? 'correct' : 'wrong'); setAttempts(nextAttempts); setFeedback(right ? 'Wonderful! Your lantern shines brighter.' : 'Almost. Look carefully and try the next trail.'); if (index === questions.length - 1) window.setTimeout(() => onFinish({ accuracy: nextCorrect / questions.length, attempts: nextAttempts, hintsUsed: 0 }), 500); else { setCorrect(nextCorrect); window.setTimeout(() => setIndex((value) => value + 1), 450); } };
  return <section className="play-area dash-game"><div className="dash-progress"><span>Trail {index + 1} of {questions.length}</span><div><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div><div className="dash-prompt"><span className="mascot">🦉</span><h3>{question.prompt}</h3><p>{feedback}</p></div><div className="lane-grid">{question.choices.map((choice, choiceIndex) => <button key={choice} className="answer-lane" onClick={() => choose(choiceIndex)}><span>✦</span>{choice}</button>)}</div></section>;
}
