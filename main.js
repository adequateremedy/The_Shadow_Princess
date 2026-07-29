document.addEventListener('DOMContentLoaded', function() {
    const bookElement = document.getElementById('book');
    const bgVideo = document.getElementById('bg-video');
    let videoPlayed = false;

    const chapterMap = [
        { dir: "One", pages: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] },
        { dir: "Two", pages: [24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39] },
        { dir: "Three", pages: Array.from({length: 20}, (_, i) => i + 40) }, 
        { dir: "Four", pages: [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,75,77,78,79] }, 
        { dir: "Five", pages: Array.from({length: 25}, (_, i) => i + 80) }, 
        { dir: "Six", pages: Array.from({length: 26}, (_, i) => i + 105) }, 
        { dir: "Seven", pages: Array.from({length: 29}, (_, i) => i + 131) }, 
        { dir: "Eight", pages: Array.from({length: 24}, (_, i) => i + 160) }, 
        { dir: "Nine", pages: Array.from({length: 26}, (_, i) => i + 184) }, 
        { dir: "Ten", pages: Array.from({length: 24}, (_, i) => i + 210) }, 
        { dir: "Eleven", pages: Array.from({length: 23}, (_, i) => i + 234) }, 
        { dir: "Twelve", pages: Array.from({length: 25}, (_, i) => i + 257) }, 
        { dir: "Thirteen", pages: Array.from({length: 30}, (_, i) => i + 282) } 
    ];

    // Front matter layout to ensure proper right/left alignments
    let imagePaths = [
        "assets/front-cover.png",         // [0] Cover (Closed book, Right)
        "assets/Blank-Page.png",          // [1] Inside Front Cover (Left)
        "assets/Blank-Page.png",          // [2] Flyleaf (Right)
        "assets/Blank-Page.png",          // [3] Back of Flyleaf (Left)
        "assets/Half-Title-Page.png",     // [4] Half Title (Right)
        "assets/Frontispiece.png",        // [5] Frontispiece (Left)
        "assets/Title-Page.png",          // [6] Title Page (Right)
        "assets/Copyright-Page.png",      // [7] Copyright Page (Left)
        "assets/Dedication-Page.png",     // [8] Dedication (Right)
        "assets/Blank-Page.png",          // [9] Back of Dedication (Left)
        "assets/Table-of-Contents1.png",  // [10] TOC (Right)
        "assets/Blank-Page.png"           // [11] Back of TOC (Left)
    ];

    chapterMap.forEach(ch => {
        ch.pages.forEach(p => {
            imagePaths.push(`chapters/${ch.dir}/Page-${p}.png`);
        });
    });

    imagePaths.forEach((path, index) => {
        const div = document.createElement('div');
        div.className = index === 0 ? 'page page-cover' : 'page';
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Page ${index}`;
        
        div.appendChild(img);
        bookElement.appendChild(div);
    });

    const pageFlip = new St.PageFlip(bookElement, {
        width: 400, // Base width of one page
        height: 600, // Base height of one page
        size: "stretch", // Scales to fit the container natively
        minWidth: 250, // Prevents pages from shrinking to an unreadable size
        maxWidth: 400, // Caps the desktop size so it doesn't take over the screen
        minHeight: 350,
        maxHeight: 600,
        drawShadow: true, 
        showCover: true, 
        usePortrait: true, // Automatically switches to single-page view on mobile vertical screens
        flippingTime: 1000,
        maxShadowOpacity: 0.5
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('flip', (e) => {
        if (!videoPlayed && e.data > 0) {
            bgVideo.play().catch(err => console.log("User interaction required for autoplay:", err));
            videoPlayed = true;
        }
    });
});
