console.log("PAGINATOR LOADED");

function paginateChapter(chapter) {

    const words = chapter.text.split(/\s+/);

    const pages = [];

    let currentText = "";
    let isLeft = true;

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    const measureBox = document.createElement("div");
    measureBox.style.position = "absolute";
    measureBox.style.visibility = "hidden";
    measureBox.style.width = "100%";
    measureBox.style.fontSize = "12px";
    measureBox.style.lineHeight = "1.6";

    document.body.appendChild(measureBox);

    function flush() {

        pages.push({
            left: isLeft ? currentText.trim() : "",
            right: isLeft ? "" : currentText.trim(),
            chapterNumber: chapter.chapterNumber,
            chapterTitle: chapter.chapterTitle,
            chapterStart: pages.length === 0
        });

        currentText = "";
        isLeft = !isLeft;
    }

    for (let word of words) {

        let testText = currentText + " " + word;

        measureBox.innerText = testText;

        const container = isLeft ? pageA : pageB;

        if (measureBox.scrollHeight > container.clientHeight) {
            flush();
            currentText = word;
        } else {
            currentText = testText;
        }
    }

    if (currentText.trim().length > 0) {
        flush();
    }

    document.body.removeChild(measureBox);

    return pages;
}
