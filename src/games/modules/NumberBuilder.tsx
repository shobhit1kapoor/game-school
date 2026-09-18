import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../../domain/types';
import { playSound } from '../../lib/sound';
const values = [100, 10, 1];
export function NumberBuilder({ level, onFinish }: { level: LevelDefinition; onFinish: (result: Omit<GameResult, 'durationSeconds'>) => void }) {
  const target = (level.config.target as number | undefined) ?? 243; const [counts, setCounts] = useState([0, 0, 0]); const [attempts, setAttempts] = useState(0); const total = counts.reduce((sum, count, index) => sum + count * values[index], 0);
  const adjust = (index: number, direction: number) => setCounts((current) => current.map((count, item) => item === index ? Math.max(0, Math.min(9, count + direction)) : count));
  const check = () => { const next = attempts + 1; setAttempts(next); const right = total === target; playSound(right ? 'correct' : 'wrong'); if (right) onFinish({ accuracy: 1, attempts: next, hintsUsed: 0 }); };
  return <section className="play-area builder-game"><div className="builder-target"><span>Build this number</span><strong>{target}</strong><p>Use hundreds, tens, and ones blocks.</p></div><div className="blocks">{['Hundreds', 'Tens', 'Ones'].map((name, index) => <div className="block-column" key={name}><button onClick={() => adjust(index, 1)} aria-label={`Add a ${name} block`}>+</button><div className={`block block-${index}`}>{counts[index]}</div><button onClick={() => adjust(index, -1)} aria-label={`Remove a ${name} block`}>−</button><span>{name}</span></div>)}</div><div className="builder-total">Your number: <strong>{total}</strong></div><button className="primary-button" onClick={check}>Check my build</button></section>;
}
