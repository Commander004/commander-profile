/* =========================================================
   COMMANDER04 — COMMAND DATABASE
   ========================================================= */

"use strict";


/* =========================================================
   COMMAND HELPERS
   ========================================================= */

function commandResult(
    output,
    type = "normal"
) {

    return {

        output,

        type

    };

}


/* =========================================================
   COMMANDS
   ========================================================= */

const CommanderCommands = {

    /* -----------------------------------------------------
       HELP
       ----------------------------------------------------- */

    help() {

        return commandResult(`

COMMANDER04 TERMINAL
────────────────────────────────

AVAILABLE COMMANDS

  help        Show this menu
  about       About Commander04
  whoami      Current user information
  status      System status
  projects    Show projects
  skills      Show skills
  radio       Control the radio
  github      GitHub information
  clear       Clear terminal
  system      System information
  time        Current local time
  date        Current date
  echo        Print text

SPECIAL

  matrix      Enter the matrix
  commander   Commander04 system info

────────────────────────────────

Type a command to continue.

`);

    },


    /* -----------------------------------------------------
       ABOUT
       ----------------------------------------------------- */

    about() {

        return commandResult(`

COMMANDER04
────────────────────────────────

Programmer • Editor • Creator

A personal digital space built around
code, music, creativity and experiments.

SYSTEM:
  Commander04 Core

BUILD:
  C04-V1

MODE:
  Creative / Development

STATUS:
  Online

`);

    },


    /* -----------------------------------------------------
       WHOAMI
       ----------------------------------------------------- */

    whoami() {

        return commandResult(`

USER PROFILE
────────────────────────────────

USERNAME:
  commander04

ROLE:
  Programmer • Editor • Creator

LOCATION:
  Iran 🇮🇷

STATUS:
  Online

CLEARANCE:
  USER

`);

    },


    /* -----------------------------------------------------
       STATUS
       ----------------------------------------------------- */

    status() {

        const online =
            navigator.onLine
                ? "ONLINE"
                : "OFFLINE";


        return commandResult(`

SYSTEM STATUS
────────────────────────────────

CORE:
  ONLINE

NETWORK:
  ${online}

RADIO:
  ${getRadioStatus()}

TERMINAL:
  ONLINE

ENGINE:
  COMMANDER04

VERSION:
  C04-V1

`);

    },


    /* -----------------------------------------------------
       PROJECTS
       ----------------------------------------------------- */

    projects() {

        return commandResult(`

PROJECT ARCHIVE
────────────────────────────────

[01] Commander04 Website
     Personal portfolio / profile

[02] Empire Bot
     Economy & game system

[03] Commander Messenger
     Experimental messaging system

[04] Commander MTA
     Multi Theft Auto server project

[05] The Maze
     2D survival maze game

STATUS:
  ACTIVE DEVELOPMENT

`);

    },


    /* -----------------------------------------------------
       SKILLS
       ----------------------------------------------------- */

    skills() {

        return commandResult(`

SKILL MATRIX
────────────────────────────────

Python              █████████░ 90%

HTML / CSS          █████████░ 90%

JavaScript          ████████░░ 80%

Flask               ███████░░░ 70%

Git / GitHub        ████████░░ 80%

Game Development    ███████░░░ 70%

UI / UX             ████████░░ 80%

`);

    },


    /* -----------------------------------------------------
       RADIO
       ----------------------------------------------------- */

    radio(args = []) {

        const action =
            args[0]?.toLowerCase();


        if (
            !window.CommanderRadio
        ) {

            return commandResult(
                "Radio engine is not available.",
                "error"
            );

        }


        switch (action) {

            case "play":

                window.CommanderRadio.play();

                return commandResult(
                    "Radio ▶ PLAY"
                );


            case "pause":

                window.CommanderRadio.pause();

                return commandResult(
                    "Radio ❚❚ PAUSE"
                );


            case "next":

                window.CommanderRadio.next();

                return commandResult(
                    "Radio ⏭ NEXT TRACK"
                );


            case "previous":

                window.CommanderRadio.previous();

                return commandResult(
                    "Radio ⏮ PREVIOUS TRACK"
                );


            case "status":

                return commandResult(
                    `Radio: ${getRadioStatus()}`
                );


            default:

                return commandResult(`

RADIO COMMANDS
────────────────────────────────

  radio play
  radio pause
  radio next
  radio previous
  radio status

`);

        }

    },


    /* -----------------------------------------------------
       GITHUB
       ----------------------------------------------------- */

    github() {

        return commandResult(`

GITHUB
────────────────────────────────

COMMANDER04

Repository:
  Available through profile links

Deployment:
  GitHub Pages

Platform:
  GitHub

`);

    },


    /* -----------------------------------------------------
       SYSTEM
       ----------------------------------------------------- */

    system() {

        return commandResult(`

COMMANDER04 SYSTEM
────────────────────────────────

OS:
  ${navigator.platform}

BROWSER:
  ${navigator.userAgent}

LANGUAGE:
  ${navigator.language}

SCREEN:
  ${window.innerWidth} × ${window.innerHeight}

ONLINE:
  ${navigator.onLine}

CORES:
  ${navigator.hardwareConcurrency || "N/A"}

`);

    },


    /* -----------------------------------------------------
       TIME
       ----------------------------------------------------- */

    time() {

        const now =
            new Date();


        return commandResult(`

LOCAL TIME
────────────────────────────────

${now.toLocaleTimeString()}

`);

    },


    /* -----------------------------------------------------
       DATE
       ----------------------------------------------------- */

    date() {

        const now =
            new Date();


        return commandResult(`

LOCAL DATE
────────────────────────────────

${now.toLocaleDateString()}

`);

    },


    /* -----------------------------------------------------
       ECHO
       ----------------------------------------------------- */

    echo(args = []) {

        if (
            args.length === 0
        ) {

            return commandResult(
                "Usage: echo <text>",
                "error"
            );

        }


        return commandResult(
            args.join(" ")
        );

    },


    /* -----------------------------------------------------
       COMMANDER
       ----------------------------------------------------- */

    commander() {

        return commandResult(`

╔══════════════════════════════╗
║       COMMANDER04 CORE       ║
╠══════════════════════════════╣
║                              ║
║  SYSTEM      ONLINE          ║
║  RADIO       READY           ║
║  TERMINAL    READY           ║
║  NETWORK     ${navigator.onLine ? "ONLINE " : "OFFLINE"}         ║
║                              ║
║  C04-V1                     ║
║                              ║
╚══════════════════════════════╝

`);

    },


    /* -----------------------------------------------------
       MATRIX
       ----------------------------------------------------- */

    matrix() {

        return commandResult(`

01001001 01001110 01001001 01010100

> ACCESSING COMMANDER CORE...

> CONNECTION ESTABLISHED

> YOU ARE INSIDE.

`);

    },


    /* -----------------------------------------------------
       CLEAR
       ----------------------------------------------------- */

    clear() {

        return {

            clear: true,

            output: "",

            type: "normal"

        };

    }

};


