/* =========================================================
   COMMANDER04 — RADIO ENGINE
   + SYNCED LYRICS ENGINE
   + TRACK-SPECIFIC FX
   ========================================================= */

"use strict";


/* =========================================================
   TRACK DATABASE
   ========================================================= */

const tracks = [

    {
        title: "Track 01",
        artist: "Commander04",
        file: "music/track1.mp3",
        lyrics: "lyrics/track1.json",

        /*
         * FX ONLY FOR THIS TRACK
         */
        effects: true
    },

    {
        title: "Track 02",
        artist: "Commander04",
        file: "music/track2.mp3",

        effects: false
    },

    {
        title: "Track 03",
        artist: "Commander04",
        file: "music/track3.mp3",

        effects: false
    },

    {
        title: "Track 04",
        artist: "Commander04",
        file: "music/track4.mp3",

        effects: false
    }

];


/* =========================================================
   AUDIO ENGINE
   ========================================================= */

const audio = new Audio();

window.CommanderRadioAudio = audio;

audio.preload = "metadata";

audio.volume = 0.75;


/* =========================================================
   STATE
   ========================================================= */

let currentTrack = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;


/* =========================================================
   FX STATE
   ========================================================= */

/*
 * Only Track 01 is allowed to control visual effects.
 */

window.CommanderEffectsEnabled = true;


/* =========================================================
   LYRICS STATE
   ========================================================= */

let track1Lyrics = [];

let activeLyricIndex = -1;


/* =========================================================
   DOM
   ========================================================= */

const player =
    document.querySelector(
        ".radio-player"
    );


const title =
    document.getElementById(
        "radioTitle"
    );


const artist =
    document.getElementById(
        "radioArtist"
    );


const progress =
    document.getElementById(
        "radioProgress"
    );


const progressBar =
    document.getElementById(
        "radioProgressBar"
    );


const currentTime =
    document.getElementById(
        "radioCurrentTime"
    );


const duration =
    document.getElementById(
        "radioDuration"
    );


const playButton =
    document.querySelector(
        ".radio-play"
    );


const nextButton =
    document.querySelector(
        ".radio-next"
    );


const prevButton =
    document.querySelector(
        ".radio-prev"
    );


const shuffleButton =
    document.querySelector(
        ".radio-shuffle"
    );


const repeatButton =
    document.querySelector(
        ".radio-repeat"
    );


/* =========================================================
   TIME FORMATTER
   ========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remaining
        ).padStart(
            2,
            "0"
        )
    );

}


/* =========================================================
   FX CONTROL
   ========================================================= */

function updateTrackEffects() {

    const track =
        tracks[currentTrack];


    const enabled =
        Boolean(
            track &&
            track.effects === true
        );


    /*
     * Global flag used by effects.js
     */

    window.CommanderEffectsEnabled =
        enabled;


    /*
     * Also expose current track
     * for external systems.
     */

    window.CommanderCurrentTrack =
        currentTrack;


    const root =
        document.documentElement;


    /*
     * Add/remove a CSS state.
     */

    root.classList.toggle(
        "fx-enabled",
        enabled
    );


    root.classList.toggle(
        "fx-disabled",
        !enabled
    );


    /*
     * Reset FX values immediately
     * when switching away from Track 01.
     */

    if (!enabled) {

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

        root.classList.remove(
            "funk-active"
        );

    }


    console.log(
        "[Commander04 FX]",
        enabled
            ? "FX ENABLED — Track 01"
            : "FX DISABLED — Track " +
              String(currentTrack + 1)
    );

}


/* =========================================================
   LOAD LYRICS
   ========================================================= */

async function loadLyrics() {

    try {

        const response =
            await fetch(
                "lyrics/track1.json",
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "track1.json must contain an array"
            );

        }


        track1Lyrics =
            data
                .map(line => {

                    return {

                        time:
                            Number(
                                line.time
                            ),

                        text:
                            String(
                                line.text ?? ""
                            )

                    };

                })
                .filter(line => {

                    return (
                        Number.isFinite(
                            line.time
                        ) &&
                        line.text.trim() !== ""
                    );

                })
                .sort(
                    (a, b) =>
                        a.time - b.time
                );


        console.log(
            "%c[Commander04 Lyrics]",
            "color:#b794ff;font-weight:bold",
            "Loaded:",
            track1Lyrics.length,
            "lines"
        );


    } catch (error) {

        console.error(
            "[Commander04 Lyrics] Failed:",
            error
        );

    }

}


/* =========================================================
   LOAD TRACK
   ========================================================= */

