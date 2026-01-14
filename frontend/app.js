let sessionList = document.getElementById("sessionList");
let taskInput = document.getElementById("taskInput");
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let clearHistoryBtn = document.getElementById("clearHistoryBtn");
let statusLabel = document.getElementById("status");
let totalTimeLabel = document.getElementById("totalTime");

let sessions = [];
let startTime = null;
let intervalId = null;

/* --------- FUNCTIONS --------- */

function updateTimer() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);

    let minutes = Math.floor(elapsed / 60);
    let seconds = elapsed % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function renderSessions() {
    sessionList.innerHTML = "";

    sessions.forEach((session, index) => {
        let li = document.createElement("li");

        let minutes = Math.floor(session.duration / 60);
        let seconds = session.duration % 60;

        li.textContent =
            (index + 1) + ". " +
            session.task + " — " +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0") +
            " (" + new Date(session.timestamp).toLocaleString() + ")";

        sessionList.appendChild(li);
    });
}

function updateTotalTimeToday() {
    let today = new Date().toDateString();
    let totalSeconds = 0;

    sessions.forEach(session => {
        let sessionDate = new Date(session.timestamp).toDateString();
        if (sessionDate === today) {
            totalSeconds += session.duration;
        }
    });

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    totalTimeLabel.textContent =
        "Total Focus Today: " +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

/* --------- LOAD SAVED SESSIONS --------- */

let savedSessions = localStorage.getItem("sessions");
if (savedSessions) {
    sessions = JSON.parse(savedSessions);
    renderSessions();
    updateTotalTimeToday();
}

/* --------- EVENT LISTENERS --------- */

startBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") {
        alert("Please enter a task na
