export type GameSchoolSound = 'tap' | 'correct' | 'wrong' | 'reward';
export type AmbientTheme = 'Quiet forest' | 'Mountain breeze' | 'Ocean sparkle' | 'Music off';

let audioContext: AudioContext | null = null;
let ambientTimer: number | null = null;
let ambientOscillators: OscillatorNode[] = [];

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

export function stopAmbientMusic() {
  if (ambientTimer !== null) window.clearTimeout(ambientTimer);
  ambientTimer = null;
  ambientOscillators.forEach((oscillator) => oscillator.stop());
  ambientOscillators = [];
}

export function setAmbientTheme(theme: AmbientTheme) {
  stopAmbientMusic();
  if (theme === 'Music off') return;
  const audio = context();
  if (!audio) return;
  const notes: Record<Exclude<AmbientTheme, 'Music off'>, number[]> = {
    'Quiet forest': [261.63, 329.63, 392],
    'Mountain breeze': [293.66, 369.99, 440],
    'Ocean sparkle': [349.23, 440, 523.25],
  };
  let step = 0;
  const playPhrase = () => {
    const now = audio.currentTime;
    const phrase = notes[theme];
    ambientOscillators = phrase.map((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = now + index * 0.42;
      oscillator.type = theme === 'Mountain breeze' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency * (step % 2 ? 1.004 : 1), start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.022, start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.76);
      return oscillator;
    });
    step += 1;
    ambientTimer = window.setTimeout(playPhrase, 3400);
  };
  playPhrase();
}
