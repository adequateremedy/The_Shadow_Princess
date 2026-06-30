/*
=========================================
 The Shadow Princess
 Renderer Engine
-----------------------------------------

 PURPOSE:
 This module takes "paged data" from the
 paginator and displays it on screen.

 IT IS RESPONSIBLE FOR:

 • Writing chapter number + title (LEFT only)
 • Writing body text (LEFT + RIGHT)
 • Injecting images when required
 • Respecting page boundaries (Side A / B)

 ----------------------------------------

 PAGE TARGETS (FROM index.html):

 #pageA = LEFT PAGE (Side A)
 #pageB = RIGHT PAGE (Side B)

 ----------------------------------------

 RENDER RULES:

 LEFT PAGE (Side A):
 - Chapter Number (if chapter start)
 - Chapter Title (if chapter start)
 - Body text below

 RIGHT PAGE (Side B):
 - Body text only
 - NO chapter header allowed

 IMAGE RULE:
 - If page.type === "image"
   → replace entire page content

 =========================================
*/

// DOM targets (will connect later)
const pageA = document.getElementById("pageA");
const pageB = document.getElementById("pageB");

/**
 * Clears a page before rendering new content
 */
function clearPage(page) {
    page.innerHTML = "";
}

/**
 * Renders a text page
 */
function renderText(page, data, isLeft) {
    clearPage(page);

    // LEFT page can show chapter header
    if (isLeft && data.chapterStart) {

        const number = document.createElement("div");
        number.className = "chapter-number";
        number.textContent = data.chapterNumber;

        const title = document.createElement("div");
        title.className = "chapter-title";
        title.textContent = data.chapterTitle;

        page.appendChild(number);
        page.appendChild(title);
    }

    const text = document.createElement("div");
    text.className = "chapter-text";
    text.textContent = data.text;

    page.appendChild(text);
}

/**
 * Renders an image page (FULL REPLACEMENT RULE)
 */
function renderImage(page, imageSrc) {
    clearPage(page);

    const img = document.createElement("img");
    img.className = "page-image";
    img.src = imageSrc;

    page.appendChild(img);
}

/**
 * Main render call (placeholder for now)
 */
function renderPage(leftData, rightData) {
    renderText(pageA, leftData, true);

    if (rightData.type === "image") {
        renderImage(pageB, rightData.src);
    } else {
        renderText(pageB, rightData, false);
    }
}
