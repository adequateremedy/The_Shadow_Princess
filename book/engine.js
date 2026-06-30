console.log("ENGINE FILE LOADED");

let currentPages = [];
let currentPageIndex = 0;

window.addEventListener("load", () => {
    console.log("ENGINE START TRIGGERED");
    loadChapter(1);

    document.getElementById("btnNext")?.addEventListener("click", nextPage);
    document.getElementById("btnPrev")?.addEventListener("click", prevPage);
});

function loadChapter(chapterNumber) {

    fetch(`chapters/chapter-${chapterNumber}.txt`)
        .then(res => res.text())
        .then(text => {

            const chapter = {
                chapterNumber,
                chapterTitle: "The Shadows",
                text
            };

            currentPages = paginateChapter(chapter);
            currentPageIndex = 0;

            renderPage(currentPages[currentPageIndex]);
        });
}

function nextPage() {
    if (currentPageIndex < currentPages.length - 1) {
        currentPageIndex++;
        renderPage(currentPages[currentPageIndex]);
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderPage(currentPages[currentPageIndex]);
    }
}
