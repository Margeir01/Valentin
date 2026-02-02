const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const card = document.getElementById("card");
const final = document.getElementById("final");
const stage = document.getElementById("stage");

// PC ≈ hover + fin peker
const isDesktopPointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

// Tekstprogresjon (DIN versjon)
const noTexts = [
  "nei",
  "Sikker?",
  "Heeeeeelt sikker?",
  "Vær så snill?",
  "Siste sjanse",
  "Biiiiiitch",
  "Ok, stop",
  "Bare trykk ja",
];

let noIndex = 0;

// Store hopp på Ja
const GROW_STEP = 0.35;
const MAX_SCALE = 50.0;
let yesScale = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function updateYes() {
  yesBtn.style.setProperty("--yesScale", yesScale.toFixed(3));
}

function growYes() {
  yesScale = clamp(yesScale + GROW_STEP, 1, MAX_SCALE);
  updateYes();

  if (yesScale >= 6) {
    yesBtn.classList.add("too-big"); // takeover
  }
}

function advanceNoText() {
  noIndex = clamp(noIndex + 1, 0, noTexts.length - 1);
  noBtn.textContent = noTexts[noIndex];
}

/* ---- Nei flytter seg, men lesbart ---- */
let isMovingNo = false;
const MOVE_AFTER_MS = 700;
const MOVE_COOLDOWN_MS = 1100;
let lastMoveTs = 0;

function setNoAbsoluteIfNeeded() {
  stage.style.position = "relative";
  noBtn.style.position = "absolute";

  if (!noBtn.style.left && !noBtn.style.top) {
    const stageRect = stage.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const startX = stageRect.width / 2 + 30;
    const startY = (stageRect.height - btnRect.height) / 2;

    noBtn.style.left = Math.max(10, startX) + "px";
    noBtn.style.top = Math.max(10, startY) + "px";
  }
}

function moveNoButton() {
  setNoAbsoluteIfNeeded();

  const stageRect = stage.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 10;

  const maxX = stageRect.width - btnRect.width - padding;
  const maxY = stageRect.height - btnRect.height - padding;

  const currentX = parseFloat(noBtn.style.left || "0");
  const currentY = parseFloat(noBtn.style.top || "0");

  let x,
    y,
    tries = 0;
  do {
    x = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
    y = Math.floor(Math.random() * (maxY - padding + 1)) + padding;
    tries++;
  } while (Math.hypot(x - currentX, y - currentY) < 90 && tries < 10);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

function scheduleNoMove() {
  const now = Date.now();
  if (now - lastMoveTs < MOVE_COOLDOWN_MS) return;
  if (isMovingNo) return;

  isMovingNo = true;
  lastMoveTs = now;

  setTimeout(() => {
    moveNoButton();
    setTimeout(() => {
      isMovingNo = false;
    }, 520);
  }, MOVE_AFTER_MS);
}
/* ------------------------------------ */

function onNoAttempt() {
  advanceNoText();
  growYes();
  if (isDesktopPointer) scheduleNoMove();
}

yesBtn.addEventListener("click", () => {
  card.classList.add("hidden");
  final.classList.remove("hidden");
});

// Desktop vs mobil bindings
if (isDesktopPointer) {
  setTimeout(() => moveNoButton(), 80);

  noBtn.addEventListener("mouseenter", onNoAttempt);
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    onNoAttempt();
  });
} else {
  noBtn.addEventListener("click", onNoAttempt);
}

// Init
updateYes();
