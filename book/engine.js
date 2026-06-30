console.log("ENGINE FILE LOADED");

const chapters = {
    1: {
        number: "Chapter 1",
        title: "The Shadows",
        text: `This is your REAL chapter container.

Right now we are preparing the system that will:
- split text across pages
- flow left → right
- prevent overflow breaking words
- support full Chapter 1–13 integration

For now this is controlled text that proves the engine is live.`
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
            Continuation system will be built next (pagination engine)
        </div>
    `;
});
