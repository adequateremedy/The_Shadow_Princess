/* =========================================================
   THE SHADOW PRINCESS
   Interactive 3D Storybook Reader
   main.js
   FULL REPLACEMENT FILE
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const BOOK_ID = "The_Shadow_Pri*cess";
const STORAGE_KEY = `${BOOK*ID}_lastRightPage`;

const TOTAL_STORY_PAGES = 311;
const FIRST_RIGHT_PAGE = 1;
const LAST_RIGHT_PAGE = 311;

const TOC_IMAGE = "assets/Table-of-Contents.png";
const FRONT_COVER_IMAGE = "assets/front-cover.png";

const PAGE_TURN_DURATION = 260;
const COVER_OPEN_DURATION = 850;

const DRAG_COMPLETE_THRESHOLD = 0.46;
const MIN_DRAG_DISTANCE = 24;

const PRELOAD_SPREAD_RADIUS = 2;

/*
   IMPORTANT:
   These filenames must match GitHub exactly.
   GitHub Pages is case-sensitive.
*/

const CHAPTERS = [
    {
        start: 1,
        end: 18,
        folder: "one",
        filePrefix: "Chapter-One-Page-"
    },
    {
        start: 19,
        end: 39,
        folder: "two",
        filePrefix: "Chapter-Two-Page-"
    },
    {
        start: 40,
        end: 59,
        folder: "three",
        filePrefix: "Chapter-Three-Page-"
    },
    {
        start: 60,
        end: 79,
        folder: "four",
        filePrefix: "Chapter-Four-Page-"
    },
    {
        start: 80,
        end: 104,
        folder: "five",
        filePrefix: "Chapter-Five-Page-"
    },
    {
        start: 105,
        end: 130,
        folder: "six",
        filePrefix: "Chapter-Six-Page-"
    },
    {
        start: 131,
        end: 159,
        folder: "seven",
        filePrefix: "Chapter-Seven-page-"
    },
    {
        start: 160,
        end: 183,
        folder: "eight",
        filePrefix: "Chapter-Eight-page-"
    },
    {
        start: 184,
        end: 209,
        folder: "nine",
        filePrefix: "Chapter-Nine-page-"
    },
    {
        start: 210,
        end: 233,
        folder: "ten",
        filePrefix: "Chapter-Ten-page-"
    },
    {
        start: 234,
        end: 256,
        folder: "eleven",
        filePrefix: "Chapter-Eleven-page-"
    },
    {
        start: 257,
        end: 281,
        folder: "twelve",
        filePrefix: "Chapter-Twelve-page-"
    },
    {
        start: 282,
        end: 311,
        folder: "thirteen",
        filePrefix: "Chapter-Thirteen-page-"
    }
];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

let loadingScreen;

let bookReader;
let bookContainer;

let backgroundVideo;

let frontCover;
let openBook;

let leftPage;
let rightPage;

let leftPageImage;
let rightPageImage;

let pageTurnLayer;
let turningPageImage;

let tocButton;

let resumeWindow;
let resumeYesButton;
let resumeNoButton;


/* =========================================================
   STATE
   ========================================================= */

let isBookOpen = false;
let currentRightPage = FIRST_RIGHT_PAGE;

let isDragging = false;
let dragType = null;

let dragStartX = 0;
let dragCurrentX = 0;
let dragProgress = 0;

let activePointerId = null;
let isAnimating = false;

let savedRightPageOnOpen = null;

let rightDragHint = null;
let leftDragHint = null;


/* =========================================================
   STARTUP
   ========================================================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBook);
} else {
    initBook();
}


function initBook() {
    console.log("The Shadow Princess reader is initializing...");

    cacheDomElements();

    try {
        if (!validateRequiredElements()) {
            console.error("The Shadow Princess reader could not find required HTML elements.");
            hideLoadingScreen();
            return;
        }

        savedRightPageOnOpen = getSavedRightPage();

        prepareBackgroundVideo();

        createDragHints();

        setSpread(FIRST_RIGHT_PAGE, false);
        preloadAround(FIRST_RIGHT_PAGE);

        bindEvents();

        hideResumeWindow();

        /*
           Important:
           This prevents the reader from getting trapped forever
           behind the loading screen if an image path is wrong.
        */
        Promise.race([
            waitForInitialImages(),
            delay(2500)
        ]).then(() => {
            hideLoadingScreen();
            console.log("The Shadow Princess reader is ready.");
        }).catch((error) => {
            console.error("Initial loading failed:", error);
            hideLoadingScreen();
        });

    } catch (error) {
        console.error("The Shadow Princess reader failed to initialize:", error);
        hideLoadingScreen();
    }
}


