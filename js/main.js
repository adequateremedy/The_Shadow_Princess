document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    function createPage(imagePath, isHard = false) {
        const page = document.createElement('div');
        page.className = 'page';
        page.dataset.density = isHard ? 'hard' : 'soft';
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.width = '100%';
        img.style.height = '100%';
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // 1. Front Cover (Right)
    createPage('assets/front-cover.png', true);
    // 2. Backside of Front Cover (Left)
    createPage('assets/Backside-of-front-cover.png', true);
    
    // 3. TOC Page (Right)
    createPage('assets/Table-of-Contents.png', false);
    // 4. Blank Left Side (Back of TOC - Left)
    createPage('assets/Blank-Left-Side.png', false);
    
    // 5. Chapter 1 Pages (Looping through 1 to 20)
    for (let i = 1; i <= 20; i++) {
        createPage(`chapters/Chapter_One/Chapter-One-Page-${i}.png`, false);
    }
    
    // 6. Backside of Back Cover (Final Base Layer)
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
