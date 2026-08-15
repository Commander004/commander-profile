"use strict";

/* =========================================================
   COMMANDER04 — TRACK 01 ONLY FX ENGINE
   ========================================================= */

const root = document.documentElement;


const FX = {

    audio: null,

    ctx: null,

    analyser: null,

    source: null,

    data: null,

    ready: false,

    animationStarted: false,

    smoothBass: 0,

    smoothMid: 0,

    smoothHigh: 0

};


/* =========================================================
   INITIAL STATE
   ========================================================= */

/*
 * FX is allowed by default because
 * the initial track is Track 01.
 */

if (
    typeof window.CommanderEffectsEnabled ===
    "undefined"
) {

    window.CommanderEffectsEnabled = true;

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initFX() {

    /*
     * Already initialized.
     */

    if (FX.ready) {

        return true;

    }


    const audio =
        window.CommanderRadioAudio;


    if (!audio) {

        console.error(
            "[FX] CommanderRadioAudio پیدا نشد."
        );

        return false;

    }


    FX.audio =
        audio;


    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        console.error(
            "[FX] Web Audio API پشتیبانی نمی‌شود."
        );

        return false;

    }


    try {

        FX.ctx =
            new AudioContext();


        FX.analyser =
            FX.ctx.createAnalyser();


        /*
         * Higher FFT = smoother frequency analysis.
         */

        FX.analyser.fftSize =
            512;


        /*
         * Higher smoothing =
         * less aggressive movement.
         */

        FX.analyser.smoothingTimeConstant =
            0.82;


        FX.data =
            new Uint8Array(
                FX.analyser.frequencyBinCount
            );


        FX.source =
            FX.ctx.createMediaElementSource(
                audio
            );


        FX.source.connect(
            FX.analyser
        );


        FX.analyser.connect(
            FX.ctx.destination
        );


        FX.ready =
            true;


        console.log(
            "%c[FX] AUDIO ANALYSER CONNECTED",
            "color:#b794ff;font-weight:bold"
        );


        return true;

    } catch (error) {

        console.error(
            "[FX] Audio connection failed:",
            error
        );


        return false;

    }

}


/* =========================================================
   START
   ========================================================= */

async function startFX() {

    /*
     * NEVER start FX for another track.
     */

    if (
        window.CommanderEffectsEnabled !== true
    ) {

        resetFX();

        return;

    }


    /*
     * Make absolutely sure
     * current track is Track 01.
     */

    if (
        window.CommanderRadio &&
        typeof
            window.CommanderRadio.getCurrentTrack
            === "function"
    ) {

        if (
            window.CommanderRadio.getCurrentTrack() !== 0
        ) {

            resetFX();

            return;

        }

    }


    /*
     * Initialize analyser.
     */

    if (!FX.ready) {

        if (!initFX()) {

            return;

        }

    }


    /*
     * Resume AudioContext.
     */

    if (
        FX.ctx &&
        FX.ctx.state === "suspended"
    ) {

        try {

            await FX.ctx.resume();

        } catch (error) {

            console.warn(
                "[FX] AudioContext resume failed.",
                error
            );

        }

    }


    /*
     * Start animation loop only once.
     */

    if (!FX.animationStarted) {

        FX.animationStarted =
            true;


        requestAnimationFrame(
            loop
        );

    }

}


/* =========================================================
   SMOOTH
   ========================================================= */

function smooth(
    current,
    target,
    amount
) {

    return (
        current +
        (
            target -
            current
        ) *
        amount
    );

}


/* =========================================================
   FREQUENCY AVERAGE
   ========================================================= */

function average(
    start,
    end
) {

    let total = 0;

    let count = 0;


    for (
        let i = start;
        i < end;
        i++
    ) {

        total +=
            FX.data[i];


        count++;

    }


    if (!count) {

        return 0;

    }


    return (
        total /
        count /
        255
    );

}


/* =========================================================
   RESET FX
   ========================================================= */

function resetFX() {

    FX.smoothBass =
        0;


    FX.smoothMid =
        0;


    FX.smoothHigh =
        0;


    /*
     * Reset CSS values.
     */

    root.style.setProperty(
        "--fx-bass",
        "0"
    );


    root.style.setProperty(
        "--fx-scale",
        "1"
    );


    root.style.setProperty(
        "--fx-glow",
        "0.05"
    );


    root.style.setProperty(
        "--fx-x",
        "0px"
    );


    root.style.setProperty(
        "--fx-y",
        "0px"
    );


    /*
     * Remove visual state.
     */

    root.classList.remove(
        "funk-active"
    );


    root.classList.remove(
        "fx-enabled"
    );


    root.classList.add(
        "fx-disabled"
    );


    /*
     * Remove debug values.
     */

    delete root.dataset.trackTime;

    delete root.dataset.bass;

}


/* =========================================================
   CHECK FX PERMISSION
   ========================================================= */

