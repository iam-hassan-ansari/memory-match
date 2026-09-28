/* =========================================================
   Memory Match (Demo)
   Card-flip matching game. Vanilla JS, no libraries.
   ========================================================= */

const SYMBOLS = ["🚗", "🏍️", "🚕", "🚙", "🚌", "🚓", "🚑", "🚒", "🚜", "🏎️", "🛺", "🚐", "🚚", "🚲", "🛵", "🚂", "✈️", "⛵"];

const KEY_PREFIX = "memorymatch_best_";

let grid = { rows: 4, cols: 4 };
let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;
let timerSeconds = 0;
let timerHandle = null;
let locked = false;
let started = false;

function parseDifficulty(value) {
  const [cols, rows] = value.split("x").map(Number);
  return { rows, cols };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bestKey() { return KEY_PREFIX + grid.cols + "x" + grid.rows; }

function updateBestDisplay() {
  const best = localStorage.getItem(bestKey());
  document.getElementById("best").textContent = best ? best + " moves" : "—";
}

function startTimer() {
  stopTimer();
  timerSeconds = 0;
  timerHandle = setInterval(() => {
    timerSeconds += 1;
    document.getElementById("timer").textContent = timerSeconds + "s";
  }, 1000);
}
function stopTimer() { if (timerHandle) clearInterval(timerHandle); timerHandle = null; }

function newGame() {
  const value = document.getElementById("difficulty").value;
  grid = parseDifficulty(value);
  const totalCards = grid.rows * grid.cols;
  const pairsNeeded = totalCards / 2;
  const chosenSymbols = shuffle(SYMBOLS).slice(0, pairsNeeded);
  const deck = shuffle([...chosenSymbols, ...chosenSymbols]).map((sym, i) => ({ id: i, sym, matched: false }));

  cards = deck;
  flipped = [];
  matchedCount = 0;
  moves = 0;
  locked = false;
  started = false;
  stopTimer();
  document.getElementById("timer").textContent = "0s";
  document.getElementById("moves").textContent = "0";
  document.getElementById("win-banner").style.display = "none";
  updateBestDisplay();
  renderBoard();
}

function renderBoard() {
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${grid.cols}, 1fr)`;
  board.innerHTML = "";
  cards.forEach((card) => {
    const tile = document.createElement("div");
    tile.className = "card-tile" + (card.matched ? " matched" : "") + (flipped.includes(card.id) ? " flipped" : "");
    tile.dataset.id = card.id;
    tile.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">?</div>
        <div class="card-face card-front">${card.sym}</div>
      </div>`;
    tile.addEventListener("click", () => handleFlip(card.id));
    board.appendChild(tile);
  });
}

function handleFlip(id) {
  if (locked) return;
  const card = cards.find((c) => c.id === id);
  if (!card || card.matched || flipped.includes(id)) return;
  if (!started) { started = true; startTimer(); }

  flipped.push(id);
  renderBoard();

  if (flipped.length === 2) {
    moves += 1;
    document.getElementById("moves").textContent = moves;
    locked = true;
    const [aId, bId] = flipped;
    const a = cards.find((c) => c.id === aId);
    const b = cards.find((c) => c.id === bId);
    if (a.sym === b.sym) {
      a.matched = true; b.matched = true;
      matchedCount += 2;
      flipped = [];
      locked = false;
      renderBoard();
      if (matchedCount === cards.length) onWin();
    } else {
      setTimeout(() => { flipped = []; locked = false; renderBoard(); }, 700);
    }
  }
}

function onWin() {
  stopTimer();
  const best = Number(localStorage.getItem(bestKey()) || Infinity);
  const isNewBest = moves < best;
  if (isNewBest) localStorage.setItem(bestKey(), String(moves));
  updateBestDisplay();

  document.getElementById("win-moves").textContent = moves;
  document.getElementById("win-time").textContent = timerSeconds + "s";
  document.getElementById("win-best").textContent = isNewBest ? "🏆 New best!" : "";
  document.getElementById("win-banner").style.display = "block";
}

document.getElementById("btn-new").addEventListener("click", newGame);
document.getElementById("difficulty").addEventListener("change", newGame);

newGame();