function cacheDomElements() {
    loadingScreen = document.getElementById("loading-screen");

    bookReader = document.getElementById("book-reader");
    bookContainer = document.getElementById("book-container");

    backgroundVideo = document.getElementById("background-video");

    frontCover = document.getElementById("front-cover");
    openBook = document.getElementById("open-book");

    leftPage = document.getElementById("left-page");
    rightPage = document.getElementById("right-page");

    leftPageImage = document.getElementById("left-page-image");
    rightPageImage = document.getElementById("right-page-image");

    pageTurnLayer = document.getElementById("page-turn-layer");
    turningPageImage = document.getElementById("turning-page-image");

    tocButton = document.getElementById("toc-button");

    resumeWindow = document.getElementById("resume-window");
    resumeYesButton = document.getElementById("resume-yes");
    resumeNoButton = document.getElementById("resume-no");
}


function validateRequiredElements() {
    const requiredElements = [
        bookContainer,
        frontCover,
        openBook,
        leftPage,
        rightPage,
        leftPageImage,
        rightPageImage,
        pageTurnLayer,
        turningPageImage,
        tocButton
    ];

    return requiredElements.every(Boolean);
}


/* =========================================================
   BACKGROUND VIDEO / AUDIO
   ========================================================= */

function prepareBackgroundVideo() {
    if (!backgroundVideo) {
        return;
    }

    /*
       Browsers usually block autoplay audio.
       So the video starts muted, loops, and plays silently.
       Audio is enabled after the reader interacts with the book.
    */

    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    backgroundVideo.playsInline = true;

    const playPromise = backgroundVideo.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
            console.warn("Background video autoplay was blocked:", error);
        });
    }
}


function enableBackgroundAudio() {
    if (!backgroundVideo) {
        return;
    }

    backgroundVideo.muted = false;
    backgroundVideo.volume = 0.45;

    const playPromise = backgroundVideo.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
            console.warn("Browser blocked background audio until further interaction:", error);
        });
    }
}


/* =========================================================
   IMAGE PATH HELPERS
   ========================================================= */

function getChapterForPage(pageNumber) {
    return CHAPTERS.find((chapter) => {
        return pageNumber >= chapter.start && pageNumber <= chapter.end;
    });
}


function getPagePath(pageNumber) {
    if (!Number.isInteger(pageNumber)) {
        return "";
    }

    if (pageNumber < 1 || pageNumber > TOTAL_STORY_PAGES) {
        return "";
    }

    const chapter = getChapterForPage(pageNumber);

    if (!chapter) {
        console.warn(`No chapter found for page ${pageNumber}`);
        return "";
    }

    return `chapters/${chapter.folder}/${chapter.filePrefix}${pageNumber}.png`;
}


function getLeftPagePathForRightPage(rightPageNumber) {
    if (rightPageNumber === FIRST_RIGHT_PAGE) {
        return TOC_IMAGE;
    }

    const leftPageNumber = rightPageNumber - 1;
    return getPagePath(leftPageNumber);
}


function getRightPagePath(rightPageNumber) {
    return getPagePath(rightPageNumber);
}


/* =========================================================
   SPREAD MANAGEMENT
   ========================================================= */

function normalizeRightPage(pageNumber) {
    let page = Number(pageNumber);

    if (!Number.isFinite(page)) {
        page = FIRST_RIGHT_PAGE;
    }

    page = Math.round(page);

    if (page < FIRST_RIGHT_PAGE) {
        page = FIRST_RIGHT_PAGE;
    }

    if (page > LAST_RIGHT_PAGE) {
        page = LAST_RIGHT_PAGE;
    }

    /*
       Right-side pages must always be odd.
       If an even page gets saved somehow, move to the next odd page.
    */
    if (page % 2 === 0) {
        page += 1;
    }

    if (page > LAST_RIGHT_PAGE) {
        page = LAST_RIGHT_PAGE;
    }

    return page;
}


