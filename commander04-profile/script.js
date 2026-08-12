/* =========================================================
   COMMANDER04 PROFILE
   MAIN SCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const enterScreen =
    document.getElementById("enter-screen");

const enterButton =
    document.getElementById("enter-button");

const mainSite =
    document.getElementById("main-site");

const enterName =
    document.getElementById("enter-name");


/* =========================================================
   BACKGROUND VIDEO
========================================================= */

const backgroundVideo =
    document.getElementById("background-video");


/* =========================================================
   PROFILE ELEMENTS
========================================================= */

const profileAvatar =
    document.getElementById("profile-avatar");

const profileName =
    document.getElementById("profile-name");

const profileUsername =
    document.getElementById("profile-username");

const profileBio =
    document.getElementById("profile-bio");

const profileLocation =
    document.getElementById("profile-location");

const profileStatus =
    document.getElementById("status-text");


/* =========================================================
   SOCIAL ELEMENTS
========================================================= */

const githubLink =
    document.getElementById("github-link");

const discordLink =
    document.getElementById("discord-link");

const instagramLink =
    document.getElementById("instagram-link");

const telegramLink =
    document.getElementById("telegram-link");

const baleLink =
    document.getElementById("bale-link");


/* =========================================================
   MUSIC ELEMENTS
========================================================= */

const music =
    document.getElementById("background-music");

const musicButton =
    document.getElementById("music-button");

const musicTitle =
    document.getElementById("music-title");

const musicArtist =
    document.getElementById("music-artist");

const progressBar =
    document.getElementById("music-progress-bar");


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const nextPageButton =
    document.getElementById("next-page");

const backPageButton =
    document.getElementById("back-page");

const profilePage =
    document.getElementById("profile");

const pageTwo =
    document.getElementById("page-two");

const aboutText =
    document.getElementById("about-text");

const projectList =
    document.getElementById("project-list");


/* =========================================================
   SETUP BACKGROUND VIDEO
========================================================= */

function setupBackgroundVideo() {

    if (!backgroundVideo) {
        return;
    }

    /*
        Video must stay muted.
        This helps mobile browsers allow playback.
    */

    backgroundVideo.muted = true;

    backgroundVideo.volume = 0;

    backgroundVideo.loop = true;

    backgroundVideo.playsInline = true;

    backgroundVideo.setAttribute(
        "playsinline",
        ""
    );

    /*
        IMPORTANT:
        Do NOT start the video here.

        It will start only after:
        ENTER → 2 second delay
    */

    backgroundVideo.pause();

    /*
        Video error logging
    */

    backgroundVideo.addEventListener(
        "error",
        () => {

            console.error(
                "Background video could not be loaded."
            );

        }
    );

}


/* =========================================================
   START BACKGROUND VIDEO
========================================================= */

function startBackgroundVideo() {

    if (!backgroundVideo) {
        return;
    }

    backgroundVideo.muted = true;

    backgroundVideo.volume = 0;

    backgroundVideo.loop = true;

    backgroundVideo
        .play()
        .catch(error => {

            console.error(
                "Background video could not start:",
                error
            );

        });

}


/* =========================================================
   LOAD PROFILE
========================================================= */

function loadProfile() {

    const profile =
        CONFIG.profile || {};


    /* Name */

    profileName.textContent =
        profile.name || "commander04";


    enterName.textContent =
        profile.name || "commander04";


    /* Username */

    profileUsername.textContent =
        profile.username || "";


    /* Bio */

    profileBio.textContent =
        profile.bio || "";


    /* Avatar */

    if (profile.avatar) {

        profileAvatar.src =
            profile.avatar;


        profileAvatar.onerror = () => {

            console.error(
                "Profile image not found:",
                profile.avatar
            );

        };

    }


    /* Location */

    if (profile.location) {

        profileLocation.textContent =
            profile.location;

        profileLocation.style.display =
            "block";

    }

    else {

        profileLocation.style.display =
            "none";

    }


    /* Status */

    if (profile.status) {

        profileStatus.textContent =
            profile.status;

    }

    else {

        document
            .getElementById("profile-status")
            .style.display = "none";

    }

}


/* =========================================================
   LOAD SOCIALS
========================================================= */

function loadSocials() {

    const socials =
        CONFIG.socials || {};


    setupSocialLink(
        githubLink,
        socials.github
    );


    setupSocialLink(
        discordLink,
        socials.discord
    );


    setupSocialLink(
        instagramLink,
        socials.instagram
    );


    setupSocialLink(
        telegramLink,
        socials.telegram
    );


    setupSocialLink(
        baleLink,
        socials.bale
    );

}


/* =========================================================
   SOCIAL LINK HELPER
========================================================= */

function setupSocialLink(
    element,
    url
) {

    if (!element) {
        return;
    }


    if (
        !url ||
        url === "#" ||
        url.trim() === ""
    ) {

        element.style.display =
            "none";

        return;

    }


    element.href =
        url;


    element.target =
        "_blank";


    element.rel =
        "noopener noreferrer";


    element.style.display =
        "inline-block";

}


/* =========================================================
   LOAD MUSIC
========================================================= */

