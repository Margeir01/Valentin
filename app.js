const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const microText = document.getElementById("microText");

const card = document.getElementById("card");
const final = document.getElementById("final");
const restartBtn = document.getElementById("restartBtn");

// PC ≈ hover + fin peker
const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Tekstprogresjon som i videoene
const noTexts = [
  "nei",
  "Sikker?",
  "Heeeeeelt sikker?",
  "Vær så snill?",
  "Siste sjanse",
  "Biiiiiitch",
  "Ok, stop",
  "Bare trykk ja"
];

let noIndex = 0;

// Hvor mye Yes vokser per “No”-forsøk
const GROW_STEP = 0.35; // 0.08 = roligere, 0.16 = mer aggressivt
const MAX_SCALE = 50.0;  // tak på hvor stor knappen får bli

let yesScale = 1;

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function updateYes(){
  yesBtn.style.setProperty("--yesScale", yesScale.toFixed(3));
}

function growYes(){
  yesScale = clamp(yesScale + GROW_STEP, 1, MAX_SCALE);
  updateYes();

  if (yesScale >= 6) {
    yesBtn.classList.add("too-big");
  }
}



function advanceNoText(){
  noIndex = clamp(noIndex + 1, 0, noTexts.length - 1);
  noBtn.textContent = noTexts[noIndex];
}

function onNoAttempt(){
  advanceNoText();
  growYes();
}

yesBtn.addEventListener("click", () => {
  card.classList.add("hidden");
  final.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  // reset
  noIndex = 0;
  noBtn.textContent = noTexts[0];
  yesScale = 1;
  updateYes();

  final.classList.add("hidden");
  card.classList.remove("hidden");
});

// PC: hover + klikk på No trigger vekst
if (isDesktopPointer) {

  noBtn.addEventListener("mouseenter", onNoAttempt);
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    onNoAttempt();
  });

} else {
  // Mobil: kun klikk (hover finnes ikke)
  microText.textContent = "Mobil-modus: No er trykkbar. Men Yes blir fortsatt større, selvfølgelig.";
  noBtn.addEventListener("click", onNoAttempt);
}

// Init
updateYes();
