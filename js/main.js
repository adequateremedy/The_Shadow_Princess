/* =========================================================
   THE SHADOW PRINCESS
   Interactive 3D Storybook Reader
   main.js
   ========================================================= */

/*
   This file controls:

   - front cover dragging
   - opening the book
   - TOC on the left / Page 1 on the right
   - even pages on the left
   - odd pages on the right
   - forward and backward page dragging
   - keyboard navigation
   - touch support
   - dynamic image loading
   - localStorage reading progress
   - floating Table of Contents button

   Folder structure expected:

   The_Shadow_Princess/
       index.html
       css/style.css
       js/main.js
       assets/
           background.webm
           front-cover.png
           Table-of-Contents.png
       chapters/
           one/
           two/
           three/
           four/
           five/
           six/
           seven/
           eight/
           nine/
           ten/
           eleven/
           twelve/
           thirteen/
*/


/* =========================================================
   CONFIGURATION
   ========================================================= */

const BOOK_ID = "The_Shadow_Pri*cess";
const STORAGE_KEY = `${BOOK*ID}_lastRightPage`;

const TOTAL_S*ORY_PAGES = 311;
const FIRST_RIGHT*PAGE = 1;
const LAST_RIGHT_PAGE = *11;

const TOC_IMAGE = "assets/Tab*e-of-Contents.png";

const PAGE_TU*N_DURATION = 260;
const COVER_OPEN*DURATION = 850;

const DRAG_COMPLE*E_THRESHOLD = 0.46;
const*MIN*DR*G_DISTANCE = 24;

const PRELOAD_SP*EAD_RADIUS = 2;


/*
   Important filename note:

   Your examples show:

   Chapters 1-6:
   Chapter-One-Page-1.png
   Chapter-Two-Page-19.png
   Chapter-Three-Page-40.png
   Chapter-Four-Page-60.png
   Chapter-Five-Page-80.png
   Chapter-Six-Page-105.png

   Chapters 7-13:
   Chapter-Seven-page-131.png
   Chapter-Eight-page-160.png
   Chapter-Nine-page-184.png
   Chapter-Ten-page-210.png
   Chapter-Eleven-page-234.png
   Chapter-Twelve-page-257.png
   Chapter-Thirteen-page-282.png

   So this map preserves your uppercase/lowercase naming pattern.
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

const loadingScreen = document.*etElementById("loading-screen");

*onst bookReader = document.getElem*ntById("book-reader");
const bookC*ntainer = document.getElementById(*book-container");

const frontCove* = document.getElementById("front-*over");
const openBook = document.*etElementById("open-book");

const*leftPage = document.getElementById*"left-page");
const rightPage = do*ument.getElementById("right-page")*

const leftPageImage = document.getElementById("left-page-image");
const rightPageImage = document.getElementById("right-page-image");

const pageTurnLayer = document.getElementById("page-turn-layer");
const turningPageImage = document.getElementById("turning-page-image");

const tocButton = document.getElementById("toc-button");

const resumeWindow = document.getElementById("resume-window");
const resumeYesButton = document.getElementById("resume-yes");
const resumeNoButton = document.getElementById("resume-no");


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


/* =========================================================
   INITIALIZATION
   ========================================================= */

window.addEventListener("DOMContentLoaded", initBook);

function initBook() {
    savedRightPageOnOpen = getSavedRightPage();

    createDragHints();
    setSpread(FIRST_RIGHT_PAGE, false);
    preloadAround(FIRST_RIGHT_PAGE);

    bindEvents();

    hideResumeWindow();

    waitForInitialImages().then(() => {
        hideLoadingScreen();
    });
}


/* =========================================================
   IMAGE PATH HELPERS
   ========================================================= */

function getChapterForPage(page*umber) {
    return CHAPTERS.find(*chapter) => {
        return pageN*mber >= chapter.start && pageNumbe* <= chapter.end;
    });
}


