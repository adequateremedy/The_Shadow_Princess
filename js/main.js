document.addEventListener('DOMContentLoaded', function() {
    const flipbookContainer = document.getElementById('flipbook');

    function createPage(imagePath, isHard = false) {
        const page = document.createElement('div');
        page.className = 'page';
        if (isHard) page.dataset.density = 'hard';
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.width = '100%';
        img.style.height = '100%';
        page.appendChild(img);
        flipbookContainer.appendChild(page);
    }

    // 1. Front Cover (Right side)
    createPage('assets/front-cover.png', true);
    
    // 2. Backside of Front Cover (Left side)
    createPage('assets/Backside-of-front-cover.png', true);
    
    // 3. TOC Page (Right side)
    createPage('assets/Table-of-Contents.png', false);
    
    // 4. Blank Left Side (Backside of TOC)
    createPage('assets/Blank-Left-Side.png', false);

    // 5. Backside of Back Cover (Bottom layer on right side)
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