function canRunFX() {

    /*
     * Global permission.
     */

    if (
        window.CommanderEffectsEnabled !== true
    ) {

        return false;

    }


    /*
     * Check current radio track.
     */

    if (
        window.CommanderRadio &&
        typeof
            window.CommanderRadio.getCurrentTrack
            === "function"
    ) {

        const index =
            window.CommanderRadio.getCurrentTrack();


        /*
         * Track 01 = index 0.
         */

        if (
            index !== 0
        ) {

            return false;

        }

    }


    /*
     * Check actual audio state.
     */

    if (
        !FX.audio ||
        FX.audio.paused
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   MAIN LOOP
   ========================================================= */

function loop() {

    /*
     * =====================================================
     * FX PERMISSION CHECK
     * =====================================================
     */

    if (
        !canRunFX()
    ) {

        resetFX();


        requestAnimationFrame(
            loop
        );


        return;

    }


    /*
     * =====================================================
     * AUDIO ANALYSIS
     * =====================================================
     */

    FX.analyser.getByteFrequencyData(
        FX.data
    );


    /*
     * Bass
     */

    const bass =
        average(
            0,
            Math.floor(
                FX.data.length * 0.10
            )
        );


    /*
     * Mid
     */

    const mid =
        average(
            Math.floor(
                FX.data.length * 0.10
            ),
            Math.floor(
                FX.data.length * 0.40
            )
        );


    /*
     * High
     */

    const high =
        average(
            Math.floor(
                FX.data.length * 0.40
            ),
            FX.data.length
        );


    /*
     * Smooth bass.
     *
     * Lower values = smoother.
     */

    FX.smoothBass =
        smooth(
            FX.smoothBass,
            bass,
            0.07
        );


    FX.smoothMid =
        smooth(
            FX.smoothMid,
            mid,
            0.055
        );


    FX.smoothHigh =
        smooth(
            FX.smoothHigh,
            high,
            0.045
        );


    /* =====================================================
       TRACK TIME
       ===================================================== */

    const time =
        FX.audio.currentTime;


    let timeline;


    /*
     * =====================================================
     * 0 → 3
     *
     * Very calm.
     * =====================================================
     */

    if (
        time < 3
    ) {

        timeline =
            0.05;

    }


    /*
     * =====================================================
     * 3 → 5
     *
     * Smooth build.
     * =====================================================
     */

    else if (
        time < 5
    ) {

        const progress =
            (
                time - 3
            ) /
            2;


        /*
         * Smooth easing.
         */

        const eased =
            progress *
            progress *
            (
                3 -
                2 *
                progress
            );


        timeline =
            0.05 +
            eased *
            0.35;

    }


    /*
     * =====================================================
     * 5+
     *
     * FUNK MODE
     * =====================================================
     */

    else {

        timeline =
            0.40;

    }


    /* =====================================================
       AUDIO POWER
       ===================================================== */

    const audioPower =
        (
            FX.smoothBass *
            0.65
        ) +
        (
            FX.smoothMid *
            0.25
        ) +
        (
            FX.smoothHigh *
            0.10
        );


    /*
     * Keep the overall effect restrained.
     */

    const power =
        Math.min(
            0.65,
            audioPower +
            timeline *
            0.30
        );


    /* =====================================================
       BASS VARIABLE
       ===================================================== */

    root.style.setProperty(
        "--fx-bass",
        power.toFixed(3)
    );


    /* =====================================================
       VISUAL SCALE
       ===================================================== */

    /*
     * Very small scale change.
     *
     * This prevents the page from looking
     * like it's constantly jumping.
     */

    const scale =
        1 +
        power *
        0.006;


    root.style.setProperty(
        "--fx-scale",
        scale.toFixed(4)
    );


    /* =====================================================
       GLOW
       ===================================================== */

    const glow =
        0.06 +
        power *
        0.28;


    root.style.setProperty(
        "--fx-glow",
        glow.toFixed(3)
    );


    /* =====================================================
       MICRO MOVEMENT
       ===================================================== */

    const now =
        performance.now();


    /*
     * Slow waves.
     *
     * Much slower than the previous version.
     */

    const waveX =
        Math.sin(
            now *
            0.00055
        );


    const waveY =
        Math.cos(
            now *
            0.00045
        );


    /*
     * Very small movement.
     */

    const movement =
        Math.min(
            power,
            0.5
        );


    const x =
        waveX *
        movement *
        0.7;


    const y =
        waveY *
        movement *
        0.45;


    root.style.setProperty(
        "--fx-x",
        x.toFixed(2) +
        "px"
    );


    root.style.setProperty(
        "--fx-y",
        y.toFixed(2) +
        "px"
    );


    /* =====================================================
       FX STATE
       ===================================================== */

    root.classList.add(
        "fx-enabled"
    );


    root.classList.remove(
        "fx-disabled"
    );


    /* =====================================================
       FUNK CLASS
       ===================================================== */

    if (
        time >= 5
    ) {

        root.classList.add(
            "funk-active"
        );

    } else {

        root.classList.remove(
            "funk-active"
        );

    }


    /* =====================================================
       DEBUG
       ===================================================== */

    root.dataset.trackTime =
        time.toFixed(2);


    root.dataset.bass =
        power.toFixed(2);


    /* =====================================================
       NEXT FRAME
       ===================================================== */

    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   STOP
   ========================================================= */

function stopFX() {

    resetFX();

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.CommanderEffects = {

    start:
        startFX,

    stop:
        stopFX,

    init:
        initFX,

    reset:
        resetFX

};


/* =========================================================
   READY
   ========================================================= */

console.log(
    "%c[FX] COMMANDER04 TRACK 01 FX READY",
    "color:#8b5cf6;font-weight:bold"
);