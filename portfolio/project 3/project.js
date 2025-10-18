const taskInput = document.getElementById("taskInput");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const timerDisplay = document.getElementById("timerDisplay");
const taskList = document.getElementById("taskList");

let timer = null;
let seconds = 0;
let currentTask = "";
let isRunning = false;

function updateTimer() {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${mins}:${secs}`;
}

startBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (!task) {
    alert("Please enter a task first!");
    return;
  }
  currentTask = task;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  stopBtn.classList.remove("inactive");
  isRunning = true;
  taskInput.disabled = true;
  timer = setInterval(updateTimer, 1000);
});
// We'll implement escape-on-hover for the inactive Stop button.
// Helper: move the stop button to a random position inside its parent
function moveStopToRandomPosition() {
  const parent = stopBtn.parentElement;
  const parentRect = parent.getBoundingClientRect();
  const btnRect = stopBtn.getBoundingClientRect();

  const padding = 6; // small inset from edges
  const maxX = parentRect.width - btnRect.width - padding;
  const maxY = parentRect.height - btnRect.height - padding;
  const randInt = (n) => Math.floor(Math.random() * (n + 1));

  const left = padding + randInt(Math.max(0, Math.floor(maxX)));
  const top = padding + randInt(Math.max(0, Math.floor(maxY)));

  stopBtn.style.left = left + 'px';
  stopBtn.style.top = top + 'px';
}

// set initial absolute position matching the button's normal flow
function captureInitialStopPosition() {
  const rect = stopBtn.getBoundingClientRect();
  const parentRect = stopBtn.parentElement.getBoundingClientRect();
  const left = rect.left - parentRect.left;
  const top = rect.top - parentRect.top;
  stopBtn.style.left = left + 'px';
  stopBtn.style.top = top + 'px';
}

// ensure initial positioning is captured on load
window.addEventListener('load', () => {
  if (stopBtn.classList.contains('inactive')) {
    // small timeout to ensure layout finished
    setTimeout(captureInitialStopPosition, 40);
  }
});

// Escape on hover and focus while inactive
stopBtn.addEventListener('mouseenter', () => {
  if (stopBtn.classList.contains('inactive')) moveStopToRandomPosition();
});
stopBtn.addEventListener('focus', () => {
  if (stopBtn.classList.contains('inactive')) moveStopToRandomPosition();
});

// Normal click handler when running
stopBtn.addEventListener('click', () => {
  if (!isRunning) return; // ignore clicks when inactive (they'll be dodged)
  clearInterval(timer);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const li = document.createElement("li");
  li.textContent = `${currentTask} — ${mins}m ${secs}s`;
  taskList.appendChild(li);

  // reset
  seconds = 0;
  timerDisplay.textContent = "00:00";
  startBtn.disabled = false;
  stopBtn.disabled = true;
  // put stop back into inactive/dodging mode
  stopBtn.classList.add("inactive");
  // capture its initial position for future dodges
  setTimeout(captureInitialStopPosition, 40);
  taskInput.disabled = false;
  taskInput.value = "";
  isRunning = false;
});
