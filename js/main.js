document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    function createPage(imagePath, isHard = false) {
        const page = document.createElement('div');
        page.className = 'page';
        if (isHard) page.dataset.density = 'hard';
        const img = document.createElement('img');
        img.src = imagePath;
        // Ensure image fills the container fully
        img.style.width = '100%';
        img.style.height = '100%';
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // 1. Front Cover (Right side of closed book)
    createPage('assets/front-cover.png', true);
    
    // 2. Backside of Front Cover (Left side when opened)
    createPage('assets/Backside-of-front-cover.png', true);
    
    // 3. TOC Page (Right side when opened)
    createPage('assets/Table-of-Contents.png', false);
    
    // 4. Backside of Back Cover (Right side layer, visible behind TOC/Pages)
    createPage('assets/Backside-of-back-cover.png', true);

    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 450, // Reduced from 500 to make the book slightly smaller
        height: 675, // Reduced proportionally (10% smaller)
        size: "fixed", // Changed to fixed to prevent it from stretching
        showCover: true,
        autoSize: false,
        maxShadowOpacity: 0.5
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});
