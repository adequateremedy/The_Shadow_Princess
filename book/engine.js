console.log("ENGINE FILE LOADED");

// REAL CHAPTER STORAGE (still manual for now)
const chapters = {
    1: {
        number: "Chapter 1",
        title: "The Shadows",
        text: `Left page text goes here. Right now this is still placeholder until your real manuscript is inserted.`
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
        <div class="chapter-text">
            ${chapter.text}
        </div>
    `;

    pageB.innerHTML = `
        <div class="chapter-text">
            Continuation will be handled in pagination step.
        </div>
    `;
});
