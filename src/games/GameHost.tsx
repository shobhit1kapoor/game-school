import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../domain/types';
import { AnswerDash } from './modules/AnswerDash';
import { NumberBuilder } from './modules/NumberBuilder';
import { WordForge } from './modules/WordForge';
import { DiscoveryLab } from './modules/DiscoveryLab';
import { MapExplorer } from './modules/MapExplorer';
import { playSound } from '../lib/sound';

export function GameHost({ level, onLearned, onFinish, onExit }: { level: LevelDefinition; onLearned: () => void; onFinish: (result: GameResult) => void; onExit: () => void }) {
  const [startedAt] = useState(() => Date.now());
  const [showIntroduction, setShowIntroduction] = useState(true);
  const finish = (partial: Omit<GameResult, 'durationSeconds'>) => onFinish({ ...partial, durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)) });
  const props = { level, onFinish: finish };
  let game;
  switch (level.gameType) {
    case 'answer-dash': game = <AnswerDash {...props} />; break;
    case 'number-builder': game = <NumberBuilder {...props} />; break;
    case 'word-forge': game = <WordForge {...props} />; break;
    case 'discovery-lab': game = <DiscoveryLab {...props} />; break;
    case 'map-explorer': game = <MapExplorer {...props} />; break;
  }
  return <div className="game-shell" role="dialog" aria-modal="true" aria-label={`${level.title} game`}><header className="game-header"><div><span className="game-subject">{level.subject}</span><h2>{level.title}</h2><p>{level.concept}</p></div><button className="icon-button" onClick={onExit} aria-label="Exit level">×</button></header>{showIntroduction ? <LearningLaunch level={level} onStart={() => { onLearned(); setShowIntroduction(false); }} /> : game}</div>;
}

type GuidedQuestion = { prompt: string; choices: string[]; correct: number };

function LearningLaunch({ level, onStart }: { level: LevelDefinition; onStart: () => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const goal = level.config.goal as string | undefined;
  const example = level.config.example as string | undefined;
  const strategy = level.config.strategy as string | undefined;
  const vocabulary = level.config.vocabulary as string | undefined;
  const gradeLabel = level.config.gradeLabel as string | undefined;
  const questions = (level.config.questions as GuidedQuestion[] | undefined) ?? [];
  const guided = questions[0];
  const stage = level.config.stage as { name?: string; mission?: string; skills?: string[] } | undefined;
  const coach = level.subject === 'math'
    ? 'Find the numbers, shapes, or groups that tell the story. Work one small step at a time.'
    : level.subject === 'english'
      ? 'Read slowly and use sound, word, sentence, and picture clues together.'
      : level.subject === 'science'
        ? 'Scientists observe first, make a prediction, and use evidence to explain what happens.'
        : 'Use map, community, time, and source clues to understand people and places.';
  const feedback = choice === null ? '' : choice === guided?.correct ? 'Nice thinking! You found the key idea.' : 'Almost. Look back at the clue, then try another answer.';
  return <section className="lesson-launch">
    <div className="lesson-launch-top"><span className="lesson-launch-icon" aria-hidden="true">{level.subject === 'math' ? '🔢' : level.subject === 'english' ? '📚' : level.subject === 'science' ? '🔎' : '🗺️'}</span><div><p className="overline">{gradeLabel ?? 'YOUR'} CONCEPT LESSON</p><h3>{level.title}: learn it first</h3><p>{goal ?? `We will learn about ${level.concept.toLowerCase()}.`}</p></div></div>
    <div className="lesson-step-grid"><article><span>1</span><h4>Big idea</h4><p>{coach}</p></article><article><span>2</span><h4>Worked thinking</h4><p>{example ?? 'Take one slow look at the clues. You can replay this page any time.'}</p></article><article><span>3</span><h4>Use this strategy</h4><p>{strategy ?? 'Use the clues, explain your choice, and take your time.'}</p></article><article><span>4</span><h4>Words to know</h4><p>{vocabulary ?? 'idea • clue • practice • explain'}</p></article></div>
    {stage && <div className="stage-lesson-note"><strong>{stage.name}</strong><span>{stage.mission}</span><small>{stage.skills?.join(' · ')}</small></div>}
    {guided && <section className="guided-check" aria-label="Try it together"><p className="overline">3 · TRY IT TOGETHER</p><h4>{guided.prompt.replace(/^[^—]+—\s*/, '')}</h4><div className="guided-choices">{guided.choices.map((item, index) => <button key={item} className={choice === index ? (index === guided.correct ? 'correct' : 'retry') : ''} onClick={() => { setChoice(index); playSound(index === guided.correct ? 'correct' : 'wrong'); }}>{item}</button>)}</div>{feedback && <p className={choice === guided.correct ? 'guided-feedback correct' : 'guided-feedback retry'}>{feedback}</p>}</section>}
    <div className="lesson-launch-footer"><p>When you are ready, use what you learned in all 10 practice parts. There is no timer, and you can replay this concept lesson whenever you want.</p><button className="primary-button" onClick={onStart}>Start 10-part practice</button></div>
  </section>;
}
