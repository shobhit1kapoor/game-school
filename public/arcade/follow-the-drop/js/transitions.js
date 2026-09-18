// Scene transitions: a watery crossfade. The incoming scene fades in
// blurred over the outgoing one (which melts underneath), so mid-
// transition the screen shows an interpolation of the two paintings.
// Owns the two stacked image layers in the stage.

let frontLayer, backLayer;
let transitioning = false;

function isTransitioning() {
  return transitioning;
}

// Called once by main.js to set up layers and the first scene image.
function stageInit(scene) {
  frontLayer = document.getElementById("scene-layer-a");
  backLayer = document.getElementById("scene-layer-b");
  setLayerImage(frontLayer, scene);
}

function setLayerImage(layer, scene) {
  const img = layer.querySelector("img");
  img.src = scene.image;
  img.alt = scene.title + " — an illustrated scene from the water cycle";
}

// Preload an image; resolves either way so a missing file can't
// strand the transition mid-blur.
function preloadImage(src) {
  return new Promise(function (resolve) {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

// Crossfade to a new scene. renderFn updates the overlays/panel and is
// called mid-transition, while they're faded out.
function transitionTo(scene, renderFn) {
  if (transitioning) return;
  transitioning = true;

  const overlay = document.getElementById("overlay-layer");
  overlay.classList.add("overlay-hidden");

  preloadImage(scene.image).then(function () {
    const incoming = backLayer;
    const outgoing = frontLayer;

    setLayerImage(incoming, scene);
    incoming.classList.add("entering");
    void incoming.offsetWidth;

    // Animate: incoming fades in sharp on top, outgoing melts below.
    incoming.classList.remove("entering");
    incoming.classList.add("front", "rising");
    outgoing.classList.add("melting");
    renderFn();

    setTimeout(function () {
      outgoing.classList.remove("front", "melting");
      incoming.classList.remove("rising");
      frontLayer = incoming;
      backLayer = outgoing;
      overlay.classList.remove("overlay-hidden");
      transitioning = false;
    }, 820);
  });
}
