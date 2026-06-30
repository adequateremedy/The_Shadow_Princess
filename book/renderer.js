console.log("RENDERER LOADED");

function renderPage(leftPage, rightPage) {

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    pageA.innerHTML = "";
    pageB.innerHTML = "";

    if (leftPage) {
        renderSide(pageA, leftPage, true);
    }

    if (rightPage) {
        renderSide(pageB, rightPage, false);
    }
}

function renderSide(container, pageData, isLeft) {

    if (isLeft) {
        const num = document.createElement("div");
        num.className = "chapter-number";
        num.innerText = `Chapter ${pageData.chapterNumber}`;

        const title = document.createElement("div");
        title.className = "chapter-title";
        title.innerText = pageData.chapterTitle;

        container.appendChild(num);
        container.appendChild(title);
    }

    const text = document.createElement("div");
    text.className = "chapter-text";
    text.innerText = pageData.text;

    container.appendChild(text);
}