function loadTrack(
    index,
    autoplay = false
) {

    if (
        index < 0 ||
        index >= tracks.length
    ) {

        return;

    }


    currentTrack =
        index;


    const track =
        tracks[currentTrack];


    /*
     * IMPORTANT:
     * Update FX before audio starts.
     */

    updateTrackEffects();


    audio.src =
        track.file;


    audio.load();


    /*
     * Reset lyrics.
     */

    activeLyricIndex = -1;


    /*
     * Update title.
     */

    if (title) {

        title.textContent =
            track.title;

    }


    /*
     * Update artist.
     */

    if (artist) {

        artist.textContent =
            track.artist;

    }


    /*
     * Reset current time.
     */

    if (currentTime) {

        currentTime.textContent =
            "0:00";

    }


    /*
     * Reset duration.
     */

    if (duration) {

        duration.textContent =
            "0:00";

    }


    /*
     * Reset progress.
     */

    if (progressBar) {

        progressBar.style.width =
            "0%";

    }


    /*
     * Clear lyrics.

     */

    clearLyrics();


    console.log(
        "[Commander04 Radio]",
        "Loaded:",
        track.file
    );


    /*
     * Autoplay.
     */

    if (autoplay) {

        playTrack();

    }

}


/* =========================================================
   PLAY
   ========================================================= */

async function playTrack() {

    try {

        await audio.play();


        isPlaying =
            true;


        updatePlayButton();


        if (player) {

            player.classList.add(
                "playing"
            );

        }


        /*
         * Start FX ONLY if current
         * track allows it.
         */

        const track =
            tracks[currentTrack];


        if (
            track &&
            track.effects === true &&
            window.CommanderEffects &&
            typeof
                window.CommanderEffects.start
                === "function"
        ) {

            window.CommanderEffectsEnabled =
                true;

            window.CommanderEffects.start();

        } else {

            window.CommanderEffectsEnabled =
                false;

        }


        console.log(
            "[Commander04 Radio]",
            "▶ Playing:",
            track.title
        );


    } catch (error) {

        isPlaying =
            false;


        updatePlayButton();


        console.error(
            "[Commander04 Radio]",
            "Playback failed:",
            error
        );

    }

}


/* =========================================================
   PAUSE
   ========================================================= */

function pauseTrack() {

    audio.pause();


    isPlaying =
        false;


    updatePlayButton();


    if (player) {

        player.classList.remove(
            "playing"
        );

    }


    /*
     * Disable FX while paused.
     */

    window.CommanderEffectsEnabled =
        false;


    const root =
        document.documentElement;


    root.style.setProperty(
        "--fx-bass",
        "0"
    );

    root.style.setProperty(
        "--fx-scale",
        "1"
    );

    root.style.setProperty(
        "--fx-x",
        "0px"
    );

    root.style.setProperty(
        "--fx-y",
        "0px"
    );


    root.classList.remove(
        "funk-active"
    );


    /*
     * If effects.js has a stop API,
     * use it.
     */

    if (
        window.CommanderEffects &&
        typeof
            window.CommanderEffects.stop
            === "function"
    ) {

        window.CommanderEffects.stop();

    }

}


/* =========================================================
   TOGGLE PLAY
   ========================================================= */

function togglePlay() {

    if (audio.paused) {

        playTrack();

    } else {

        pauseTrack();

    }

}


/* =========================================================
   PLAY BUTTON UI
   ========================================================= */

function updatePlayButton() {

    if (!playButton) {

        return;

    }


    playButton.textContent =
        isPlaying
            ? "❚❚"
            : "▶";

}


/* =========================================================
   NEXT TRACK
   ========================================================= */

function nextTrack() {

    if (shuffle) {

        let next;


        do {

            next =
                Math.floor(
                    Math.random() *
                    tracks.length
                );

        } while (
            tracks.length > 1 &&
            next === currentTrack
        );


        currentTrack =
            next;

    } else {

        currentTrack =
            (
                currentTrack + 1
            ) %
            tracks.length;

    }


    loadTrack(
        currentTrack,
        true
    );

}


/* =========================================================
   PREVIOUS TRACK
   ========================================================= */

function previousTrack() {

    /*
     * Restart current song if
     * more than 3 seconds played.
     */

    if (
        audio.currentTime > 3
    ) {

        audio.currentTime =
            0;

        return;

    }


    currentTrack =
        (
            currentTrack -
            1 +
            tracks.length
        ) %
        tracks.length;


    loadTrack(
        currentTrack,
        true
    );

}


/* =========================================================
   PROGRESS UPDATE
   ========================================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        const percent =
            (
                audio.currentTime /
                audio.duration
            ) *
            100;


        if (progressBar) {

            progressBar.style.width =
                percent + "%";

        }


        if (currentTime) {

            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );

        }


        /*
         * Lyrics only for Track 01.
         */

        if (
            currentTrack === 0
        ) {

            updateLyrics();

        }

    }
);


/* =========================================================
   METADATA
   ========================================================= */

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (duration) {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }

    }
);


/* =========================================================
   CLICK PROGRESS
   ========================================================= */

if (progress) {

    progress.addEventListener(
        "click",
        event => {

            if (
                !audio.duration
            ) {

                return;

            }


            const rect =
                progress.getBoundingClientRect();


            const position =
                event.clientX -
                rect.left;


            const percent =
                position /
                rect.width;


            audio.currentTime =
                percent *
                audio.duration;

        }
    );

}


