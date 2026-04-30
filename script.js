/* ========= HELPER ========= */
function pad(n) {
    return n < 10 ? "0" + n : n;
}

/* ========= ELEMENTS ========= */
let clock = document.getElementById("clock");

let swBtn = document.getElementById("swBtn");
let tmBtn = document.getElementById("tmBtn");

let stopwatchBox = document.getElementById("stopwatchBox");
let timerBox = document.getElementById("timerBox");

let stopwatch = document.getElementById("stopwatch");

let hours = document.getElementById("hours");
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");

let timer = document.getElementById("timer");

let alarm = document.getElementById("alarmSound");
let customAlert = document.getElementById("customAlert");

/* ========= REAL TIME CLOCK ========= */
function updateClock() {
    let now = new Date();
    clock.innerText =
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ========= MODE ========= */
let mode = "sw";

/* ========= TAB SWITCH ========= */
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

/* ========= ⏱ SEKUNDOMER ========= */
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

/* ========= ⏳ TIMER ========= */
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

/* 🔥 LIVE INPUT UPDATE */
[hours, minutes, seconds].forEach(inp => {
    inp.addEventListener("input", () => {
        if (!tmInterval) {
            let t = getInputTime();
            updateTMDisplay(t);
        }
    });
});

/* ========= 🔊 ALERT ========= */
function showAlert() {
    customAlert.classList.remove("hidden");

    alarm.currentTime = 0;
    alarm.loop = true;   // 🔥 ovoz qayta-qayta chaladi
    alarm.play();
}

function closeAlert() {
    customAlert.classList.add("hidden");

    alarm.pause();
    alarm.loop = false;
}

/* ========= TIMER CONTROL ========= */
function startTM() {
    // eski intervalni tozalaymiz
    if (tmInterval) {
        clearInterval(tmInterval);
        tmInterval = null;
    }

    tmTime = getInputTime();

    if (tmTime > 0) {
        updateTMDisplay(tmTime);

        tmInterval = setInterval(() => {
            tmTime--;
            updateTMDisplay(tmTime);

            if (tmTime <= 0) {
                clearInterval(tmInterval);
                tmInterval = null;

                showAlert(); // 🔥 popup + ovoz
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
    closeAlert();
}

/* ========= UNIVERSAL BUTTONS ========= */
function start() {
    if (mode === "sw") {
        startSW();
    } else {
        startTM();
    }
}

function pause() {
    if (mode === "sw") {
        pauseSW();
    } else {
        pauseTM();
    }
}

function reset() {
    if (mode === "sw") {
        resetSW();
    } else {
        resetTM();
    }
}