/* =========================================================
   RADIO STATUS HELPER
   ========================================================= */

function getRadioStatus() {

    const audio =
        window.CommanderRadioAudio;


    if (!audio) {

        return "OFFLINE";

    }


    if (
        !audio.paused
    ) {

        return "PLAYING";

    }


    return "PAUSED";

}


/* =========================================================
   COMMAND EXECUTOR
   ========================================================= */

function executeCommand(
    input
) {

    const clean =
        input.trim();


    if (
        !clean
    ) {

        return commandResult(
            ""
        );

    }


    const parts =
        clean.split(
            /\s+/
        );


    const command =
        parts.shift()
            .toLowerCase();


    const args =
        parts;


    if (
        !CommanderCommands[command]
    ) {

        return commandResult(

            `Command not found: ${command}

Type "help" to see available commands.`,

            "error"

        );

    }


    try {

        return CommanderCommands[
            command
        ](args);

    } catch (error) {

        console.error(
            "[Commander04 Command Error]",
            error
        );


        return commandResult(

            "Command execution failed.",

            "error"

        );

    }

}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.CommanderCommands =
    CommanderCommands;


window.executeCommanderCommand =
    executeCommand;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "%c COMMANDER04 COMMAND SYSTEM READY ",
    "color:#b794ff;font-weight:bold"
);