funct*on getPagePath(pageNumber) {
    i* (!Number.isInteger(pageNumber)) {*        return "";
    }

    if (*ageNumber < 1 || pageNumber > TOTA*_STORY_PAGES) {
        return "";*    }

    const chapter = getChap*erForPage(pageNumber);

    if (!c*apter) {
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
       Right pages must always be odd.
       If an even page is somehow saved, move to the next odd page.
    */
    if (page % 2 === 0) {
  *     page = page + 1;
    }

    i* (page > LAST_RIGHT_PAGE) {
      * page = LAST_RIGHT_PAGE;
    }

  * return page;
}


function setSpre*d(rightPageNumber, shouldSave = tr*e) {
    const normalizedRightPage*= normalizeRightPage(rightPageNumb*r);

    currentRightPage = normal*zedRightPage;

    const leftPath * getLeftPagePathForRightPage(curre*tRightPage);
    const rightPath =*getRightPagePath(currentRightPage)*

    leftPageImage.src = leftPath*
    rightPageImage.src = rightPat*;

    leftPageImage.alt = current*ightPage === FIRST_RIGHT_PAGE
    *   ? "Table of Contents"
        :*`Page ${currentRightPage - 1}`;

 *  rightPageImage.alt = `Page ${cur*entRightPage}`;

    if (shouldSav*) {
        saveRightPage(currentR*ghtPage);
    }

    preloadAround*currentRightPage);
    updateContr*ls();
}


