/* =========================================================
   COMMANDER04 — TERMINAL ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   TERMINAL STATE
   ========================================================= */

const TerminalState = {

    history: [],

    historyIndex: -1,

    busy: false

};


/* =========================================================
   TERMINAL DOM
   ========================================================= */

const terminalOutput =
    document.querySelector(
        ".terminal-output"
    );

const terminalInput =
    document.querySelector(
        ".terminal-input-row input"
    );


/* =========================================================
   TERMINAL PRINT
   ========================================================= */

function terminalPrint(
    text,
    type = "normal"
) {

    if (!terminalOutput) {

        return;

    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        `terminal-line terminal-${type}`;


    line.textContent =
        text;


    terminalOutput.appendChild(
        line
    );


    terminalScroll();


    return line;

}


/* =========================================================
   TYPING EFFECT
   ========================================================= */

async function terminalType(
    text,
    type = "normal",
    speed = 8
) {

    if (!terminalOutput) {

        return;

    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        `terminal-line terminal-${type}`;


    terminalOutput.appendChild(
        line
    );


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        line.textContent +=
            text[i];


        terminalScroll();


        if (
            speed > 0 &&
            text.length < 700
        ) {

            await wait(
                speed
            );

        }

    }


    return line;

}


/* =========================================================
   PROMPT
   ========================================================= */

function terminalPrompt() {

    if (!terminalOutput) {

        return;

    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        "terminal-prompt";


    line.innerHTML =
        `<span>guest@commander04</span><b>:</b><i>~</i><b>$</b>`;


    terminalOutput.appendChild(
        line
    );


    terminalScroll();

}


/* =========================================================
   COMMAND ECHO
   ========================================================= */

function terminalCommandEcho(
    command
) {

    if (!terminalOutput) {

        return;

    }


    const line =
        document.createElement(
            "div"
        );


    line.className =
        "terminal-command";


    line.textContent =
        `> ${command}`;


    terminalOutput.appendChild(
        line
    );


    terminalScroll();

}


/* =========================================================
   EXECUTE
   ========================================================= */

async function runTerminalCommand(
    command
) {

    const clean =
        command.trim();


    if (!clean) {

        return;

    }


    /*
     * Save command history
     */

    if (
        TerminalState.history[
            TerminalState.history.length - 1
        ] !== clean
    ) {

        TerminalState.history.push(
            clean
        );

    }


    TerminalState.historyIndex =
        TerminalState.history.length;


    terminalCommandEcho(
        clean
    );


    /*
     * Execute command
     */

    const result =
        window.executeCommanderCommand
            ? window.executeCommanderCommand(
                clean
            )
            : null;


    if (!result) {

        await terminalType(
            "Command engine unavailable.",
            "error"
        );

        return;

    }


    /*
     * CLEAR
     */

    if (
        result.clear
    ) {

        clearTerminal();

        terminalPrompt();

        return;

    }


    /*
     * OUTPUT
     */

    if (
        result.output
    ) {

        const speed =
            result.type === "error"
                ? 3
                : 4;


        await terminalType(
            result.output,
            result.type,
            speed
        );

    }


    terminalPrompt();

}


/* =========================================================
   CLEAR TERMINAL
   ========================================================= */

function clearTerminal() {

    if (!terminalOutput) {

        return;

    }


    terminalOutput.innerHTML =
        "";

}


/* =========================================================
   AUTO SCROLL
   ========================================================= */

function terminalScroll() {

    if (!terminalOutput) {

        return;

    }


    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;

}


/* =========================================================
   INPUT HANDLER
   ========================================================= */

if (terminalInput) {

    terminalInput.addEventListener(
        "keydown",
        async event => {

            /*
             * ENTER
             */

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                if (
                    TerminalState.busy
                ) {

                    return;

                }


                const command =
                    terminalInput.value;


                terminalInput.value =
                    "";


                if (
                    !command.trim()
                ) {

                    terminalPrompt();

                    return;

                }


                TerminalState.busy =
                    true;


                terminalInput.disabled =
                    true;


                try {

                    await runTerminalCommand(
                        command
                    );

                } finally {

                    TerminalState.busy =
                        false;

                    terminalInput.disabled =
                        false;

                    terminalInput.focus();

                }

            }


            /*
             * ARROW UP
             */

            if (
                event.key ===
                "ArrowUp"
            ) {

                event.preventDefault();


                if (
                    TerminalState.history.length ===
                    0
                ) {

                    return;

                }


                TerminalState.historyIndex =
                    Math.max(
                        0,
                        TerminalState.historyIndex - 1
                    );


                terminalInput.value =
                    TerminalState.history[
                        TerminalState.historyIndex
                    ];

            }


            /*
             * ARROW DOWN
             */

            if (
                event.key ===
                "ArrowDown"
            ) {

                event.preventDefault();


                if (
                    TerminalState.history.length ===
                    0
                ) {

                    return;

                }


                TerminalState.historyIndex =
                    Math.min(
                        TerminalState.history.length,
                        TerminalState.historyIndex + 1
                    );


                terminalInput.value =
                    TerminalState.history[
                        TerminalState.historyIndex
                    ] || "";

            }

        }
    );

}


/* =========================================================
   TERMINAL CLICK → FOCUS
   ========================================================= */

if (terminalOutput) {

    terminalOutput.addEventListener(
        "click",
        () => {

            if (
                terminalInput &&
                !terminalInput.disabled
            ) {

                terminalInput.focus();

            }

        }
    );

}


/* =========================================================
   MOBILE TOUCH SUPPORT
   ========================================================= */

document.addEventListener(
    "touchstart",
    event => {

        if (!terminalInput) {

            return;

        }


        const terminal =
            event.target.closest(
                ".terminal"
            );


        if (
            terminal
        ) {

            setTimeout(
                () => {

                    terminalInput.focus();

                },
                50
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   BOOT MESSAGE
   ========================================================= */

function terminalBoot() {

    if (!terminalOutput) {

        return;

    }


    terminalOutput.innerHTML =
        "";


    terminalType(
        `COMMANDER04 TERMINAL
────────────────────────────────

System initialized.

Type "help" to see available commands.

`,
        "normal",
        3
    ).then(
        terminalPrompt
    );

}


/* =========================================================
   WAIT
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
   PUBLIC API
   ========================================================= */

window.CommanderTerminal = {

    print:
        terminalPrint,

    type:
        terminalType,

    clear:
        clearTerminal,

    execute:
        runTerminalCommand,

    focus:
        () => {

            if (
                terminalInput
            ) {

                terminalInput.focus();

            }

        }

};


/* =========================================================
   START
   ========================================================= */

terminalBoot();


console.log(
    "%c COMMANDER04 TERMINAL READY ",
    "color:#b794ff;font-weight:bold"
);