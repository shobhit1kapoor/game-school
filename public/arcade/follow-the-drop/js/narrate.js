// Read-aloud support via the Web Speech API.
// Stateless helpers; main.js wires the button.

function narrateStop() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// Speaks the scene title + body. Calls onStart/onEnd so the UI
// can show a speaking state. Slightly slow rate for young readers.
function narrateScene(scene, onStart, onEnd) {
  if (!("speechSynthesis" in window)) return;
  narrateStop();
  const utterance = new SpeechSynthesisUtterance(scene.title + ". " + scene.body);
  utterance.rate = 0.92;
  utterance.pitch = 1.1;
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}
