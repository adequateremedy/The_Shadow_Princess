/*
=========================================
 ENGINE CORE (WIRED VERSION)
 The Shadow Princess
-----------------------------------------

 Now fully connects:

 loader → paginator → renderer

=========================================
*/

let chapters = [];
let currentChapterIndex = 0;
let currentPageIndex = 0;

let paginatedPages = [];

/**
 * START ENGINE
 */
async function initBookEngine() {

    console.log("Book Engine Starting...");

    // 1. Load chapter index
    chapters = await loadChapters();

    console.log("Loaded chapters:", chapters.length);

    // 2. Load first chapter fully
    await loadAndPrepareChapter(0);
}

/**
 * LOAD + PAGINATE CHAPTER
 */
async function loadAndPrepareChapter(index) {

    currentChapterIndex = index;

    const chapterMeta = chapters[index];

    // load full chapter text
    const fullChapter = await loadFullChapter(index);

    // paginate using pixel engine
    paginatedPages = paginateChapter(fullChapter);

    console.log("Pages created:", paginatedPages.length);

    // reset page index
    currentPageIndex = 0;

    // render first spread
    renderCurrentSpread();
}

/**
 * RENDER CURRENT LEFT + RIGHT PAGES
 */
function renderCurrentSpread() {

    const leftPage = paginatedPages[currentPageIndex];
    const rightPage = paginatedPages[currentPageIndex + 1];

    renderPage(leftPage || emptyPage(), rightPage || emptyPage());
}

/**
 * EMPTY PAGE FALLBACK
 */
function emptyPage() {
    return {
        chapterStart: false,
        chapterNumber: "",
        chapterTitle: "",
        text: ""
    };
}

/**
 * NEXT PAGE (LEFT → RIGHT → NEXT SPREAD)
 */
function nextPage() {

    currentPageIndex += 2;

    if (currentPageIndex >= paginatedPages.length) {

        console.log("End of chapter reached");

        // TODO: trigger chapter advance or loop
        return;
    }

    renderCurrentSpread();
}

/**
 * PREVIOUS PAGE
 */
function prevPage() {

    currentPageIndex -= 2;

    if (currentPageIndex < 0) {
        currentPageIndex = 0;
    }

    renderCurrentSpread();
}

/**
 * BOOT ENGINE ON LOAD
 */
window.addEventListener("load", () => {
    initBookEngine();
});
