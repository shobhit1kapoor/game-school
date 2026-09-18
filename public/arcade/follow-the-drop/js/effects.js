// Ambient scene effects: lightweight CSS particle layers that make the
// paintings breathe. Each scene declares an `effect` in data.js:
//   "rain" | "snow" | "mist" | "bubbles" | "sparkle" | "storm" | null
// "storm" = heavy rain + periodic lightning flash.

const EFFECT_COUNTS = {
  rain: 26, storm: 40, snow: 24, mist: 6, bubbles: 18, sparkle: 16
};

function renderEffect(effect) {
  const layer = document.getElementById("effect-layer");
  layer.innerHTML = "";
  layer.className = "effect-layer";
  if (!effect) return;

  const kind = effect === "storm" ? "rain" : effect;
  const count = EFFECT_COUNTS[effect] || 0;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle particle-" + kind;
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDelay = (Math.random() * 8).toFixed(2) + "s";
    p.style.animationDuration = particleDuration(kind).toFixed(2) + "s";
    if (kind === "mist") {
      p.style.top = Math.random() * 70 + "%";
      p.style.width = 180 + Math.random() * 260 + "px";
    } else if (kind === "sparkle") {
      p.style.top = 20 + Math.random() * 70 + "%";
    } else if (kind === "bubbles") {
      p.style.width = p.style.height = (5 + Math.random() * 11) + "px";
    } else if (kind === "snow") {
      p.style.fontSize = (8 + Math.random() * 10) + "px";
      p.textContent = "❄";
    }
    layer.appendChild(p);
  }

  if (effect === "storm") {
    const flash = document.createElement("div");
    flash.className = "lightning-flash";
    layer.appendChild(flash);
  }
}

function particleDuration(kind) {
  switch (kind) {
    case "rain": return 0.7 + Math.random() * 0.5;
    case "snow": return 7 + Math.random() * 6;
    case "mist": return 16 + Math.random() * 14;
    case "bubbles": return 5 + Math.random() * 5;
    case "sparkle": return 2.5 + Math.random() * 3;
    default: return 5;
  }
}
