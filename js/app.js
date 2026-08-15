/* =========================================================
   COMMANDER04 — APPLICATION CORE
   ========================================================= */

"use strict";


/* =========================================================
   APP STATE
   ========================================================= */

const CommanderApp = {

    started: false,

    booted: false,

    version: "C04-V1"

};


/* =========================================================
   DOM
   ========================================================= */

const bootScreen =
    document.getElementById(
        "bootScreen"
    );

const bootEnter =
    document.getElementById(
        "bootEnter"
    );

const bootStatus =
    document.getElementById(
        "bootStatus"
    );


/* =========================================================
   BOOT STATUS
   ========================================================= */

function setBootStatus(
    text
) {

    if (!bootStatus) {

        return;

    }


    bootStatus.textContent =
        text;

}


/* =========================================================
   SYSTEM START
   ========================================================= */

async function startCommanderSystem() {

    if (
        CommanderApp.started
    ) {

        return;

    }


    CommanderApp.started =
        true;


    if (bootEnter) {

        bootEnter.disabled =
            true;

        bootEnter.textContent =
            "INITIALIZING...";

    }


    /* -----------------------------------------
       STEP 01
       ----------------------------------------- */

    setBootStatus(
        "INITIALIZING AUDIO..."
    );


    await wait(
        250
    );


    /* -----------------------------------------
       STEP 02
       ----------------------------------------- */

    setBootStatus(
        "LOADING COMMANDER RADIO..."
    );


    await wait(
        250
    );


    /* -----------------------------------------
       START TRACK 01
       ----------------------------------------- */

    if (
        window.CommanderRadio &&
        typeof
        window.CommanderRadio.start ===
        "function"
    ) {

        try {

    await window.CommanderRadio.start();


    if (
        window.CommanderEffects &&
        typeof window.CommanderEffects.start ===
        "function"
    ) {

        await window.CommanderEffects.start();

    }

} catch (error) {

    console.error(
        "[Commander04]",
        "Audio initialization failed:",
        error
    );

}

    }


    /* -----------------------------------------
       STEP 03
       ----------------------------------------- */

    setBootStatus(
        "STARTING SYSTEM..."
    );


    await wait(
        350
    );


    /* -----------------------------------------
       STEP 04
       ----------------------------------------- */

    setBootStatus(
        "SYSTEM ONLINE"
    );


    await wait(
        450
    );


    CommanderApp.booted =
        true;


    /* -----------------------------------------
       EXIT
       ----------------------------------------- */

    if (bootScreen) {

        bootScreen.classList.add(
            "boot-exit"
        );

    }


    document.body.classList.add(
        "system-active"
    );


    setTimeout(
        () => {

            if (bootScreen) {

                bootScreen.style.display =
                    "none";

            }

        },
        850
    );


    console.log(
        "%c COMMANDER04 SYSTEM ONLINE ",
        "color:#58e6a4;font-weight:bold"
    );

}


/* =========================================================
   ENTER BUTTON
   ========================================================= */

if (bootEnter) {

    bootEnter.addEventListener(
        "click",
        startCommanderSystem
    );

}


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Enter"
        ) {

            return;

        }


        /*
         * If the terminal input is focused,
         * don't start the boot system.
         */

        if (
            event.target.tagName ===
            "INPUT"
        ) {

            return;

        }


        if (
            !CommanderApp.started
        ) {

            startCommanderSystem();

        }

    }
);


/* =========================================================
   NAVIGATION
   ========================================================= */

function scrollToSection(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-scroll]"
            );


        if (!button) {

            return;

        }


        const target =
            button.dataset.scroll;


        if (!target) {

            return;

        }


        scrollToSection(
            target
        );

    }
);


/* =========================================================
   UTILITY
   ========================================================= */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   GLOBAL APP API
   ========================================================= */

window.CommanderApp =
    CommanderApp;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "%c COMMANDER04 APP READY ",
    "color:#b794ff;font-weight:bold"
);