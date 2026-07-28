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

    let imagePaths = [
        "The_Shadow_Princess/assets/front-cover.png",
        "The_Shadow_Princess/assets/Table-of-Contents1.png"
    ];

    chapterMap.forEach(ch => {
        ch.pages.forEach(p => {
            imagePaths.push(`The_Shadow_Princess/chapters/${ch.dir}/Page-${p}.png`);
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
        size: "fixed", // Renders the book at a fixed size in the center
        drawShadow: true, // Realistic curl shadows
        showCover: true, // Keeps cover as a single page, opening to a spread
        usePortrait: false, // Forces spread view
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
