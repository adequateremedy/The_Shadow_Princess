//////////////////////////////////////////////////////////////
// THE SHADOW PRINCESS
// Interactive Storybook Reader
// main.js
//////////////////////////////////////////////////////////////


// ==========================================================
// BOOK DATA
// ==========================================================


const TOTAL_PAGES = 311;


const BOOK_ID = "The_Shadow_Princess";


const STORAGE_KEY = `${BOOK_ID}_progress`;



const chapters = [

    {
        start: 1,
        end: 18,
        folder: "one",
        name: "Chapter-One"
    },

    {
        start: 19,
        end: 39,
        folder: "two",
        name: "Chapter-Two"
    },

    {
        start: 40,
        end: 59,
        folder: "three",
        name: "Chapter-Three"
    },

    {
        start: 60,
        end: 79,
        folder: "four",
        name: "Chapter-Four"
    },

    {
        start: 80,
        end: 104,
        folder: "five",
        name: "Chapter-Five"
    },

    {
        start: 105,
        end: 130,
        folder: "six",
        name: "Chapter-Six"
    },

    {
        start: 131,
        end: 159,
        folder: "seven",
        name: "Chapter-Seven"
    },

    {
        start: 160,
        end: 183,
        folder: "eight",
        name: "Chapter-Eight"
    },

    {
        start: 184,
        end: 209,
        folder: "nine",
        name: "Chapter-Nine"
    },

    {
        start: 210,
        end: 233,
        folder: "ten",
        name: "Chapter-Ten"
    },

    {
        start: 234,
        end: 256,
        folder: "eleven",
        name: "Chapter-Eleven"
    },

    {
        start: 257,
        end: 281,
        folder: "twelve",
        name: "Chapter-Twelve"
    },

    {
        start: 282,
        end: 311,
        folder: "thirteen",
        name: "Chapter-Thirteen"
    }

];






// ==========================================================
// ELEMENT REFERENCES
// ==========================================================


const cover = document.getElementById("front-cover");

const openBook = document.getElementById("open-book");


const leftImage = document.getElementById("left-page-image");

const rightImage = document.getElementById("right-page-image");


const tocButton = document.getElementById("toc-button");


const loadingScreen = document.getElementById("loading-screen");



const resumeWindow = document.getElementById("resume-window");

const resumeYes = document.getElementById("resume-yes");

const resumeNo = document.getElementById("resume-no");






// ==========================================================
// READER STATE
// ==========================================================


let currentRightPage = 1;


let bookOpened = false;


let dragging = false;







// ==========================================================
// FIND IMAGE PATH
// ==========================================================


function getPagePath(pageNumber) {


    if(pageNumber === "toc") {

        return "assets/Table-of-Contents.png";

    }



    const chapter = chapters.find(chapter =>

        pageNumber >= chapter.start &&
        pageNumber <= chapter.end

    );



    if(!chapter) {

        return "";

    }



    return `chapters/${chapter.folder}/${chapter.name}-Page-${pageNumber}.png`;

}







// ==========================================================
// OPEN COVER
// ==========================================================


function openCover() {


    if(bookOpened) return;


    bookOpened = true;



    cover.style.transform = "rotateY(-180deg)";


    cover.style.pointerEvents = "none";



    setTimeout(() => {


        cover.style.display = "none";


        openBook.style.opacity = "1";



        checkSavedProgress();



    }, 900);


}







// ==========================================================
// LOAD SPREAD
// ==========================================================


function loadSpread(rightPage) {



    currentRightPage = rightPage;



    let leftPage = rightPage - 1;



    if(leftPage < 1) {


        leftImage.src = getPagePath("toc");


    }

    else {


        leftImage.src = getPagePath(leftPage);


    }



    rightImage.src = getPagePath(rightPage);



    saveProgress();



    preloadNearbyPages();


}







// ==========================================================
// SAVE POSITION
// ==========================================================


function saveProgress() {


    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify({

            page: currentRightPage

        })

    );


}







// ==========================================================
// CHECK SAVED READING
// ==========================================================


function checkSavedProgress() {


    const saved = localStorage.getItem(STORAGE_KEY);



    if(saved) {


        resumeWindow.style.display = "flex";


    }

    else {


        loadSpread(1);


    }


}







resumeYes.addEventListener(

    "click",

    () => {


        const saved = JSON.parse(

            localStorage.getItem(STORAGE_KEY)

        );


        resumeWindow.style.display = "none";


        loadSpread(saved.page);



    }

);





resumeNo.addEventListener(

    "click",

    () => {


        resumeWindow.style.display = "none";


        localStorage.removeItem(STORAGE_KEY);


        loadSpread(1);



    }

);







// ==========================================================
// PAGE NAVIGATION
// ==========================================================


function nextPage() {


    if(currentRightPage >= TOTAL_PAGES) return;


    loadSpread(currentRightPage + 2);


}




function previousPage() {


    if(currentRightPage <= 1) return;


    loadSpread(currentRightPage - 2);


}








// ==========================================================
// KEYBOARD CONTROLS
// ==========================================================


document.addEventListener(

    "keydown",

    event => {



        if(!bookOpened) return;



        if(event.key === "ArrowRight") {


            nextPage();


        }



        if(event.key === "ArrowLeft") {


            previousPage();


        }


    }

);








// ==========================================================
// TABLE OF CONTENTS BUTTON
// ==========================================================


tocButton.addEventListener(

    "click",

    () => {


        if(bookOpened) {


            loadSpread(1);


        }


    }

);








// ==========================================================
// PRELOAD NEARBY PAGES
// ==========================================================


function preloadNearbyPages() {


    const pages = [

        currentRightPage - 2,

        currentRightPage,

        currentRightPage + 2,

        currentRightPage + 4

    ];



    pages.forEach(page => {



        if(page > 0 && page <= TOTAL_PAGES) {



            const img = new Image();


            img.src = getPagePath(page);



        }


    });


}








// ==========================================================
// DRAG FOUNDATION
// ==========================================================


// Actual page physics will use this system.


// Clicks do NOT turn pages.


let startX = 0;



openBook.addEventListener(

    "pointerdown",

    event => {


        dragging = true;


        startX = event.clientX;


        openBook.setPointerCapture(

            event.pointerId

        );


    }

);





openBook.addEventListener(

    "pointerup",

    event => {



        if(!dragging) return;



        dragging = false;



        let distance =

            event.clientX - startX;



        if(distance < -150) {


            nextPage();


        }



        if(distance > 150) {


            previousPage();


        }



    }

);







// ==========================================================
// INITIALIZATION
// ==========================================================


window.addEventListener(

    "load",

    () => {



        setTimeout(() => {


            loadingScreen.style.display = "none";


        },1200);



        cover.addEventListener(

            "pointerdown",

            openCover

        );


    }

);
