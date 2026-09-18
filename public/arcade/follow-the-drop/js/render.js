// Renders one scene into the stage: image, hotspots, story panel,
// and choice buttons. Stateless — main.js owns state and passes
// callbacks for navigation and hotspot taps.

// Renders everything EXCEPT the scene image, which is owned by
// transitions.js (it crossfades between two stacked image layers).
function renderScene(sceneId, callbacks) {
  const scene = SCENES[sceneId];

  // Story panel
  document.getElementById("scene-emoji").textContent = scene.emoji;
  document.getElementById("scene-title").textContent = scene.title;
  document.getElementById("scene-body").textContent = scene.body;

  const question = (scene.next || []).map(function (c) { return c.question; })
    .find(function (q) { return q; });
  document.getElementById("scene-prompt").textContent = question || "";

  renderStateBadge(scene.state);
  renderEffect(scene.effect);
  renderHotspots(scene, callbacks.onHotspot);
  renderNavSigns(scene, callbacks.onNavigate);

  // Reset story panel scroll on small screens
  document.querySelector(".story-card").scrollTop = 0;
}

const STATE_LABELS = {
  liquid: "💧 You're liquid!",
  ice: "❄️ You're ice!",
  vapor: "💨 You're vapor!"
};

function renderStateBadge(state) {
  const badge = document.getElementById("state-badge");
  badge.textContent = STATE_LABELS[state] || "";
  badge.className = "state-badge state-" + state;
}

function renderHotspots(scene, onHotspot) {
  const layer = document.getElementById("hotspot-layer");
  layer.innerHTML = "";
  scene.hotspots.forEach(function (spot, i) {
    const btn = document.createElement("button");
    btn.className = "hotspot";
    btn.style.setProperty("--x", spot.x + "%");
    btn.style.setProperty("--y", spot.y + "%");
    btn.setAttribute("aria-label", "Look closer: " + spot.label);
    btn.innerHTML = "?" + '<span class="hotspot-tag">' + spot.label + "</span>";
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      btn.classList.add("seen");
      onHotspot(spot, btn);
    });
    layer.appendChild(btn);
  });
}

// Choices are trail signs planted in the scene at the place they lead
// to/from: forward signs (blue, →) and back signs (cream, ↩).
function renderNavSigns(scene, onNavigate) {
  const layer = document.getElementById("nav-layer");
  layer.innerHTML = "";

  function plant(choice, signClass) {
    const btn = document.createElement("button");
    btn.className = "nav-sign " + signClass;
    btn.style.setProperty("--x", choice.x + "%");
    btn.style.setProperty("--y", choice.y + "%");
    btn.innerHTML = '<span class="nav-sign-label">' + choice.label + "</span>";
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      onNavigate(choice.to);
    });
    layer.appendChild(btn);
  }

  (scene.back || []).forEach(function (c) { plant(c, "nav-sign-back"); });
  (scene.next || []).forEach(function (c) { plant(c, "nav-sign-next"); });
}

// Positions the fact card near a hotspot, clamped to the viewport,
// and fills in its content.
function showFactCard(spot, hotspotEl) {
  const card = document.getElementById("fact-card");
  document.getElementById("fact-title").textContent = spot.label;
  document.getElementById("fact-body").textContent = spot.fact;
  card.hidden = false;

  const rect = hotspotEl.getBoundingClientRect();
  const cardW = card.offsetWidth;
  const cardH = card.offsetHeight;
  const margin = 12;

  let left = rect.left + rect.width / 2 - cardW / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - cardW - margin));

  // Prefer below the hotspot; flip above if it would run off-screen.
  let top = rect.bottom + 14;
  if (top + cardH > window.innerHeight - margin) {
    top = rect.top - cardH - 14;
  }
  top = Math.max(margin, top);

  card.style.left = left + "px";
  card.style.top = top + "px";
}

function hideFactCard() {
  document.getElementById("fact-card").hidden = true;
}
