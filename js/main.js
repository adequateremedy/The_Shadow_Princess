// main.js
document.addEventListener('DOMContentLoaded', function() {
    const bookContainer = document.getElementById('book');

    // 1. Add Front Cover
    bookContainer.innerHTML += `
        <div class="page page-cover" data-density="hard">
            <div class="page-content">
                <img src="assets/front-cover.png" alt="Front Cover">
            </div>
        </div>
    `;

    // 2. Add TOC (Inside of front cover - Left side)
    bookContainer.innerHTML += `
        <div class="page">
            <div class="page-content">
                <img src="assets/Table-of-Contents1.png" alt="Table of Contents">
            </div>
        </div>
    `;

    // 3. Helper to determine the exact path and filename casing for the 311 pages
    function getPagePath(pageNum) {
        if (pageNum >= 1 && pageNum <= 18) return `chapters/one/Chapter-One-Page-${pageNum}.png`;
        if (pageNum >= 19 && pageNum <= 39) return `chapters/two/Chapter-Two-Page-${pageNum}.png`;
        if (pageNum >= 40 && pageNum <= 59) return `chapters/three/Chapter-Three-Page-${pageNum}.png`;
        if (pageNum >= 60 && pageNum <= 79) return `chapters/four/Chapter-Four-Page-${pageNum}.png`;
        if (pageNum >= 80 && pageNum <= 104) return `chapters/five/Chapter-Five-Page-${pageNum}.png`;
        if (pageNum >= 105 && pageNum <= 130) return `chapters/six/Chapter-Six-Page-${pageNum}.png`;
        
        // Note: Chapters 7-13 use lowercase 'page' in the filename based on the provided list
        if (pageNum >= 131 && pageNum <= 159) return `chapters/seven/Chapter-Seven-page-${pageNum}.png`;
        if (pageNum >= 160 && pageNum <= 183) return `chapters/eight/Chapter-Eight-page-${pageNum}.png`;
        if (pageNum >= 184 && pageNum <= 209) return `chapters/nine/Chapter-Nine-page-${pageNum}.png`;
        if (pageNum >= 210 && pageNum <= 233) return `chapters/ten/Chapter-Ten-page-${pageNum}.png`;
        if (pageNum >= 234 && pageNum <= 256) return `chapters/eleven/Chapter-Eleven-page-${pageNum}.png`;
        if (pageNum >= 257 && pageNum <= 281) return `chapters/twelve/Chapter-Twelve-page-${pageNum}.png`;
        if (pageNum >= 282 && pageNum <= 311) return `chapters/thirteen/Chapter-Thirteen-page-${pageNum}.png`;
        return '';
    }

    // 4. Generate Pages 1 through 311
    for (let i = 1; i <= 311; i++) {
        bookContainer.innerHTML += `
            <div class="page">
                <div class="page-content">
                    <img src="${getPagePath(i)}" alt="Page ${i}">
                </div>
            </div>
        `;
    }

    // 5. Initialize PageFlip
    const pageFlip = new St.PageFlip(bookContainer, {
        width: 500, // Base width for aspect ratio
        height: 700, // Base height for aspect ratio
        size: "stretch",
        minWidth: 300,
        maxWidth: 800,
        minHeight: 400,
        maxHeight: 1120,
        showCover: true, // Ensures Front Cover acts as a closed book starting on the right
        mobileScrollSupport: false,
        usePortrait: false // Forces two-page spread view
    });

    // Load generated HTML pages into the flipbook
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // 6. Handle Video/Audio Playback on Book Open
    const video = document.getElementById('bg-video');
    let hasPlayed = false;

    pageFlip.on('flip', (e) => {
        // e.data contains the target page index. If moving past the cover (index 0)
        if (e.data >= 1 && !hasPlayed) {
            video.play().then(() => {
                hasPlayed = true;
            }).catch(err => {
                console.warn("Autoplay blocked by browser. User interaction usually resolves this.", err);
            });
        }
    });
});
