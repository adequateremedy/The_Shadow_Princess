console.log("ENGINE FILE LOADED");

const currentChapter = 1;

function loadChapter(chapterNumber) {
    const path = `chapters/chapter-${chapterNumber}.txt`;

    console.log("LOADING:", path);

    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load chapter file");
            }
            return response.text();
        })
        .then(text => {
            renderChapter(chapterNumber, text);
        })
        .catch(err => {
            console.error(err);

            renderChapter(chapterNumber, "ERROR LOADING CHAPTER");
        });
}

function renderChapter(chapterNumber, text) {
    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    const title = `The Shadows`;
    const number = `Chapter ${chapterNumber}`;

    pageA.innerHTML = `
        <div class="chapter-number">${number}</div>
        <div class="chapter-title">${title}</div>
        <div class="chapter-text">
            ${text}
        </div>
    `;

    pageB.innerHTML = `
        <div class="chapter-text">
            Page 2 placeholder (pagination comes next)
        </div>
    `;
}

window.addEventListener("load", () => {
    console.log("ENGINE START TRIGGERED");
    loadChapter(currentChapter);
});