function canTurnForward(* {
    return isBookOpen && !isAnimating && currentRightPage + 2 <= LAST_RIGHT_PAGE;
}


function canTurnBackward() {
    return isBookOpen && !isAnimating && currentRightPage > FIRST_RIGHT_PAGE;
}


function updateControls() {
    if (isBookOpen) {
        tocButton.classList.add("is-visible");
    } else {
        tocButton.classList.remove("is-visible");
    }

    rightPage.classList.toggle("can-drag-forward", canTurnForward());
    leftPage.classList.toggle("can-drag-backward", canTurnBackward());
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveRightPage(pageNumb*r) {
    const normalizedPage = no*malizeRightPage(pageNumber);

    *ry {
        localStorage.setItem(*TORAGE_KEY, String(normalizedPage)*;
    } catch (error) {
        co*sole.warn("Could not save reading *rogress.", error);
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
        console.warn("Could not read saved progress.", error);
        return null;
    }
}


/* =========================================================
   PRELOADING
   ========================================================= */

function preloadImage(src) {
  * if (!src) {
        return;
    }*
    const image = new Image();
  * image.src = src;
}


function pre*oadSpread(rightPageNumber) {
    c*nst normalizedRightPage = normaliz*RightPage(rightPageNumber);

    p*eloadImage(getLeftPagePathForRight*age(normalizedRightPage));
    pre*oadImage(getRightPagePath(normaliz*dRightPage));
}


function preload*round(rightPageNumber) {
    const*normalizedRightPage = normalizeRig*tPage(rightPageNumber);

    for (*et offset = -PRELOAD_SPREAD_RADIUS* offset <= PRELOAD_SPREAD_RADIUS; *ffset++) {
        const spreadRig*tPage = normalizedRightPage + offs*t * 2;

        if (spreadRightPag* >= FIRST_RIGHT_PAGE && spreadRigh*Page <= LAST_RIGHT_PAGE) {
       *    preloadSpread(spreadRightPage)*
        }
    }
}


function wait*orInitialImages() {
    const imag*sToLoad = [
        "assets/front-cover.png",
        TOC_IMAGE,
        getRightPagePath(FIRST_RIGHT_PAGE)
    ];

    const promises = imagesToLoad.map((src) => {
        return new Promise((resolve) => {
            const image = new Image();

            image.onload = resolve;
            image.onerror = resolve;
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
}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {
    fro*tCover.addEventListener("pointerdo*n", handlePointerDown);
    rightP*ge.addEventListener("pointerdown",*handlePointerDown);
    leftPage.a*dEventListener("pointerdown", hand*ePointerDown);

    window.addEven*Listener("pointermove", handlePoin*erMove);
    window.addEventListen*r("pointerup", handlePointerUp);
 *  window.addEventListener("pointer*ancel", handlePointerCancel);

   *window.addEventListener("keydown",*handleKeyDown);

    tocButton.add*ventListener("click", goToTableOfC*ntents);

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

function handlePointerDo*n(event) {
    if (isAnimating) {
*       return;
    }

    if (acti*ePointerId !== null) {
        ret*rn;
    }

    const target = even*.currentTarget;

    if (target ==* frontCover && !isBookOpen) {
    *   startCoverDrag(event);
        *eturn;
    }

    if (!isBookOpen)*{
        return;
    }

    if (t*rget === rightPage && canTurnForwa*d() && isInForwardGrabZone(event))*{
        startPageDrag(event, "fo*ward");
        return;
    }

   *if (target === leftPage && canTurn*ackward() && isInBackwardGrabZone(*vent)) {
        startPageDrag(eve*t, "backward");
    }
}


function*handlePointerMove(event) {
    if *!isDragging || event.pointerId !==*activePointerId) {
        return;*    }

    event.preventDefault();*
    dragCurrentX = event.clientX;*
    if (dragType === "cover") {
 *      updateCoverDrag();
    }

  * if (dragType === "forward") {
   *    updateForwardPageDrag();
    }*
    if (dragType === "backward") *
        updateBackwardPageDrag();*    }
}


function handlePointerUp*event) {
    if (!isDragging || ev*nt.pointerId !== activePointerId) *
        return;
    }

    event.*reventDefault();

    if (dragType*=== "cover") {
        finishCover*rag();
    }

    if (dragType ===*"forward") {
        finishForward*ageDrag();
    }

    if (dragType*=== "backward") {
        finishBa*kwardPageDrag();
    }
}


functio* handlePointerCancel(event) {
    *f (!isDragging || event.pointerId *== activePointerId) {
        retu*n;
    }

    resetDragState();
}
*
function startCoverDrag(event) {
*   isDragging = true;
    dragType*= "cover";
    activePointerId = e*ent.pointerId;

    dragStartX = e*ent.clientX;
    dragCurrentX = ev*nt.clientX;
    dragProgress = 0;
*    frontCover.setPointerCapture(e*ent.pointerId);

    document.body*classList.add("book-is-dragging");*    frontCover.classList.add("no-t*ansition");

    event.preventDefa*lt();
}


function startPageDrag(e*ent, direction) {
    isDragging =*true;
    dragType = direction;
  * activePointerId = event.pointerId*

    dragStartX = event.clientX;
*   dragCurrentX = event.clientX;
 *  dragProgress = 0;

    document.*ody.classList.add("book-is-draggin*");

    setupTurningLayer(directi*n);

    if (direction === "forwar*") {
        rightPage.setPointerC*pture(event.pointerId);
    } else*{
        leftPage.setPointerCapture(event.pointerId);
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

    frontCover.classList.remove("no-transition");

    pageTurnLayer.className = "";
    pageTurnLayer.removeAttribute("style");
    turningPageImage.src = "";

    updateControls();
}


/* =========================================================
   GRAB ZONES
   ========================================================= */

function isInForwardGrabZone(ev*nt) {
    const rect = rightPage.g*tBoundingClientRect();

    const * = event.clientX - rect.left;
    *onst y = event.clientY - rect.top;*
    const zoneWidth = rect.width * 0.34;
    const zoneHeight = rect*height * 0.42;

    const inRightS*de = x >= rect.width - zoneWidth;
    const inBottomArea = y >= rect.height - zoneHeight;

    return inRightSide && inBottomArea;
}


function isInBackwardGrabZone(event) {
    const rect = leftPage.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoneWidth = rect.width * 0.34;
    const zoneHeight = rect.height * 0.42;

    const inLeftSide = x <= zoneWidth;
    const inBottomArea = y >= rect.height - zoneHeight;

    return inLeftSide && inBottomArea;
}


/* =========================================================
   COVER DRAGGING
   ========================================================= */

function updateCoverDrag() {
  * const bookRect = bookContainer.ge*BoundingClientRect();
    const dr*gDistance = dragStartX - dragCurre*tX;

    dragProgress = clamp(drag*istance / (bookRect.width * 0.42),*0, 1);

    const rotation = -178 * dragProgress;
    const shadowStr*ngth = 0.75 - dragProgress * 0.28;*
    frontCover.style.transform = *
        translateX(-50%)
        *otateY(${rotation}deg)
    `;

   *frontCover.style.boxShadow = `
   *    0 34px 70px rgba(0, 0, 0, ${sh*dowStrength}),
        0 0 0 1px r*ba(255, 226, 162, 0.18),
        i*set 0 0 28px rgba(0, 0, 0, 0.42)
 *  `;
}


function finishCoverDrag(* {
    const dragDistance = Math.a*s(dragCurrentX - dragStartX);

   *frontCover.classList.remove("no-tr*nsition");

    if (dragProgress >* DRAG_COMPLETE_THRESHOLD && dragDi*tance >= MIN_DRAG_DISTANCE) {
    *   completeCoverOpen();
    } else*{
        snapCoverClosed();
    }*}


function completeCoverOpen() {*    isAnimating = true;

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

        /*
           Automatic resume behavior:

           If the browser has a saved location, the book opens directly
           to that saved spread.

           No pop-up is required. It behaves like a real bookmark.
        */

        if (savedRightPageO*Open) {
            setSpread(save*RightPageOnOpen, true);
        } *lse {
            setSpread(FIRST_*IGHT_PAGE, true);
        }

     *  resetCoverInlineStyles();

     *  isAnimating = false;
        res*tDragState();
        updateContro*s();
    }, COVER_OPEN_DURATION);
*


function snapCoverClosed() {
  * isAnimating = true;

    frontCov*r.style.transition = `
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

function setupTurningLayer*direction) {
    pageTurnLayer.cla*sName = "";

    pageTurnLayer.cla*sList.add("is-turning");

    page*urnLayer.style.transition = "none"*
    pageTurnLayer.style.transform*= "rotateY(0deg)";

    if (direct*on === "forward") {
        pageTu*nLayer.classList.add("turn-forward");
        turningPageImage.src = getRightPagePath(currentRightPage);
        turningPageImage.alt = `Turning page ${currentRightPage}`;
    }

    if (direction === "backward") {
        pageTurnLayer.classList.add("turn-backward");
        turningPageImage.src = getLeftPagePathForRightPage(currentRightPage);
        turningPageImage.alt = currentRightPage === FIRST_RIGHT_PAGE
            ? "Turning Table of Contents"
            : `Turning page ${currentRightPage - 1}`;
    }
}


/* =========================================================
   FORWARD PAGE DRAGGING
   ========================================================= */

function updateForwardPage*rag() {
    const bookRect = bookC*ntainer.getBoundingClientRect();
 *  const dragDistance = dragStartX * dragCurrentX;

    dragProgress =*clamp(dragDistance / (bookRect.wid*h * 0.42), 0, 1);

    const rotat*on = -180 * dragProgress;
    cons* shadowOpacity = 0.35 + dragProgre*s * 0.35;

    pageTurnLayer.style*transform = `rotateY(${rotation}de*)`;
    pageTurnLayer.style.boxSha*ow = `
        ${-12 - dragProgres* * 24}px 22px 42px rgba(0, 0, 0, $*shadowOpacity}),
        inset 0 0*28px rgba(0, 0, 0, 0.26)
    `;

 *  if (dragProgress > 0.52) {
     *  pageTurnLayer.classList.add("sho*-page-back");
    } else {
       *pageTurnLayer.classList.remove("sh*w-page-back");
    }

    pageTurn*ayer.style.setProperty("--current-*otation", `${rotation}deg`);
}


f*nction finishForwardPageDrag() {
 *  const dragDistance = Math.abs(dr*gCurrentX - dragStartX);

    if (*ragProgress >= DRAG_COMPLETE_THRES*OLD && dragDistance >= MIN_DRAG_DI*TANCE) {
        completeForwardTu*n();
    } else {
        snapBack*orwardTurn();
    }
}


function c*
