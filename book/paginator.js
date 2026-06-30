/*
=========================================
 PIXEL-BOUND PAGINATOR (PHASE 1)
 The Shadow Princess
-----------------------------------------

 This version measures REAL rendered space
 using hidden DOM measurement.

 NO GUESSING.
 NO CHARACTER LIMITS.

 It uses:
 - pageA (Side A)
 - pageB (Side B)

 to determine exact overflow.

=========================================
*/

/**
 * Measure if element overflows its container
 */
function isOverflowing(el) {
    return el.scrollHeight > el.clientHeight;
}

/**
 * Create a hidden measurement box
 */
function createMeasureBox() {
    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.visibility = "hidden";
    box.style.width = "100%";
    box.style.height = "auto";
    box.style.whiteSpace = "normal";
    box.style.fontSize = "12px";
    box.style.lineHeight = "1.6";
    document.body.appendChild(box);
    return box;
}

/**
 * Add word and test overflow
 */
function canFitText(box, text, container) {
    box.innerText = text;
    return box.scrollHeight <= container.clientHeight;
}

/**
 * MAIN PAGINATION ENGINE (PIXEL BASED)
 */
function paginateChapter(chapter) {

    const words = chapter.text.split(/\s+/);

    const pages = [];

    let currentText = "";
    let isLeft = true;

    // we measure against REAL DOM boxes
    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    const measureBox = createMeasureBox();

    function flushPage(text, chapterStart = false) {

        pages.push({
            side: isLeft ? "A" : "B",
            chapterStart: chapterStart && isLeft,
            chapterNumber: chapter.chapterNumber,
            chapterTitle: chapter.chapterTitle,
            text: text.trim()
        });

        currentText = "";
        isLeft = !isLeft;
    }

    for (let word of words) {

        let testText = currentText + " " + word;

        measureBox.innerText = testText;

        let container = isLeft ? pageA : pageB;

        if (measureBox.scrollHeight > container.clientHeight) {

            flushPage(currentText, pages.length === 0);

            currentText = word;

        } else {
            currentText = testText;
        }
    }

    if (currentText.length > 0) {
        flushPage(currentText, pages.length === 0);
    }

    document.body.removeChild(measureBox);

    return pages;
}
