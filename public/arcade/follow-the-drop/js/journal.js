// The Explorer's Journal: fog-of-war map, quest badges, and the drop
// odometer. Journey state (visit order + traversed edges + total years)
// persists in localStorage; main.js calls journalRecordVisit on arrival.

const JOURNEY_KEY = "follow-the-drop:journey";

// Hand-laid map positions (percent of the map canvas).
const MAP_POS = {
  thunderstorm: [28, 10], cloud: [49, 7], evaporation: [70, 13],
  rain: [37, 24], snow: [62, 22],
  meadow: [25, 38], trees: [47, 35], glacier: [79, 30],
  beaver: [13, 51], river: [53, 51], lake: [70, 42], ocean: [87, 50],
  groundwater: [27, 63], cave: [40, 76], geyser: [61, 82],
  treatment: [74, 66], tap: [90, 73], you: [86, 88], drain: [65, 92],
  wastewater: [45, 92]
};

const QUESTS = [
  { id: "shape-shifter", emoji: "💠", title: "Shape Shifter",
    desc: "Be liquid, ice, and vapor on your journey.",
    check: function (j) {
      const states = new Set(j.visits.map(function (id) { return SCENES[id].state; }));
      return states.has("liquid") && states.has("ice") && states.has("vapor");
    } },
  { id: "round-and-round", emoji: "🔄", title: "Round and Round",
    desc: "Come back to the cloud — a full trip around the cycle!",
    check: function (j) {
      return j.visits.filter(function (id) { return id === "cloud"; }).length >= 2;
    } },
  { id: "city-explorer", emoji: "🏙️", title: "City Explorer",
    desc: "Visit the whole town: the cleaning factory, the kitchen, the drain, and the wastewater plant.",
    check: function (j) {
      return ["treatment", "tap", "drain", "wastewater"].every(function (id) {
        return j.visits.indexOf(id) !== -1;
      });
    } },
  { id: "snowflake-to-sink", emoji: "❄️", title: "Snowflake to Sink",
    desc: "Start as mountain snow and end up in a kitchen.",
    check: function (j) {
      const s = j.visits.indexOf("snow"), t = j.visits.indexOf("tap");
      return s !== -1 && t !== -1 && s < t;
    } },
  { id: "mountain-to-sea", emoji: "🏔️", title: "Mountain to the Sea",
    desc: "Ride from a glacier all the way to the ocean.",
    check: function (j) {
      const g = j.visits.indexOf("glacier"), o = j.visits.indexOf("ocean");
      return g !== -1 && o !== -1 && g < o;
    } },
  { id: "deep-diver", emoji: "🤿", title: "Deep Diver",
    desc: "Explore all the underground secrets: the aquifer, the crystal cave, and the geyser.",
    check: function (j) {
      return ["groundwater", "cave", "geyser"].every(function (id) {
        return SCENES[id] && j.visits.indexOf(id) !== -1;
      });
    } },
  { id: "part-of-someone", emoji: "🧒", title: "Part of Someone",
    desc: "Get drunk by a thirsty kid and become part of them.",
    check: function (j) { return j.visits.indexOf("you") !== -1; } },
  { id: "world-traveler", emoji: "🌍", title: "World Traveler",
    desc: "Visit every single place on the map.",
    check: function (j) {
      return SCENE_ORDER.every(function (id) { return j.visits.indexOf(id) !== -1; });
    } }
];

function journalLoad() {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    const j = raw ? JSON.parse(raw) : null;
    if (j && Array.isArray(j.visits) && Array.isArray(j.edges)) return j;
  } catch (e) { /* fall through */ }
  return { visits: [], edges: [], years: 0, badges: [] };
}

function journalSave(journey) {
  try { localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey)); }
  catch (e) { /* private browsing */ }
}

// Records an arrival. Returns array of freshly earned quests (possibly empty).
function journalRecordVisit(journey, sceneId, fromId) {
  journey.visits.push(sceneId);
  journey.years += (SCENES[sceneId].residence || { years: 0 }).years;
  if (fromId) {
    const edge = fromId + ">" + sceneId;
    const reverse = sceneId + ">" + fromId;
    if (journey.edges.indexOf(edge) === -1 && journey.edges.indexOf(reverse) === -1) {
      journey.edges.push(edge);
    }
  }
  const fresh = [];
  QUESTS.forEach(function (q) {
    if (journey.badges.indexOf(q.id) === -1 && q.check(journey)) {
      journey.badges.push(q.id);
      fresh.push(q);
    }
  });
  journalSave(journey);
  return fresh;
}

