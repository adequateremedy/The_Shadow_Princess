console.log("RENDERER LOADED");

function renderPage(pageData) {

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    pageA.innerHTML = "";
    pageB.innerHTML = "";

    if (!pageData) return;

    // LEFT SIDE
    if (pageData.left || pageData.chapterStart) {

        const num = document.createElement("div");
        num.className = "chapter-number";
        num.innerText = `Chapter ${pageData.chapterNumber}`;

        const title = document.createElement("div");
        title.className = "chapter-title";
        title.innerText = pageData.chapterTitle;

        pageA.appendChild(num);
        pageA.appendChild(title);
    }

    const leftText = document.createElement("div");
    leftText.className = "chapter-text";
    leftText.innerText = pageData.left;

    pageA.appendChild(leftText);

    // RIGHT SIDE
    const rightText = document.createElement("div");
    rightText.className = "chapter-text";
    rightText.innerText = pageData.right;

    pageB.appendChild(rightText);
}
