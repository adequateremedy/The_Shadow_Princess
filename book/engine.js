console.log("ENGINE FILE LOADED");

const chapters = {
    1: {
        title: "The Shadows",
        number: "Chapter 1",
        text: "THIS WILL BE REPLACED WITH REAL CHAPTER TEXT NEXT STEP."
    }
};

window.addEventListener("load", () => {
    console.log("ENGINE START TRIGGERED");

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    const chapter = chapters[1];

    pageA.innerHTML = `
        <div class="chapter-number">${chapter.number}</div>
        <div class="chapter-title">${chapter.title}</div>
        <div class="chapter-text" id="chapterTextA">
            ${chapter.text}
        </div>
    `;

    pageB.innerHTML = `
        <div class="chapter-text" id="chapterTextB">
            Continuation will be handled next step.
        </div>
    `;
});
