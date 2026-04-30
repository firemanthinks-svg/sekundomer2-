function pad(n) {
    return n < 10 ? "0" + n : n;
}

/* 🔝 REAL VAQT */
let clock = document.getElementById("clock");

function updateClock() {
    let now = new Date();
    clock.innerText =
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

/* MODE */
let mode = "sw";

/* ELEMENTS */
let swBtn = document.getElementById("swBtn");
let tmBtn = document.getElementById("tmBtn");
let stopwatchBox = document.getElementById("stopwatchBox");
let timerBox = document.getElementById("timerBox");

/* TAB */
swBtn.onclick = () => {
    mode = "sw";
    stopwatchBox.classList.remove("hidden");
    timerBox.classList.add("hidden");
    swBtn.classList.add("active");
    tmBtn.classList.remove("active");
};

tmBtn.onclick = () => {
    mode = "tm";
    timerBox.classList.remove("hidden");
    stopwatchBox.classList.add("hidden");
    tmBtn.classList.add("active");
    swBtn.classList.remove("active");
};

/* ⏱ SEKUNDOMER */
let stopwatch = document.getElementById("stopwatch");
let swTime = 0;
let swInterval = null;

function updateSW() {
    let h = Math.floor(swTime / 3600);
    let m = Math.floor((swTime % 3600) / 60);
    let s = swTime % 60;

    stopwatch.innerText = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function startSW() {
    if (!swInterval) {
        swInterval = setInterval(() => {
            swTime++;
            updateSW();
        }, 1000);
    }
}

function pauseSW() {
    clearInterval(swInterval);
    swInterval = null;
}

function resetSW() {
    pauseSW();
    swTime = 0;
    updateSW();
}

/* ⏳ TIMER */
let hours = document.getElementById("hours");
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");
let timer = document.getElementById("timer");

let tmTime = 0;
let tmInterval = null;

function getInputTime() {
    let h = +hours.value || 0;
    let m = +minutes.value || 0;
    let s = +seconds.value || 0;
    return h * 3600 + m * 60 + s;
}

function updateTMDisplay(time) {
    let h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60);
    let s = time % 60;

    timer.innerText = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/* LIVE UPDATE */
[hours, minutes, seconds].forEach(inp => {
    inp.addEventListener("input", () => {
        if (!tmInterval) {
            let t = getInputTime();
            updateTMDisplay(t);
        }
    });
});

/* 🔊 ALERT */
let alarm = document.getElementById("alarmSound");
let customAlert = document.getElementById("customAlert");

function showAlert() {
    customAlert.classList.remove("hidden");
    alarm.currentTime = 0;
    alarm.play();
}

function closeAlert() {
    customAlert.classList.add("hidden");
    alarm.pause();
}

/* TIMER FUNCTIONS */
function startTM() {
    if (tmTime === 0) {
        tmTime = getInputTime();
    }

    if (!tmInterval && tmTime > 0) {
        tmInterval = setInterval(() => {
            tmTime--;
            updateTMDisplay(tmTime);

            if (tmTime <= 0) {
                clearInterval(tmInterval);
                showAlert();
            }
        }, 1000);
    }
}

function pauseTM() {
    clearInterval(tmInterval);
    tmInterval = null;
}

function resetTM() {
    pauseTM();
    tmTime = 0;
    updateTMDisplay(0);
}

/* UNIVERSAL */
function start() {
    mode === "sw" ? startSW() : startTM();
}

function pause() {
    mode === "sw" ? pauseSW() : pauseTM();
}

function reset() {
    mode === "sw" ? resetSW() : resetTM();
}