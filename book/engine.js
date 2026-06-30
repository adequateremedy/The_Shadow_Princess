console.log("ENGINE FILE LOADED");

window.addEventListener("load", () => {
    console.log("ENGINE START TRIGGERED");
    loadChapter(1);
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

            runPaginationPipeline(chapter);
        });
}

function runPaginationPipeline(chapter) {

    // STEP 1: paginate (your pixel system)
    const pages = paginateChapter(chapter);

    // STEP 2: render
    const left = pages.find(p => p.side === "A") || null;
    const right = pages.find(p => p.side === "B") || null;

    renderPage(left, right);
}
