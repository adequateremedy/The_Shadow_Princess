document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    // Array mapping chapter numbers to their exact word equivalents for folder and file names
    const chapterWords = [
        "One", "Two", "Three", "Four", "Five", "Six", "Seven", 
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen"
    ];

    // 1. Front Cover
    const frontCover = document.createElement('div');
    frontCover.className = 'page';
    frontCover.style.backgroundImage = "url('assets/front-cover.png')";
    flipbookContainer.appendChild(frontCover);

    // 2. Inside Front Cover
    const insideFrontCover = document.createElement('div');
    insideFrontCover.className = 'page inside-cover';
    flipbookContainer.appendChild(insideFrontCover);

    // 3. Table of Contents
    const tocPage = document.createElement('div');
    tocPage.className = 'page';
    tocPage.style.backgroundImage = "url('assets/Table-of-Contents.png')";
    flipbookContainer.appendChild(tocPage);

    // 4. Chapter Pages (13 chapters, 20 pages each)
    chapterWords.forEach(word => {
        const folderName = `chapter ${word.toLowerCase()}`;
        for (let i = 1; i <= 20; i++) {
            const page = document.createElement('div');
            page.className = 'page';
            page.style.backgroundImage = `url('chapters/${folderName}/Chapter ${word} - Page ${i}.png')`;
            flipbookContainer.appendChild(page);
        }
    });

    // 5. Inside Back Cover
    const insideBackCover = document.createElement('div');
    insideBackCover.className = 'page inside-cover';
    flipbookContainer.appendChild(insideBackCover);

    // Initialize PageFlip
    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 500, // Base page width
        height: 750, // Base page height 
        size: "stretch", // Allows the book to maintain aspect ratio while scaling to the screen
        minWidth: 300,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1500,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false
    });

    // Load all generated pages into the flipbook
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});
