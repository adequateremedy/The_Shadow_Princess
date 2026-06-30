console.log("ENGINE LOADED");

let bookPages = [];
let currentSpread = 0;
let currentChapter = 1;

window.addEventListener("load", () => {

    console.log("ENGINE STARTED");

    const prevButton = document.getElementById("btnPrev");
    const nextButton = document.getElementById("btnNext");

    if (prevButton) {
        prevButton.addEventListener("click", previousSpread);
    }

    if (nextButton) {
        nextButton.addEventListener("click", nextSpread);
    }

    loadChapter(currentChapter);

});

async function loadChapter(chapterNumber) {

    currentChapter = chapterNumber;

    try {

        const response = await fetch(`chapters/chapter-${chapterNumber}.txt`);

        if (!response.ok) {
            throw new Error(`Unable to load chapter ${chapterNumber}`);
        }

        const chapterText = await response.text();

        const chapter = {

            chapterNumber: chapterNumber,

            chapterTitle: getChapterTitle(chapterNumber),

            text: chapterText

        };

        bookPages = paginateChapter(chapter);

        currentSpread = 0;

        showCurrentSpread();

    }
    catch (error) {

        console.error(error);

    }

}

function showCurrentSpread() {

    if (bookPages.length === 0) {
        return;
    }

    renderPage(bookPages[currentSpread]);

}

function nextSpread() {

    if (currentSpread >= bookPages.length - 1) {
        return;
    }

    currentSpread++;

    showCurrentSpread();

}

function previousSpread() {

    if (currentSpread <= 0) {
        return;
    }

    currentSpread--;

    showCurrentSpread();

}

function getChapterTitle(chapterNumber) {

    const titles = {

        1: "The Shadows",
        2: "Chapter Two",
        3: "Chapter Three",
        4: "Chapter Four",
        5: "Chapter Five",
        6: "Chapter Six",
        7: "Chapter Seven",
        8: "Chapter Eight",
        9: "Chapter Nine",
        10: "Chapter Ten",
        11: "Chapter Eleven",
        12: "Chapter Twelve",
        13: "The Bridge"

    };

    return titles[chapterNumber] || `Chapter ${chapterNumber}`;

}
