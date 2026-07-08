document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');
    const chapterWords = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen"];

    function createPage(imagePath) {
        const page = document.createElement('div');
        page.className = 'page';
        const img = document.createElement('img');
        img.src = imagePath;
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // Sequence for turning parchment
    createPage('assets/Table-of-Contents.png'); // Right
    createPage('assets/Blank-Left-Side.png');   // Left
    
    chapterWords.forEach((word) => {
        for (let i = 1; i <= 20; i++) {
            createPage(`chapters/Chapter_${word}/Chapter-${word}-Page-${i}.png`);
        }
    });

    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 450, height: 675, size: "fixed", showCover: false, autoSize: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});