function journalOdometerLabel(journey) {
  const y = journey.years;
  if (y < 0.02) {
    const days = Math.max(1, Math.round(y * 365));
    return days + (days === 1 ? " day" : " days");
  }
  if (y < 2) return Math.round(y * 12) + " months";
  return Math.round(y).toLocaleString() + " years";
}

// ---------- Rendering the journal panes ----------

function journalRenderMap(journey, visited, currentSceneId) {
  const svg = document.getElementById("map-svg");
  const frontier = {};   // unvisited scene -> true, if adjacent to a visited one
  visited.forEach(function (id) {
    const s = SCENES[id];
    [].concat(s.next || [], s.back || []).forEach(function (c) {
      if (!visited.has(c.to)) frontier[c.to] = true;
    });
  });

  function pairKey(a, b) { return a < b ? a + ">" + b : b + ">" + a; }
  const traveled = {};
  journey.edges.forEach(function (e) {
    const ids = e.split(">");
    traveled[pairKey(ids[0], ids[1])] = true;
  });

  let parts = [];
  const drawn = {};
  // 1. Known trails: both ends visited. Faint if not yet walked since
  //    the journal began; solid blue if actually traveled.
  visited.forEach(function (id) {
    [].concat(SCENES[id].next || [], SCENES[id].back || []).forEach(function (c) {
      if (!visited.has(c.to)) return;
      const key = pairKey(id, c.to);
      if (drawn[key]) return;
      drawn[key] = true;
      parts.push(mapEdge(id, c.to,
        traveled[key] ? "map-edge-traveled" : "map-edge-known"));
    });
  });
  // 2. Frontier hints: visited -> "?" neighbor, dashed.
  visited.forEach(function (id) {
    [].concat(SCENES[id].next || [], SCENES[id].back || []).forEach(function (c) {
      if (!frontier[c.to]) return;
      const key = pairKey(id, c.to);
      if (drawn[key]) return;
      drawn[key] = true;
      parts.push(mapEdge(id, c.to, "map-edge-hint"));
    });
  });
  // Nodes
  Object.keys(MAP_POS).forEach(function (id) {
    if (!SCENES[id]) return;
    const p = MAP_POS[id];
    const x = p[0] * 10, y = p[1] * 7.8;
    if (visited.has(id)) {
      const here = id === currentSceneId;
      parts.push(
        '<g class="map-node' + (here ? " map-node-here" : "") + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + (here ? 30 : 24) + '"/>' +
        '<text x="' + x + '" y="' + (y + 7) + '" class="map-emoji">' + SCENES[id].emoji + "</text>" +
        '<text x="' + x + '" y="' + (y + 46) + '" class="map-label">' + SCENES[id].title + "</text></g>"
      );
    } else if (frontier[id]) {
      parts.push(
        '<g class="map-node map-node-unknown">' +
        '<circle cx="' + x + '" cy="' + y + '" r="20"/>' +
        '<text x="' + x + '" y="' + (y + 7) + '" class="map-emoji">?</text></g>'
      );
    }
  });
  svg.innerHTML = parts.join("");
}

function mapEdge(a, b, cls) {
  if (!MAP_POS[a] || !MAP_POS[b]) return "";
  const p1 = MAP_POS[a], p2 = MAP_POS[b];
  return '<line class="' + cls + '" x1="' + p1[0] * 10 + '" y1="' + p1[1] * 7.8 +
         '" x2="' + p2[0] * 10 + '" y2="' + p2[1] * 7.8 + '"/>';
}

function journalRenderQuests(journey) {
  const list = document.getElementById("quest-list");
  list.innerHTML = "";
  QUESTS.forEach(function (q) {
    const earned = journey.badges.indexOf(q.id) !== -1;
    const li = document.createElement("li");
    li.className = "quest" + (earned ? " quest-earned" : "");
    li.innerHTML =
      '<span class="quest-emoji">' + (earned ? q.emoji : "🔒") + "</span>" +
      '<span class="quest-text"><strong>' + q.title + "</strong><br>" + q.desc + "</span>" +
      (earned ? '<span class="quest-check">✓</span>' : "");
    list.appendChild(li);
  });
}

function journalRender(journey, visited, currentSceneId) {
  document.getElementById("odometer").textContent =
    "Your drop has been traveling for " + journalOdometerLabel(journey) + "!";
  journalRenderMap(journey, visited, currentSceneId);
  journalRenderQuests(journey);
  passportRenderGrid(visited);
}