function setSpread(rightPageNumber, shouldSave = true) {
    const normalizedRightPage = normalizeRightPage(rightPageNumber);

    currentRightPage = normalizedRightPage;

    const leftPath = getLeftPagePathForRightPage(currentRightPage);
    const rightPath = getRightPagePath(currentRightPage);

    leftPageImage.src = leftPath;
    rightPageImage.src = rightPath;

    if (currentRightPage === FIRST_RIGHT_PAGE) {
        leftPageImage.alt = "Table of Contents";
    } else {
        leftPageImage.alt = `Page ${currentRightPage - 1}`;
    }

    rightPageImage.alt = `Page ${currentRightPage}`;

    if (shouldSave) {
        saveRightPage(currentRightPage);
    }

    preloadAround(currentRightPage);
    updateControls();
}


function canTurnForward() {
    return isBookOpen && !isAnimating && currentRightPage + 2 <= LAST_RIGHT_PAGE;
}


function canTurnBackward() {
    return isBookOpen && !isAnimating && currentRightPage > FIRST_RIGHT_PAGE;
}


function updateControls() {
    if (!tocButton || !rightPage || !leftPage) {
        return;
    }

    if (isBookOpen) {
        tocButton.classList.add("is-visible");
    } else {
        tocButton.classList.remove("is-visible");
    }

    rightPage.classList.toggle("can-drag-forward", canTurnForward());
    leftPage.classList.toggle("can-drag-backward", canTurnBackward());

    if (rightDragHint) {
        rightDragHint.classList.toggle("visible", canTurnForward());
    }

    if (leftDragHint) {
        leftDragHint.classList.remove("visible");
    }
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveRightPage(pageNumber) {
    const normalizedPage = normalizeRightPage(pageNumber);

    try {
        localStorage.setItem(STORAGE_KEY, String(normalizedPage));
    } catch (error) {
        console.warn("Could not save reading progress:", error);
    }
}


function getSavedRightPage() {
    try {
        const savedValue = localStorage.getItem(STORAGE_KEY);

        if (!savedValue) {
            return null;
        }

        const savedPage = normalizeRightPage(Number(savedValue));

        if (savedPage < FIRST_RIGHT_PAGE || savedPage > LAST_RIGHT_PAGE) {
            return null;
        }

        return savedPage;
    } catch (error) {
        console.warn("Could not read saved progress:", error);
        return null;
    }
}


/* =========================================================
   PRELOADING
   ========================================================= */

function preloadImage(src) {
    if (!src) {
        return;
    }

    const image = new Image();

    image.onerror = () => {
        console.warn("Preload failed:", src);
    };

    image.src = src;
}


function preloadSpread(rightPageNumber) {
    const normalizedRightPage = normalizeRightPage(rightPageNumber);

    preloadImage(getLeftPagePathForRightPage(normalizedRightPage));
    preloadImage(getRightPagePath(normalizedRightPage));
}


function preloadAround(rightPageNumber) {
    const normalizedRightPage = normalizeRightPage(rightPageNumber);

    for (let offset = -PRELOAD_SPREAD_RADIUS; offset <= PRELOAD_SPREAD_RADIUS; offset++) {
        const spreadRightPage = normalizedRightPage + offset * 2;

        if (spreadRightPage >= FIRST_RIGHT_PAGE && spreadRightPage <= LAST_RIGHT_PAGE) {
            preloadSpread(spreadRightPage);
        }
    }
}


function waitForInitialImages() {
    const imagesToLoad = [
        FRONT_COVER_IMAGE,
        TOC_IMAGE,
        getRightPagePath(FIRST_RIGHT_PAGE)
    ];

    const promises = imagesToLoad.map((src) => {
        return new Promise((resolve) => {
            if (!src) {
                resolve();
                return;
            }

            const image = new Image();

            image.onload = () => {
                console.log("Loaded:", src);
                resolve();
            };

            image.onerror = () => {
                console.warn("Could not load image:", src);
                resolve();
            };

            image.src = src;
        });
    });

    return Promise.all(promises);
}


function hideLoadingScreen() {
    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.add("hidden");

    /*
       Backup inline style.
       This guarantees the loading overlay gets out of the way
       even if the CSS class is missing or cached.
    */
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 700);
}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {
    frontCover.addEventListener("pointerdown", handlePointerDown);
    rightPage.addEventListener("pointerdown", handlePointerDown);
    leftPage.addEventListener("pointerdown", handlePointerDown);

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, { passive: false });
    window.addEventListener("pointercancel", handlePointerCancel, { passive: false });

    window.addEventListener("keydown", handleKeyDown);

    tocButton.addEventListener("click", goToTableOfContents);

    if (resumeYesButton) {
        resumeYesButton.addEventListener("click", () => {
            hideResumeWindow();

            if (savedRightPageOnOpen) {
                setSpread(savedRightPageOnOpen, true);
            }
        });
    }

    if (resumeNoButton) {
        resumeNoButton.addEventListener("click", () => {
            hideResumeWindow();
            setSpread(FIRST_RIGHT_PAGE, true);
        });
    }

    window.addEventListener("resize", () => {
        resetDragState();
    });
}