function loadMusic() {

    const musicConfig =
        CONFIG.music || {};


    if (
        !musicConfig.enabled ||
        !musicConfig.file
    ) {

        document
            .getElementById("music-player")
            .style.display = "none";

        return;

    }


    music.src =
        musicConfig.file;


    music.volume =
        musicConfig.volume ?? 0.7;


    music.loop =
        musicConfig.loop ?? true;


    musicTitle.textContent =
        musicConfig.title ||
        "Unknown Song";


    musicArtist.textContent =
        musicConfig.artist ||
        "Unknown Artist";


    music.onerror = () => {

        console.error(
            "Music file could not be loaded:",
            musicConfig.file
        );

    };

}


/* =========================================================
   LOAD APPEARANCE
========================================================= */

function loadAppearance() {

    const appearance =
        CONFIG.appearance || {};


    const root =
        document.documentElement;


    if (appearance.accentColor) {

        root.style.setProperty(
            "--accent-color",
            appearance.accentColor
        );

    }


    if (appearance.accentLight) {

        root.style.setProperty(
            "--accent-light",
            appearance.accentLight
        );

    }


    if (appearance.backgroundColor) {

        root.style.setProperty(
            "--background-color",
            appearance.backgroundColor
        );

    }


    if (appearance.cardColor) {

        root.style.setProperty(
            "--card-color",
            appearance.cardColor
        );

    }


    if (appearance.textColor) {

        root.style.setProperty(
            "--text-color",
            appearance.textColor
        );

    }


    if (appearance.mutedColor) {

        root.style.setProperty(
            "--muted-color",
            appearance.mutedColor
        );

    }

}


/* =========================================================
   LOAD PAGES
========================================================= */

function loadPages() {

    /* ABOUT */

    if (
        CONFIG.about &&
        aboutText
    ) {

        aboutText.innerHTML =
            CONFIG.about;

    }


    /* PROJECTS */

    if (
        CONFIG.projects &&
        Array.isArray(CONFIG.projects) &&
        projectList
    ) {

        projectList.innerHTML =
            "";


        CONFIG.projects.forEach(
            project => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "project-item";


                const title =
                    document.createElement(
                        "h4"
                    );


                title.textContent =
                    project.name ||
                    "Project";


                const description =
                    document.createElement(
                        "p"
                    );


                description.textContent =
                    project.description ||
                    "";


                card.appendChild(
                    title
                );


                card.appendChild(
                    description
                );


                projectList.appendChild(
                    card
                );

            }
        );

    }

}


/* =========================================================
   ENTER WEBSITE
========================================================= */

let entered = false;


enterButton.addEventListener(
    "click",
    async () => {

        if (entered) {
            return;
        }


        entered = true;


        /* =============================================
           SHOW WEBSITE
        ============================================== */

        mainSite.classList.add(
            "visible"
        );


        /* =============================================
           START MUSIC IMMEDIATELY
        ============================================== */

        if (
            CONFIG.music &&
            CONFIG.music.enabled &&
            CONFIG.music.file
        ) {

            try {

                await music.play();


                musicButton.textContent =
                    "❚❚";

            }

            catch (error) {

                console.error(
                    "Music could not start:",
                    error
                );


                musicButton.textContent =
                    "▶";

            }

        }


        /* =============================================
           BACKGROUND VIDEO
           
           WAIT 2 SECONDS
        ============================================== */

        setTimeout(
            () => {

                startBackgroundVideo();

            },
            120
        );


        /* =============================================
           HIDE ENTER SCREEN
        ============================================== */

        setTimeout(
            () => {

                enterScreen.classList.add(
                    "hidden"
                );

            },
            150
        );

    }
);


/* =========================================================
   MUSIC PLAY / PAUSE
========================================================= */

musicButton.addEventListener(
    "click",
    async () => {

        if (music.paused) {

            try {

                await music.play();


                musicButton.textContent =
                    "❚❚";

            }

            catch (error) {

                console.error(
                    "Music could not play:",
                    error
                );

            }

        }

        else {

            music.pause();


            musicButton.textContent =
                "▶";

        }

    }
);


/* =========================================================
   MUSIC EVENTS
========================================================= */

music.addEventListener(
    "play",
    () => {

        musicButton.textContent =
            "❚❚";

    }
);


music.addEventListener(
    "pause",
    () => {

        musicButton.textContent =
            "▶";

    }
);


/* =========================================================
   MUSIC PROGRESS
========================================================= */

music.addEventListener(
    "timeupdate",
    () => {

        if (
            !music.duration ||
            isNaN(music.duration)
        ) {

            return;

        }


        const percentage =
            (
                music.currentTime /
                music.duration
            ) * 100;


        progressBar.style.width =
            percentage + "%";

    }
);


/* =========================================================
   MUSIC LOOP
========================================================= */

music.addEventListener(
    "ended",
    () => {

        if (music.loop) {
            return;
        }


        music.currentTime =
            0;


        music.play()
            .catch(() => {});

    }
);


/* =========================================================
   NEXT PAGE
========================================================= */

nextPageButton.addEventListener(
    "click",
    () => {

        pageTwo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   BACK PAGE
========================================================= */

backPageButton.addEventListener(
    "click",
    () => {

        profilePage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initialize() {

    setupBackgroundVideo();

    loadProfile();

    loadSocials();

    loadMusic();

    loadAppearance();

    loadPages();

}


/* =========================================================
   START
========================================================= */

initialize();