/* =========================================================
   TRACK ENDED
   ========================================================= */

audio.addEventListener(
    "ended",
    () => {

        if (repeat) {

            audio.currentTime =
                0;

            playTrack();

            return;

        }


        nextTrack();

    }
);


/* =========================================================
   PLAY / PAUSE BUTTON
   ========================================================= */

if (playButton) {

    playButton.addEventListener(
        "click",
        togglePlay
    );

}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        nextTrack
    );

}


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

if (prevButton) {

    prevButton.addEventListener(
        "click",
        previousTrack
    );

}


/* =========================================================
   SHUFFLE
   ========================================================= */

if (shuffleButton) {

    shuffleButton.addEventListener(
        "click",
        () => {

            shuffle =
                !shuffle;


            shuffleButton.classList.toggle(
                "active",
                shuffle
            );


            console.log(
                "[Commander04 Radio]",
                "Shuffle:",
                shuffle
            );

        }
    );

}


/* =========================================================
   REPEAT
   ========================================================= */

if (repeatButton) {

    repeatButton.addEventListener(
        "click",
        () => {

            repeat =
                !repeat;


            repeatButton.classList.toggle(
                "active",
                repeat
            );


            console.log(
                "[Commander04 Radio]",
                "Repeat:",
                repeat
            );

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.tagName ===
                "INPUT" ||
            event.target.tagName ===
                "TEXTAREA"
        ) {

            return;

        }


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            togglePlay();

        }


        if (
            event.code ===
            "ArrowRight"
        ) {

            nextTrack();

        }


        if (
            event.code ===
            "ArrowLeft"
        ) {

            previousTrack();

        }

    }
);


/* =========================================================
   LYRICS — FIND ACTIVE LINE
   ========================================================= */

function updateLyrics() {

    /*
     * Lyrics belong ONLY to Track 01.
     */

    if (
        currentTrack !== 0
    ) {

        return;

    }


    if (
        !track1Lyrics.length
    ) {

        return;

    }


    const time =
        audio.currentTime;


    let newIndex =
        -1;


    for (
        let i = 0;
        i < track1Lyrics.length;
        i++
    ) {

        const line =
            track1Lyrics[i];


        const next =
            track1Lyrics[i + 1];


        if (
            time >= line.time &&
            (
                !next ||
                time < next.time
            )
        ) {

            newIndex =
                i;

            break;

        }

    }


    if (
        newIndex ===
        activeLyricIndex
    ) {

        return;

    }


    activeLyricIndex =
        newIndex;


    if (
        window.CommanderLyrics &&
        typeof
            window.CommanderLyrics.show
            === "function"
    ) {

        if (
            newIndex >= 0
        ) {

            window.CommanderLyrics.show(
                track1Lyrics[
                    newIndex
                ].text
            );

        } else {

            window.CommanderLyrics.show(
                ""
            );

        }

    }

}


/* =========================================================
   CLEAR LYRICS
   ========================================================= */

function clearLyrics() {

    activeLyricIndex =
        -1;


    if (
        window.CommanderLyrics &&
        typeof
            window.CommanderLyrics.show
            === "function"
    ) {

        window.CommanderLyrics.show(
            ""
        );

    }

}


/* =========================================================
   AUDIO PLAY EVENT
   ========================================================= */

audio.addEventListener(
    "play",
    () => {

        isPlaying =
            true;

        updatePlayButton();


        /*
         * Make sure FX state is correct
         * even if audio.play() is triggered
         * from somewhere else.
         */

        const track =
            tracks[currentTrack];


        if (
            track &&
            track.effects === true
        ) {

            window.CommanderEffectsEnabled =
                true;

        } else {

            window.CommanderEffectsEnabled =
                false;

        }

    }
);


/* =========================================================
   AUDIO PAUSE EVENT
   ========================================================= */

audio.addEventListener(
    "pause",
    () => {

        isPlaying =
            false;

        updatePlayButton();

    }
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.CommanderRadio = {

    start: async () => {

        loadTrack(
            0,
            false
        );

        return playTrack();

    },


    play:
        playTrack,


    pause:
        pauseTrack,


    toggle:
        togglePlay,


    next:
        nextTrack,


    previous:
        previousTrack,


    getAudio: () => {

        return audio;

    },


    getCurrentTrack: () => {

        return currentTrack;

    },


    getTracks: () => {

        return tracks;

    },


    /*
     * Useful for effects.js
     */

    effectsEnabled: () => {

        return (
            currentTrack === 0 &&
            !audio.paused
        );

    }

};


/* =========================================================
   INITIAL TRACK
   ========================================================= */

loadTrack(
    0,
    false
);


/* =========================================================
   LOAD LYRICS
   ========================================================= */

loadLyrics();


/* =========================================================
   READY
   ========================================================= */

console.log(
    "%c COMMANDER04 RADIO READY ",
    "color:#b794ff;font-weight:bold"
);