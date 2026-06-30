/*
=========================================
 REAL DATA LOADER
 The Shadow Princess
-----------------------------------------

 Now connects to actual repository files:
 - data/chapters.json
 - chapters/chapter-X.txt

=========================================
*/

/**
 * Load chapter index (titles + ordering)
 */
async function loadChapters() {
    try {
        const res = await fetch("data/chapters.json");
        const data = await res.json();

        return data.chapters;
    } catch (err) {
        console.error("Failed to load chapters.json:", err);
        return [];
    }
}

/**
 * Load raw chapter text file
 */
async function loadChapterText(chapterNumber) {
    try {
        const res = await fetch(`chapters/chapter-${chapterNumber}.txt`);
        const text = await res.text();

        return text;
    } catch (err) {
        console.error(`Failed to load chapter-${chapterNumber}.txt`, err);
        return "";
    }
}

/**
 * Load full chapter (metadata + text)
 */
async function loadFullChapter(chapterIndex) {
    const chapters = await loadChapters();

    const chapterMeta = chapters[chapterIndex];

    const rawText = await loadChapterText(chapterMeta.number);

    return {
        chapterNumber: chapterMeta.number,
        chapterTitle: chapterMeta.title,
        text: rawText
    };
}
