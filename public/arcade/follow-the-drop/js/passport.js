// Water Passport: tracks which scenes the drop has visited
// (persisted in localStorage) and renders the stamp book.

const PASSPORT_KEY = "follow-the-drop:visited";

function passportLoad() {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return new Set(ids.filter(function (id) { return SCENES[id]; }));
  } catch (e) {
    return new Set();
  }
}

function passportSave(visited) {
  try {
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(Array.from(visited)));
  } catch (e) { /* private browsing: stamps just don't persist */ }
}

// Returns true if this visit earned a brand-new stamp.
function passportVisit(visited, sceneId) {
  if (visited.has(sceneId)) return false;
  visited.add(sceneId);
  passportSave(visited);
  return true;
}

function passportUpdateCounter(visited) {
  const counter = document.getElementById("passport-count");
  counter.textContent = visited.size + " / " + SCENE_ORDER.length;
}

function passportRenderGrid(visited) {
  const grid = document.getElementById("stamp-grid");
  grid.innerHTML = "";
  SCENE_ORDER.forEach(function (id) {
    const scene = SCENES[id];
    const cell = document.createElement("div");
    if (visited.has(id)) {
      cell.className = "stamp stamp-earned";
      cell.innerHTML =
        '<div><span class="stamp-emoji">' + scene.emoji + "</span>" +
        '<span class="stamp-name">' + scene.stamp + "</span></div>";
    } else {
      cell.className = "stamp stamp-empty";
      cell.textContent = "?";
    }
    grid.appendChild(cell);
  });
}