/* =========================================================
   POINTER / DRAG HANDLING
   ========================================================= */

function handlePointerDown(event) {
    if (isAnimating) {
        return;
    }

    if (activePointerId !== null) {
        return;
    }

    const target = event.currentTarget;

    if (target === frontCover && !isBookOpen) {
        startCoverDrag(event);
        return;
    }

    if (!isBookOpen) {
        return;
    }

    if (target === rightPage && canTurnForward() && isInForwardGrabZone(event)) {
        startPageDrag(event, "forward");
        return;
    }

    if (target === leftPage && canTurnBackward() && isInBackwardGrabZone(event)) {
        startPageDrag(event, "backward");
    }
}


function handlePointerMove(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
        return;
    }

    event.preventDefault();

    dragCurrentX = event.clientX;

    if (dragType === "cover") {
        updateCoverDrag();
    } else if (dragType === "forward") {
        updateForwardPageDrag();
    } else if (dragType === "backward") {
        updateBackwardPageDrag();
    }
}


function handlePointerUp(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
        return;
    }

    event.preventDefault();

    if (dragType === "cover") {
        finishCoverDrag();
    } else if (dragType === "forward") {
        finishForwardPageDrag();
    } else if (dragType === "backward") {
        finishBackwardPageDrag();
    }
}


function handlePointerCancel(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
        return;
    }

    resetDragState();
}


function startCoverDrag(event) {
    enableBackgroundAudio();

    isDragging = true;
    dragType = "cover";
    activePointerId = event.pointerId;

    dragStartX = event.clientX;
    dragCurrentX = event.clientX;
    dragProgress = 0;

    try {
        frontCover.setPointerCapture(event.pointerId);
    } catch (error) {
        console.warn("Could not capture pointer for cover:", error);
    }

    document.body.classList.add("book-is-dragging");
    frontCover.classList.add("no-transition");

    event.preventDefault();
}


function startPageDrag(event, direction) {
    enableBackgroundAudio();

    isDragging = true;
    dragType = direction;
    activePointerId = event.pointerId;

    dragStartX = event.clientX;
    dragCurrentX = event.clientX;
    dragProgress = 0;

    document.body.classList.add("book-is-dragging");

    setupTurningLayer(direction);

    try {
        if (direction === "forward") {
            rightPage.setPointerCapture(event.pointerId);
        } else {
            leftPage.setPointerCapture(event.pointerId);
        }
    } catch (error) {
        console.warn("Could not capture pointer for page:", error);
    }

    event.preventDefault();
}


function resetDragState() {
    isDragging = false;
    dragType = null;
    activePointerId = null;

    dragStartX = 0;
    dragCurrentX = 0;
    dragProgress = 0;

    document.body.classList.remove("book-is-dragging");

    if (frontCover) {
        frontCover.classList.remove("no-transition");
    }

    if (pageTurnLayer) {
        pageTurnLayer.className = "";
        pageTurnLayer.removeAttribute("style");
    }

    if (turningPageImage) {
        turningPageImage.src = "";
        turningPageImage.alt = "";
    }

    updateControls();
}


/* =========================================================
   GRAB ZONES
   ========================================================= */

