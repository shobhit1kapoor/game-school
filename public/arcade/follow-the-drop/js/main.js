// Coordinator: owns the app state (current scene, visited set, journey)
// and wires every UI event. Other modules are stateless helpers.

(function () {
  // The URL hash is the source of truth for the current scene, so the
  // browser's back/forward buttons walk the drop's actual journey and
  // any scene is deep-linkable (e.g. .../#river).
  const initialHash = window.location.hash.slice(1);
  let currentSceneId = SCENES[initialHash] ? initialHash : START_SCENE;
  const visited = passportLoad();
  const journey = journalLoad();

  // Migration: profiles stamped before the journal existed have visited
  // scenes but an empty journey. Credit the odometer for each stamped
  // scene (order is unknowable, so quests and edges start fresh).
  if (journey.visits.length === 0 && visited.size > 0) {
    visited.forEach(function (id) {
      if (SCENES[id]) journey.years += (SCENES[id].residence || { years: 0 }).years;
    });
    journalSave(journey);
  }

  const callbacks = {
    onNavigate: navigateTo,
    onHotspot: showFactCard
  };

  // User-initiated navigation just moves the hash; onHashChange does
  // the actual scene swap (so back/forward take the same code path).
  function navigateTo(sceneId) {
    if (!SCENES[sceneId] || sceneId === currentSceneId || isTransitioning()) return;
    window.location.hash = sceneId;
  }

  function onHashChange() {
    const sceneId = window.location.hash.slice(1);
    if (!SCENES[sceneId] || sceneId === currentSceneId) return;
    if (isTransitioning()) {
      // A transition is mid-flight (e.g. back pressed during one);
      // re-check once it has settled.
      setTimeout(onHashChange, 650);
      return;
    }
    const fromId = currentSceneId;
    hideFactCard();
    narrateStop();
    setSpeaking(false);
    transitionTo(SCENES[sceneId], function () {
      currentSceneId = sceneId;
      renderScene(sceneId, callbacks);
      arrive(sceneId, fromId);
    });
  }

  window.addEventListener("hashchange", onHashChange);

  // Everything that happens when the drop lands somewhere:
  // stamp, journey log, quest checks, counters.
  function arrive(sceneId, fromId) {
    const isNew = passportVisit(visited, sceneId);
    passportUpdateCounter(visited);
    if (isNew) {
      const btn = document.getElementById("passport-button");
      btn.classList.remove("stamped");
      void btn.offsetWidth;
      btn.classList.add("stamped");
    }
    const freshQuests = journalRecordVisit(journey, sceneId, fromId);
    if (freshQuests.length) {
      showQuestToast(freshQuests[0]);
    }
  }

  // ---------- Quest toast ----------

  let toastTimer = null;
  function showQuestToast(quest) {
    const toast = document.getElementById("quest-toast");
    toast.textContent = quest.emoji + " Badge earned: " + quest.title + "!";
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 4200);
  }

  // ---------- Read aloud ----------

  function setSpeaking(on) {
    document.getElementById("read-aloud").classList.toggle("speaking", on);
  }

  document.getElementById("read-aloud").addEventListener("click", function () {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      narrateStop();
      setSpeaking(false);
    } else {
      narrateScene(SCENES[currentSceneId],
        function () { setSpeaking(true); },
        function () { setSpeaking(false); });
    }
  });

  // ---------- Fact card ----------

  document.getElementById("fact-close").addEventListener("click", hideFactCard);
  document.getElementById("stage").addEventListener("click", hideFactCard);

  // ---------- Long-ago chip ----------

  document.getElementById("longago-chip").addEventListener("click", function (event) {
    event.stopPropagation();
    showFactCard(
      { label: "Long ago…", fact: SCENES[currentSceneId].longAgo },
      event.currentTarget
    );
  });

  // ---------- Journal modal + tabs ----------

  document.getElementById("passport-button").addEventListener("click", function () {
    journalRender(journey, visited, currentSceneId);
    document.getElementById("passport-modal").hidden = false;
  });
  document.getElementById("passport-close").addEventListener("click", function () {
    document.getElementById("passport-modal").hidden = true;
  });
  document.getElementById("passport-modal").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) event.currentTarget.hidden = true;
  });

  document.querySelectorAll(".journal-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".journal-tab").forEach(function (t) {
        t.classList.toggle("active", t === tab);
      });
      document.querySelectorAll(".journal-pane").forEach(function (pane) {
        pane.classList.toggle("active", pane.id === tab.dataset.pane);
      });
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideFactCard();
      document.getElementById("passport-modal").hidden = true;
    }
  });

  // ---------- Intro ----------

  const intro = document.getElementById("intro");
  document.getElementById("intro-start").addEventListener("click", function () {
    intro.hidden = true;
    arrive(currentSceneId, null);
  });

  // ---------- First paint ----------

  history.replaceState(null, "", "#" + currentSceneId);
  stageInit(SCENES[currentSceneId]);
  renderScene(currentSceneId, callbacks);
  passportUpdateCounter(visited);
  if (visited.size === 0) {
    intro.hidden = false;
  } else {
    arrive(currentSceneId, null);
  }
})();
