export type GameSchoolSound = 'tap' | 'correct' | 'wrong' | 'reward';

let audioContext: AudioContext | null = null;

function context() {
  if (typeof window === 'undefined') return null;
  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

export function playSound(kind: GameSchoolSound) {
  const audio = context();
  if (!audio) return;
  const now = audio.currentTime;
  const notes: Record<GameSchoolSound, number[]> = {
    tap: [440], correct: [523.25, 659.25, 783.99], wrong: [220, 174.61], reward: [523.25, 659.25, 783.99, 1046.5],
  };
  notes[kind].forEach((frequency, index) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = kind === 'wrong' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.07);
    gain.gain.setValueAtTime(0.0001, now + index * 0.07);
    gain.gain.exponentialRampToValueAtTime(kind === 'tap' ? 0.045 : 0.08, now + index * 0.07 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + (kind === 'tap' ? 0.065 : 0.16));
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now + index * 0.07);
    oscillator.stop(now + index * 0.07 + 0.18);
  });
}

export function enableGameSchoolClickSounds() {
  const handler = () => playSound('tap');
  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
}