function isInForwardGrabZone(event) {
    const rect = rightPage.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoneWidth = rect.width * 0.42;
    const zoneHeight = rect.height * 0.48;

    const inRightSide = x >= rect.width - zoneWidth;
    const inBottomArea = y >= rect.height - zoneHeight;

    return inRightSide && inBottomArea;
}


function isInBackwardGrabZone(event) {
    const rect = leftPage.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoneWidth = rect.width * 0.42;
    const zoneHeight = rect.height * 0.48;

    const inLeftSide = x <= zoneWidth;
    const inBottomArea = y >= rect.height - zoneHeight;

    return inLeftSide && inBottomArea;
}


/* =========================================================
   COVER DRAGGING
   ========================================================= */

function updateCoverDrag() {
    const bookRect = bookContainer.getBoundingClientRect();
    const dragDistance = dragStartX - dragCurrentX;

    dragProgress = clamp(dragDistance / (bookRect.width * 0.42), 0, 1);

    const rotation = -178 * dragProgress;
    const shadowStrength = 0.75 - dragProgress * 0.28;

    frontCover.style.transform = `
        translateX(-50%)
        rotateY(${rotation}deg)
    `;

    frontCover.style.boxShadow = `
        0 34px 70px rgba(0, 0, 0, ${shadowStrength}),
        0 0 0 1px rgba(255, 226, 162, 0.18),
        inset 0 0 28px rgba(0, 0, 0, 0.42)
    `;
}


function finishCoverDrag() {
    const dragDistance = Math.abs(dragCurrentX - dragStartX);

    frontCover.classList.remove("no-transition");

    if (dragProgress >= DRAG_COMPLETE_THRESHOLD && dragDistance >= MIN_DRAG_DISTANCE) {
        completeCoverOpen();
    } else {
        snapCoverClosed();
    }
}


function completeCoverOpen() {
    enableBackgroundAudio();

    isAnimating = true;

    frontCover.style.transition = `
        transform ${COVER_OPEN_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity ${COVER_OPEN_DURATION}ms ease,
        box-shadow ${COVER_OPEN_DURATION}ms ease
    `;

    frontCover.style.transform = `
        translateX(-100%)
        rotateY(-178deg)
    `;

    frontCover.style.opacity = "0";

    setTimeout(() => {
        isBookOpen = true;

        frontCover.classList.add("cover-open");
        openBook.classList.add("is-visible");

        if (savedRightPageOnOpen) {
            setSpread(savedRightPageOnOpen, true);
        } else {
            setSpread(FIRST_RIGHT_PAGE, true);
        }

        resetCoverInlineStyles();

        isAnimating = false;
        resetDragState();
        updateControls();

    }, COVER_OPEN_DURATION);
}


function snapCoverClosed() {
    isAnimating = true;

    frontCover.style.transition = `
        transform 280ms ease-out,
        box-shadow 280ms ease-out
    `;

    frontCover.style.transform = `
        translateX(-50%)
        rotateY(0deg)
    `;

    setTimeout(() => {
        resetCoverInlineStyles();

        isAnimating = false;
        resetDragState();
    }, 280);
}


function resetCoverInlineStyles() {
    frontCover.style.transition = "";
    frontCover.style.transform = "";
    frontCover.style.opacity = "";
    frontCover.style.boxShadow = "";
}


/* =========================================================
   PAGE TURNING SETUP
   ========================================================= */

function setupTurningLayer(direction) {
    pageTurnLayer.className = "";

    pageTurnLayer.classList.add("is-turning");

    pageTurnLayer.style.transition = "none";
    pageTurnLayer.style.transform = "rotateY(0deg)";

    if (direction === "forward") {
        pageTurnLayer.classList.add("turn-forward");
        turningPageImage.src = getRightPagePath(currentRightPage);
        turningPageImage.alt = `Turning page ${currentRightPage}`;
    }

    if (direction === "backward") {
        pageTurnLayer.classList.add("turn-backward");
        turningPageImage.src = getLeftPagePathForRightPage(currentRightPage);

        if (currentRightPage === FIRST_RIGHT_PAGE) {
            turningPageImage.alt = "Turning Table of Contents";
        } else {
            turningPageImage.alt = `Turning page ${currentRightPage - 1}`;
        }
    }
}


/* =========================================================
   FORWARD PAGE DRAGGING
   ========================================================= */

