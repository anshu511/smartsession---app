let sessionList = document.getElementById("sessionList");
let taskInput = document.getElementById("taskInput");
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let clearHistoryBtn = document.getElementById("clearHistoryBtn");
let statusLabel = document.getElementById("status");
let totalTimeLabel = document.getElementById("totalTime");
let pauseBtn = document.getElementById("pauseBtn");
let weeklyTimeLabel = document.getElementById("weeklyTime");



let sessions = [];
let startTime = null;
let intervalId = null;
let elapsedSeconds = 0;
let isPaused = false;


/* --------- FUNCTIONS --------- */

function updateTimer() {
    elapsedSeconds++;

    let minutes = Math.floor(elapsedSeconds / 60);
    let seconds = elapsedSeconds % 60;

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

function updateWeeklyFocus() {
    let now = new Date();
    let totalSeconds = 0;

    sessions.forEach(session => {
        let sessionDate = new Date(session.timestamp);
        let diffDays = (now - sessionDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= 7) {
            totalSeconds += session.duration;
        }
    });

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    weeklyTimeLabel.textContent =
        "Weekly Focus: " +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

/* --------- LOAD SAVED SESSIONS --------- */

let savedSessions = localStorage.getItem("sessions");
if (savedSessions) {
    sessions = JSON.parse(savedSessions);
    renderSessions();
    updateTotalTimeToday();
    updateWeeklyFocus();
}

/* --------- EVENT LISTENERS --------- */

startBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") {
        alert("Please enter a task name");
        return;
    }

    taskInput.disabled = true;
    elapsedSeconds = 0;
    isPaused = false;

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);

    statusLabel.textContent = "Status: Active";

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
});

pauseBtn.addEventListener("click", () => {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = true;
        pauseBtn.textContent = "Resume";
        statusLabel.textContent = "Status: Paused";
    } else {
        intervalId = setInterval(updateTimer, 1000);
        isPaused = false;
        pauseBtn.textContent = "Pause";
        statusLabel.textContent = "Status: Active";
    }
});

stopBtn.addEventListener("click", () => {
    clearInterval(intervalId);

    sessions.push({
        task: taskInput.value,
        duration: elapsedSeconds,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem("sessions", JSON.stringify(sessions));
    renderSessions();
    updateTotalTimeToday();
    updateWeeklyFocus();

    elapsedSeconds = 0;
    timerDisplay.textContent = "00:00";

    taskInput.disabled = false;
    taskInput.value = "";

    statusLabel.textContent = "Status: Idle";

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    stopBtn.disabled = true;
});

clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Clear all session history?")) {
        sessions = [];
        localStorage.removeItem("sessions");
        renderSessions();
        updateTotalTimeToday();
        updateWeeklyFocus();
    }
});
