/*
=========================================
 RENDERER (DOM WIRED VERSION)
 The Shadow Princess
-----------------------------------------

 Takes paginated data and injects it into:
 - pageA (left)
 - pageB (right)

 Handles:
 ✔ Chapter headers (left only)
 ✔ Text rendering
 ✔ Clean resets between pages
 ✔ Image override mode (future-ready)

=========================================
*/

/**
 * MAIN RENDER FUNCTION
 */
function renderPage(leftPage, rightPage) {

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    // SAFETY CLEAN
    pageA.innerHTML = "";
    pageB.innerHTML = "";

    // Render LEFT (Side A)
    if (leftPage) {
        renderSinglePage(pageA, leftPage, true);
    }

    // Render RIGHT (Side B)
    if (rightPage) {
        renderSinglePage(pageB, rightPage, false);
    }
}

/**
 * RENDER SINGLE PAGE
 */
function renderSinglePage(container, pageData, isLeft) {

    // IMAGE MODE (future use)
    if (pageData.image) {
        const img = document.createElement("img");
        img.src = pageData.image;
        img.className = "page-image";

        container.appendChild(img);
        return;
    }

    // CHAPTER HEADER (LEFT SIDE ONLY + ONLY AT CHAPTER START)
    if (isLeft && pageData.chapterStart) {

        const num = document.createElement("div");
        num.className = "chapter-number";
        num.innerText = `Chapter ${pageData.chapterNumber}`;

        const title = document.createElement("div");
        title.className = "chapter-title";
        title.innerText = pageData.chapterTitle;

        container.appendChild(num);
        container.appendChild(title);
    }

    // BODY TEXT
    const text = document.createElement("div");
    text.className = "chapter-text";
    text.innerText = pageData.text;

    container.appendChild(text);
}
