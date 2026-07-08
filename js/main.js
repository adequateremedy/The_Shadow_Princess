document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');
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

    // 1. Page One: Front Cover (Hard)
    createPage('assets/front-cover.png', true);
    // 2. Page Two: Backside of front cover
    createPage('assets/Backside-of-front-cover.png', true);
    // 3. Page Three: TOC page
    createPage('assets/Table-of-Contents.png', false);
    // 4. Page Four: Blank left side page
    createPage('assets/Blank-Left-Side.png', false);

    // 5. Pages 5 through 264: Chapter pages
    chapterWords.forEach((word) => {
        for (let i = 1; i <= 20; i++) {
            createPage(`chapters/Chapter_${word}/Chapter-${word}-Page-${i}.png`, false);
        }
    });

    // Note: The library will automatically handle the last page (Chapter 13, Page 20)
    // as the final static element in the flip sequence.

    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 450, 
        height: 675, 
        size: "fixed", 
        showCover: true, 
        autoSize: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});
