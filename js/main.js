document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    function createPage(imagePath, isHard = false) {
        const page = document.createElement('div');
        page.className = 'page';
        // 'hard' density for covers (stationary hinges), 'soft' for turning pages
        page.dataset.density = isHard ? 'hard' : 'soft';
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.width = '100%';
        img.style.height = '100%';
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // --- BASE LAYERS (The "Inside" of the book) ---
    // 1. Front Cover (Closed)
    createPage('assets/front-cover.png', true);
    // 2. Backside of Front Cover (Base layer, Left side)
    createPage('assets/Backside-of-front-cover.png', true);
    
    // --- TURNING PAGES ---
    // 3. TOC Page (Right)
    createPage('assets/Table-of-Contents.png', false);
    // 4. Blank Left Side (Back of TOC)
    createPage('assets/Blank-Left-Side.png', false);
    
    // 5. Chapter 1, Page 1 (Right)
    createPage('chapters/Chapter_One/Chapter-One-Page-1.png', false);
    // 6. Chapter 1, Page 2 (Left - Back of Pg 1)
    createPage('chapters/Chapter_One/Chapter-One-Page-2.png', false);
    
    // --- BASE LAYER (Backside of back cover, right side base) ---
    // 7. Backside of Back Cover (Bottom layer, Right side)
    createPage('assets/Backside-of-back-cover.png', true);

    const pageFlip = new St.PageFlip(flipbookContainer, {
        width: 450, 
        height: 675, 
        size: "fixed", 
        showCover: true,
        autoSize: false,
        maxShadowOpacity: 0.5
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
});
