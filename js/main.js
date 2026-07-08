document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');
    const leatherBase = document.getElementById('leather-base');
    const chapterWords = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen"];

    function createPage(imagePath, isHard = false) {
        const page = document.createElement('div');
        page.className = 'page';
        page.dataset.density = isHard ? 'hard' : 'soft';
        const img = document.createElement('img');
        img.src = imagePath;
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // --- CLOSED BOOK ---
    createPage('assets/front-cover.png', true);

    // --- OPEN BOOK SPREAD 1 ---
    // Left: Backside of Front Cover | Right: TOC
    createPage('assets/Backside-of-front-cover.png', true);
    createPage('assets/Table-of-Contents.png', false);

    // --- OPEN BOOK SPREAD 2 ---
    // Left: Blank Page | Right: Chapter One, Page One
    createPage('assets/Blank-Left-Side.png', false);
    createPage('chapters/Chapter_One/Chapter-One-Page-1.png', false);

    // --- SUBSEQUENT SPREADS ---
    // Loop through remaining pages in pairs (Left/Right)
    // Note: We skip Page 1 since it's already defined
    chapterWords.forEach((word, index) => {
        const startPage = (index === 0) ? 2 : 1; 
        for (let i = startPage; i <= 20; i += 2) {
            // Left (Even page)
            createPage(`chapters/Chapter_${word}/Chapter-${word}-Page-${i}.png`, false);
            // Right (Odd page)
            if (i + 1 <= 20) {
                createPage(`chapters/Chapter_${word}/Chapter-${word}-Page-${i + 1}.png`, false);
            }
        }
    });

    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 450, height: 675, size: "fixed", showCover: true, autoSize: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('flip', (e) => {
        leatherBase.style.opacity = (e.data === 0) ? '0' : '1';
    });
});