function updateForwardPageDrag() {
    const bookRect = bookContainer.getBoundingClientRect();
    const dragDistance = dragStartX - dragCurrentX;

    dragProgress = clamp(dragDistance / (bookRect.width * 0.42), 0, 1);

    const rotation = -180 * dragProgress;
    const shadowOpacity = 0.35 + dragProgress * 0.35;

    pageTurnLayer.style.transform = `rotateY(${rotation}deg)`;

    pageTurnLayer.style.boxShadow = `
        ${-12 - dragProgress * 24}px 22px 42px rgba(0, 0, 0, ${shadowOpacity}),
        inset 0 0 28px rgba(0, 0, 0, 0.26)
    `;

    if (dragProgress > 0.52) {
        pageTurnLayer.classList.add("show-page-back");
    } else {
        pageTurnLayer.classList.remove("show-page-back");
    }

    pageTurnLayer.style.setProperty("--current-rotation", `${rotation}deg`);
}


function finishForwardPageDrag() {
    const dragDistance = Math.abs(dragCurrentX - dragStartX);

    if (dragProgress >= DRAG_COMPLETE_THRESHOLD && dragDistance >= MIN_DRAG_DISTANCE) {
        completeForwardTurn();
    } else {
        snapBackForwardTurn();
    }
}


function completeForwardTurn() {
    isAnimating = true;

    pageTurnLayer.style.transition = `
        transform ${PAGE_TURN_DURATION}ms ease-out,
        box-shadow ${PAGE_TURN_DURATION}ms ease-out
    `;

    pageTurnLayer.style.transform = "rotateY(-180deg)";

    setTimeout(() => {
        setSpread(currentRightPage + 2, true);

        isAnimating = false;
        resetDragState();
    }, PAGE_TURN_DURATION);
}


function snapBackForwardTurn() {
    isAnimating = true;

    pageTurnLayer.style.transition = `
        transform 220ms ease-out,
        box-shadow 220ms ease-out
    `;

    pageTurnLayer.style.transform = "rotateY(0deg)";

    setTimeout(() => {
        isAnimating = false;
        resetDragState();
    }, 220);
}


/* =========================================================
   BACKWARD PAGE DRAGGING
   ========================================================= */

function updateBackwardPageDrag() {
    const bookRect = bookContainer.getBoundingClientRect();
    const dragDistance = dragCurrentX - dragStartX;

    dragProgress = clamp(dragDistance / (bookRect.width * 0.42), 0, 1);

    const rotation = 180 * dragProgress;
    const shadowOpacity = 0.35 + dragProgress * 0.35;

    pageTurnLayer.style.transform = `rotateY(${rotation}deg)`;

    pageTurnLayer.style.boxShadow = `
        ${12 + dragProgress * 24}px 22px 42px rgba(0, 0, 0, ${shadowOpacity}),
        inset 0 0 28px rgba(0, 0, 0, 0.26)
    `;

    if (dragProgress > 0.52) {
        pageTurnLayer.classList.add("show-page-back");
    } else {
        pageTurnLayer.classList.remove("show-page-back");
    }

    pageTurnLayer.style.setProperty("--current-rotation", `${rotation}deg`);
}


function finishBackwardPageDrag() {
    const dragDistance = Math.abs(dragCurrentX - dragStartX);

    if (dragProgress >= DRAG_COMPLETE_THRESHOLD && dragDistance >= MIN_DRAG_DISTANCE) {
        completeBackwardTurn();
    } else {
        snapBackBackwardTurn();
    }
}


function completeBackwardTurn() {
    isAnimating = true;

    pageTurnLayer.style.transition = `
        transform ${PAGE_TURN_DURATION}ms ease-out,
        box-shadow ${PAGE_TURN_DURATION}ms ease-out
    `;

    pageTurnLayer.style.transform = "rotateY(180deg)";

    setTimeout(() => {
        setSpread(currentRightPage - 2, true);

        isAnimating = false;
        resetDragState();
    }, PAGE_TURN_DURATION);
}


function snapBackBackwardTurn() {
    isAnimating = true;

    pageTurnLayer.style.transition = `
        transform 220ms ease-out,
        box-shadow 220ms ease-out
    `;

    pageTurnLayer.style.transform = "rotateY(0deg)";

    setTimeout(() => {
        isAnimating = false;
        resetDragState();
    }, 220);
}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

