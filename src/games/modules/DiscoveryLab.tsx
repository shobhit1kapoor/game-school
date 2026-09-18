import { useState } from 'react';
import type { GameResult, LevelDefinition } from '../../domain/types';
import { playSound } from '../../lib/sound';
export function DiscoveryLab({ level, onFinish }: { level: LevelDefinition; onFinish: (result: Omit<GameResult, 'durationSeconds'>) => void }) {
  const initialTemperature = (level.config.temperature as number | undefined) ?? 10;
  const [temperature, setTemperature] = useState(initialTemperature); const [prediction, setPrediction] = useState<'ice' | 'water' | 'vapor' | null>(null); const state = temperature <= 0 ? 'ice' : temperature >= 100 ? 'vapor' : 'water';
  const finish = () => { const right = prediction === state; playSound(right ? 'correct' : 'wrong'); onFinish({ accuracy: right ? 1 : 0.55, attempts: 1, hintsUsed: prediction === null ? 1 : 0 }); };
  return <section className="play-area lab-game"><div className="lab-beaker"><div className={`matter matter-${state}`}>{state === 'ice' ? '🧊' : state === 'vapor' ? '☁️' : '💧'}</div></div><h3>What happens to water as temperature changes?</h3><input aria-label="Temperature" type="range" min="-10" max="110" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} /><div className="temperature">{temperature}°C</div><p>Make a prediction, then record what you observed.</p><div className="prediction-row">{(['ice', 'water', 'vapor'] as const).map((item) => <button className={prediction === item ? 'selected' : ''} onClick={() => setPrediction(item)} key={item}>{item}</button>)}</div><button className="primary-button" onClick={finish}>Record observation</button></section>;
}
