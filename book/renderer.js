console.log("RENDERER LOADED");

function renderPage(spread) {

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    pageA.innerHTML = "";
    pageB.innerHTML = "";

    if (!spread) {
        return;
    }

    renderLeftPage(pageA, spread);

    renderRightPage(pageB, spread);

}

function renderLeftPage(container, spread) {

    if (spread.chapterStart) {

        const chapterNumber = document.createElement("div");
        chapterNumber.className = "chapter-number";
        chapterNumber.textContent = `Chapter ${spread.chapterNumber}`;

        const chapterTitle = document.createElement("div");
        chapterTitle.className = "chapter-title";
        chapterTitle.textContent = spread.chapterTitle;

        container.appendChild(chapterNumber);
        container.appendChild(chapterTitle);

    }

    const body = document.createElement("div");
    body.className = "chapter-text";
    body.textContent = spread.left || "";

    container.appendChild(body);

}

function renderRightPage(container, spread) {

    const body = document.createElement("div");
    body.className = "chapter-text";
    body.textContent = spread.right || "";

    container.appendChild(body);

}