function handleKeyDown(event) {
    if (isAnimating) {
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();

        enableBackgroundAudio();

        if (!isBookOpen) {
            openCoverWithKeyboard();
            return;
        }

        if (canTurnForward()) {
            keyboardForwardTurn();
        }
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();

        enableBackgroundAudio();

        if (canTurnBackward()) {
            keyboardBackwardTurn();
        }
    }

    if (event.key === "Home") {
        event.preventDefault();

        if (isBookOpen) {
            goToTableOfContents();
        }
    }
}


function openCoverWithKeyboard() {
    enableBackgroundAudio();

    if (isBookOpen || isAnimating) {
        return;
    }

    isAnimating = true;

    frontCover.style.transition = `
        transform ${COVER_OPEN_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity ${COVER_OPEN_DURATION}ms ease
    `;

    frontCover.style.transform = `
        translateX(-100%)
        rotateY(-178deg)
    `;

    frontCover.style.opacity = "0";

    setTimeout(() => {
        isBookOpen = true;

        frontCover.classList.add("cover-open");
        openBook.classList.add("is-visible");

        if (savedRightPageOnOpen) {
            setSpread(savedRightPageOnOpen, true);
        } else {
            setSpread(FIRST_RIGHT_PAGE, true);
        }

        resetCoverInlineStyles();

        isAnimating = false;
        updateControls();
    }, COVER_OPEN_DURATION);
}


function keyboardForwardTurn() {
    if (!canTurnForward()) {
        return;
    }

    setupTurningLayer("forward");

    requestAnimationFrame(() => {
        completeForwardTurn();
    });
}


function keyboardBackwardTurn() {
    if (!canTurnBackward()) {
        return;
    }

    setupTurningLayer("backward");

    requestAnimationFrame(() => {
        completeBackwardTurn();
    });
}


/* =========================================================
   TABLE OF CONTENTS BUTTON
   ========================================================= */

function goToTableOfContents() {
    if (!isBookOpen || isAnimating) {
        return;
    }

    if (currentRightPage === FIRST_RIGHT_PAGE) {
        return;
    }

    isAnimating = true;

    openBook.style.transition = "opacity 280ms ease, transform 280ms ease";
    openBook.style.opacity = "0.18";
    openBook.style.transform = "scale(0.985)";

    setTimeout(() => {
        setSpread(FIRST_RIGHT_PAGE, true);

        openBook.style.opacity = "1";
        openBook.style.transform = "scale(1)";

        setTimeout(() => {
            openBook.style.transition = "";
            openBook.style.opacity = "";
            openBook.style.transform = "";

            isAnimating = false;
            updateControls();
        }, 280);
    }, 280);
}


/* =========================================================
   RESUME WINDOW HELPERS
   ========================================================= */

function showResumeWindow() {
    if (!resumeWindow) {
        return;
    }

    resumeWindow.classList.add("is-visible");
}


function hideResumeWindow() {
    if (!resumeWindow) {
        return;
    }

    resumeWindow.classList.remove("is-visible");
}


/* =========================================================
   DRAG HINTS
   ========================================================= */

function createDragHints() {
    if (!rightPage || !leftPage) {
        return;
    }

    rightDragHint = document.createElement("div");
    rightDragHint.className = "drag-corner-hint right visible";
    rightPage.appendChild(rightDragHint);

    leftDragHint = document.createElement("div");
    leftDragHint.className = "drag-corner-hint left";
    leftPage.appendChild(leftDragHint);

    rightPage.addEventListener("mouseenter", () => {
        if (canTurnForward() && rightDragHint) {
            rightDragHint.classList.add("visible");
        }
    });

    rightPage.addEventListener("mouseleave", () => {
        if (rightDragHint) {
            rightDragHint.classList.remove("visible");
        }
    });

    leftPage.addEventListener("mouseenter", () => {
        if (canTurnBackward() && leftDragHint) {
            leftDragHint.classList.add("visible");
        }
    });

    leftPage.addEventListener("mouseleave", () => {
        if (leftDragHint) {
            leftDragHint.classList.remove("visible");
        }
    });
}


/* =========================================================
   UTILITY
   ========================================================= */

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
