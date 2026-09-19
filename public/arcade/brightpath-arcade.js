(() => {
  if (document.querySelector('.brightpath-arcade-hud')) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/arcade/brightpath-arcade.css';
  document.head.append(stylesheet);
  const hud = document.createElement('aside');
  hud.className = 'brightpath-arcade-hud';
  hud.setAttribute('aria-label', 'Game School game controls');
  hud.innerHTML = '<span class="brightpath-arcade-hud__mark" aria-hidden="true">✦</span><span>Game School</span><button class="brightpath-arcade-hud__back" type="button">Back</button>';
  hud.querySelector('button')?.addEventListener('click', () => { window.location.assign('/'); });
  document.body.append(hud);
  let audio;
  const chirp = () => {
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') void audio.resume();
      const oscillator = audio.createOscillator(); const gain = audio.createGain(); const now = audio.currentTime;
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.04, now + .01); gain.gain.exponentialRampToValueAtTime(.0001, now + .075);
      oscillator.connect(gain).connect(audio.destination); oscillator.start(now); oscillator.stop(now + .09);
    } catch { /* A browser may block sound until its first permitted gesture. */ }
  };
  document.addEventListener('click', () => chirp(), true);
})();
