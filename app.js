/* ========= SOUND ========= */
// Fallback for missing audio file
let alarmSound;
try {
    alarmSound = new Audio("./alarm.mp3");
    alarmSound.load();
} catch (e) {
    console.warn("Alarm sound file not found, using beep instead");
    alarmSound = null;
}

function playAlarm() {
    if (alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.play().catch(e => console.log("Audio play failed:", e));
    } else {
        // Fallback beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.5;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
            audioContext.resume();
        } catch (e) {
            alert("⏰ TIME UP!");
        }
    }
}

/* ========= STOPWATCH ========= */
let swTime = 0;
let swInterval = null;

function renderSW() {
    let h = Math.floor(swTime / 3600);
    let m = Math.floor((swTime % 3600) / 60);
    let s = swTime % 60;

    const display = document.getElementById("swDisplay");
    if (display) {
        display.innerText =
            String(h).padStart(2, "0") + ":" +
            String(m).padStart(2, "0") + ":" +
            String(s).padStart(2, "0");
    }
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
    if (swInterval) {
        clearInterval(swInterval);
        swInterval = null;
    }
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

    const display = document.getElementById("tmDisplay");
    if (display) {
        display.innerText =
            String(h).padStart(2, "0") + ":" +
            String(m).padStart(2, "0") + ":" +
            String(s).padStart(2, "0");
    }
}

/* set timer from inputs */
function updateTimer() {
    let hEl = document.getElementById("hour");
    let mEl = document.getElementById("min");
    let sEl = document.getElementById("sec");

    let h = parseInt(hEl.value) || 0;
    let m = parseInt(mEl.value) || 0;
    let s = parseInt(sEl.value) || 0;

    // Validate inputs
    h = Math.min(23, Math.max(0, h));
    m = Math.min(59, Math.max(0, m));
    s = Math.min(59, Math.max(0, s));

    tmTime = h * 3600 + m * 60 + s;
    renderTM();

    // Clear inputs
    hEl.value = "";
    mEl.value = "";
    sEl.value = "";
}

function startTM() {
    if (tmTime > 0 && !tmInterval) {
        tmInterval = setInterval(() => {
            if (tmTime > 0) {
                tmTime--;
                renderTM();

                if (tmTime === 0) {
                    clearInterval(tmInterval);
                    tmInterval = null;
                    playAlarm();

                    const display = document.getElementById("tmDisplay");
                    if (display) {
                        display.innerText = "⏰ TIME UP!";
                        setTimeout(() => renderTM(), 3000);
                    }
                }
            } else {
                clearInterval(tmInterval);
                tmInterval = null;
            }
        }, 1000);
    } else if (tmTime === 0) {
        alert("Please set timer time first using 'Set' button!");
    }
}

function pauseTM() {
    if (tmInterval) {
        clearInterval(tmInterval);
        tmInterval = null;
    }
}

function resetTM() {
    pauseTM();
    tmTime = 0;
    renderTM();

    // Clear input fields
    document.getElementById("hour").value = "";
    document.getElementById("min").value = "";
    document.getElementById("sec").value = "";
}

/* ========= TAB SWITCH ========= */
function showSW() {
    const stopwatch = document.getElementById("stopwatch");
    const timer = document.getElementById("timer");
    const swTab = document.getElementById("swTab");
    const tmTab = document.getElementById("tmTab");

    if (stopwatch) stopwatch.style.display = "block";
    if (timer) timer.style.display = "none";

    if (swTab) swTab.classList.add("active");
    if (tmTab) tmTab.classList.remove("active");
}

function showTM() {
    const stopwatch = document.getElementById("stopwatch");
    const timer = document.getElementById("timer");
    const swTab = document.getElementById("swTab");
    const tmTab = document.getElementById("tmTab");

    if (stopwatch) stopwatch.style.display = "none";
    if (timer) timer.style.display = "block";

    if (tmTab) tmTab.classList.add("active");
    if (swTab) swTab.classList.remove("active");
}

// Initial render
renderSW();
renderTM();

// Prevent negative time inputs
document.getElementById("hour")?.addEventListener("change", function () {
    if (this.value < 0) this.value = 0;
    if (this.value > 23) this.value = 23;
});

document.getElementById("min")?.addEventListener("change", function () {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

document.getElementById("sec")?.addEventListener("change", function () {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});