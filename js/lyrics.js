"use strict";

/* =========================================================
   COMMANDER04 — LYRICS UI ENGINE
   ========================================================= */

(function () {

    function getElements() {

        return {

            hud:
                document.getElementById(
                    "lyricsHUD"
                ),

            text:
                document.getElementById(
                    "lyricsText"
                )

        };

    }


    function show(text) {

        const elements =
            getElements();


        if (
            !elements.hud ||
            !elements.text
        ) {

            console.warn(
                "[Commander04 Lyrics] UI not found"
            );

            return;

        }


        if (
            !text ||
            !text.trim()
        ) {

            elements.hud.classList.remove(
                "active"
            );

            elements.text.textContent =
                "";

            return;

        }


        /*
         * Change text.
         */

        elements.text.textContent =
            text;


        /*
         * Trigger visibility.
         */

        elements.hud.classList.add(
            "active"
        );


        /*
         * Restart animation.
         */

        elements.text.classList.remove(
            "lyrics-pop"
        );


        void elements.text.offsetWidth;


        elements.text.classList.add(
            "lyrics-pop"
        );

    }


    function hide() {

        const elements =
            getElements();


        if (!elements.hud) {

            return;

        }


        elements.hud.classList.remove(
            "active"
        );


        if (elements.text) {

            elements.text.textContent =
                "";

        }

    }


    /*
     * Public API
     */

    window.CommanderLyrics = {

        show,
        hide

    };


    console.log(
        "%c COMMANDER04 LYRICS READY ",
        "color:#b794ff;font-weight:bold"
    );

})();