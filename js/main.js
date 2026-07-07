document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    const chapterWords = [
        "One", "Two", "Three", "Four", "Five", "Six", "Seven", 
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen"
    ];

    // 1. Page 1 (Right): Front Cover
    const frontCover = document.createElement('div');
    frontCover.className = 'page';
    frontCover.style.backgroundImage = "url('assets/front-cover.png')";
    flipbookContainer.appendChild(frontCover);

    // 2. Page 2 (Left): Backside of Front Cover
    const insideFrontCover = document.createElement('div');
    insideFrontCover.className = 'page';
    insideFrontCover.style.backgroundImage = "url('assets/Backside-of-front-cover.png')";
    flipbookContainer.appendChild(insideFrontCover);

    // 3. Page 3 (Right): Table of Contents
    const tocPage = document.createElement('div');
    tocPage.className = 'page';
    tocPage.style.backgroundImage = "url('assets/Table-of-Contents.png')";
    flipbookContainer.appendChild(tocPage);

    // 4. Page 4 (Left): Blank Left Side (Back of TOC)
    const blankTOCBack = document.createElement('div');
    blankTOCBack.className = 'page';
    blankTOCBack.style.backgroundImage = "url('assets/Blank-Left-Side.png')";
    flipbookContainer.appendChild(blankTOCBack);

    // Pages 5 through 264: Chapter Pages
    chapterWords.forEach(word => {
        const folderName = `Chapter_${word}`;
        for (let i = 1; i <= 20; i++) {
            const page = document.createElement('div');
            page.className = 'page';
            page.style.backgroundImage = `url('chapters/${folderName}/Chapter-${word}-Page-${i}.png')`;
            flipbookContainer.appendChild(page);
        }
    });

    // Page 265 (Right): Blank Right Side (Opposite Ch 13, Pg 20)
    const blankAfterStory = document.createElement('div');
    blankAfterStory.className = 'page';
    blankAfterStory.style.backgroundImage = "url('assets/Blank-Right-Side.png')";
    flipbookContainer.appendChild(blankAfterStory);

    // Page 266 (Left): Backside of Back Cover
    const insideBackCover = document.createElement('div');
    insideBackCover.className = 'page';
    insideBackCover.style.backgroundImage = "url('assets/Backside-of-back-cover.png')";
    flipbookContainer.appendChild(insideBackCover);

    // Page 267 (Right): Blank Right Side (To allow book to fully close)
    const finalBlankPage = document.createElement('div');
    finalBlankPage.className = 'page';
    finalBlankPage.style.backgroundImage = "url('assets/Blank-Right-Side.png')";
    flipbookContainer.appendChild(finalBlankPage);

    // Initialize PageFlip
    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 500, 
        height: 750, 
        size: "stretch", 
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
