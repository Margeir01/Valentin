const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const microText = document.getElementById("microText");

const card = document.getElementById("card");
const final = document.getElementById("final");
const restartBtn = document.getElementById("restartBtn");
const stage = document.getElementById("stage");

// PC ≈ hover + fin peker
const isDesktopPointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

// Tekstprogresjon som i videoene (DIN versjon)
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

// Hvor mye Yes vokser per “No”-forsøk (DIN versjon)
const GROW_STEP = 0.35; // store hopp
const MAX_SCALE = 50.0; // tak

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

  // takeover når den blir “stor nok”
  if (yesScale >= 6) {
    yesBtn.classList.add("too-big");
  }
}

function advanceNoText() {
  noIndex = clamp(noIndex + 1, 0, noTexts.length - 1);
  noBtn.textContent = noTexts[noIndex];
}

/* --------- NEI flytter seg, men LESBART --------- */
let isMovingNo = false;
const MOVE_AFTER_MS = 700; // hvor lenge teksten får stå før den flytter seg
const MOVE_COOLDOWN_MS = 1100; // hvor ofte den får flytte seg
let lastMoveTs = 0;

function setNoAbsoluteIfNeeded() {
  stage.style.position = "relative";
  noBtn.style.position = "absolute";

  // sett startpos hvis tom
  if (!noBtn.style.left && !noBtn.style.top) {
    const stageRect = stage.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const startX = stageRect.width / 2 + 30; // litt til høyre
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

  // La teksten være lesbar litt før flukt
  setTimeout(() => {
    moveNoButton();

    // gi animasjonen tid før vi åpner for ny flytting
    setTimeout(() => {
      isMovingNo = false;
    }, 520);
  }, MOVE_AFTER_MS);
}
/* ---------------------------------------------- */

function onNoAttempt() {
  advanceNoText();
  growYes();

  // På PC: flytt etter delay så du kan lese teksten
  if (isDesktopPointer) {
    scheduleNoMove();
  }
}

yesBtn.addEventListener("click", () => {
  card.classList.add("hidden");
  final.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  // reset tekst
  noIndex = 0;
  noBtn.textContent = noTexts[0];

  // reset yes
  yesScale = 1;
  updateYes();
  yesBtn.classList.remove("too-big");

  // reset no pos
  noBtn.style.position = "static";
  noBtn.style.left = "";
  noBtn.style.top = "";

  // reset flytte-state
  isMovingNo = false;
  lastMoveTs = 0;

  final.classList.add("hidden");
  card.classList.remove("hidden");

  // startpos igjen på PC
  if (isDesktopPointer) {
    setTimeout(() => {
      moveNoButton();
    }, 80);
  }
});

// PC: hover + klikk på No trigger vekst og flytting
if (isDesktopPointer) {
  // Gi No en startpos som ser “planned” ut
  setTimeout(() => moveNoButton(), 80);

  noBtn.addEventListener("mouseenter", onNoAttempt);
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    onNoAttempt();
  });
} else {
  microText.textContent =
    "Mobil-modus: No er trykkbar. Men ja blir større, fordi selvfølgelig.";
  noBtn.addEventListener("click", onNoAttempt);
}

// Init
updateYes();
