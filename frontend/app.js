let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");

let startTime = null;
let intervalId = null;

function updateTimer() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);

    let minutes = Math.floor(elapsed / 60);
    let seconds = elapsed % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

startBtn.addEventListener("click", () => {
    startTime = new Date();
    intervalId = setInterval(updateTimer, 1000);

    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
    clearInterval(intervalId);

    startBtn.disabled = false;
    stopBtn.disabled = true;
});
