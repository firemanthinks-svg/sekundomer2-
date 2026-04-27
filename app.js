/* ========= SOUND ========= */
const alarmSound = new Audio("./alarm.mp3");


/* ========= STOPWATCH ========= */
let swTime = 0;
let swInterval = null;

function renderSW() {
    let h = Math.floor(swTime / 3600);
    let m = Math.floor((swTime % 3600) / 60);
    let s = swTime % 60;

    document.getElementById("swDisplay").innerText =
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");
}

function startSW() {
    if (!swInterval) {
        swInterval = setInterval(() => {
            swTime++;
            renderSW();
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
    renderSW();
}


/* ========= TIMER ========= */
let tmTime = 0;
let tmInterval = null;

function renderTM() {
    let h = Math.floor(tmTime / 3600);
    let m = Math.floor((tmTime % 3600) / 60);
    let s = tmTime % 60;

    document.getElementById("tmDisplay").innerText =
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");
}

/* set timer from inputs */
function updateTimer() {
    let hEl = document.getElementById("hour");
    let mEl = document.getElementById("min");
    let sEl = document.getElementById("sec");

    let h = parseInt(hEl.value) || 0;
    let m = parseInt(mEl.value) || 0;
    let s = parseInt(sEl.value) || 0;

    tmTime = h * 3600 + m * 60 + s;
    renderTM();

    // inputlarni tozalash
    hEl.value = "";
    mEl.value = "";
    sEl.value = "";
}

function startTM() {
    if (tmTime > 0 && !tmInterval) {
        tmInterval = setInterval(() => {
            tmTime--;
            renderTM();

            if (tmTime <= 0) {
                clearInterval(tmInterval);
                tmInterval = null;

                // 🔊 sound play
                alarmSound.currentTime = 0;
                alarmSound.play();

                document.getElementById("tmDisplay").innerText = "⏰ TIME UP!";
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

    document.getElementById("tmDisplay").innerText = "00:00:00";

    document.getElementById("hour").value = "";
    document.getElementById("min").value = "";
    document.getElementById("sec").value = "";
}


/* ========= TAB SWITCH ========= */
function showSW() {
    document.getElementById("stopwatch").style.display = "block";
    document.getElementById("timer").style.display = "none";

    document.getElementById("swTab").classList.add("active");
    document.getElementById("tmTab").classList.remove("active");
}

function showTM() {
    document.getElementById("stopwatch").style.display = "none";
    document.getElementById("timer").style.display = "block";

    document.getElementById("tmTab").classList.add("active");
    document.getElementById("swTab").classList.remove("active");
}