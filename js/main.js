/*
==========================================================
THE SHADOW PRINCESS
Interactive Storybook Engine

NEW BUILD:
- Matches new index.html
- No reader screen
- No resume popup
- Cover opens by drag
- Background video starts when cover opens
- TOC + Page 1 load after opening
- Saves location automatically
- Restores last page automatically
- Keyboard navigation
- Drag navigation foundation
==========================================================
*/


document.addEventListener("DOMContentLoaded", () => {



    /*
    ======================================================
    ELEMENTS
    ======================================================
    */


    const cover = document.getElementById("front-cover");

    const backgroundVideo =
        document.getElementById("background-video");

    const openBook =
        document.getElementById("open-book");

    const leftPageImage =
        document.getElementById("left-page-image");

    const rightPageImage =
        document.getElementById("right-page-image");

    const tocButton =
        document.getElementById("toc-button");






    /*
    ======================================================
    BOOK SETTINGS
    ======================================================
    */


    const BOOK_ID = "The_Shadow_Princess";

    const TOTAL_PAGES = 311;


    let currentRightPage = 1;

    let bookOpened = false;


    let dragging = false;

    let startX = 0;







    /*
    ======================================================
    CHAPTER INFORMATION
    ======================================================
    */


    const chapters = [

        {
            folder: "one",
            start: 1,
            end: 18,
            prefix: "Chapter-One-Page-"
        },

        {
            folder: "two",
            start: 19,
            end: 39,
            prefix: "Chapter-Two-Page-"
        },

        {
            folder: "three",
            start: 40,
            end: 59,
            prefix: "Chapter-Three-Page-"
        },

        {
            folder: "four",
            start: 60,
            end: 79,
            prefix: "Chapter-Four-Page-"
        },

        {
            folder: "five",
            start: 80,
            end: 104,
            prefix: "Chapter-Five-Page-"
        },

        {
            folder: "six",
            start: 105,
            end: 130,
            prefix: "Chapter-Six-Page-"
        },

        {
            folder: "seven",
            start: 131,
            end: 159,
            prefix: "Chapter-Seven-page-"
        },

        {
            folder: "eight",
            start: 160,
            end: 183,
            prefix: "Chapter-Eight-page-"
        },

        {
            folder: "nine",
            start: 184,
            end: 209,
            prefix: "Chapter-Nine-page-"
        },

        {
            folder: "ten",
            start: 210,
            end: 233,
            prefix: "Chapter-Ten-page-"
        },

        {
            folder: "eleven",
            start: 234,
            end: 256,
            prefix: "Chapter-Eleven-page-"
        },

        {
            folder: "twelve",
            start: 257,
            end: 281,
            prefix: "Chapter-Twelve-page-"
        },

        {
            folder: "thirteen",
            start: 282,
            end: 311,
            prefix: "Chapter-Thirteen-page-"
        }

    ];







    /*
    ======================================================
    IMAGE PATH FINDER
    ======================================================
    */


    function getPagePath(pageNumber) {


        const chapter = chapters.find(chapter =>

            pageNumber >= chapter.start &&
            pageNumber <= chapter.end

        );



        if (!chapter) {

            return "";

        }



        return `chapters/${chapter.folder}/${chapter.prefix}${pageNumber}.png`;


    }







    /*
    ======================================================
    LOAD BOOK SPREAD

    Left:
    Even page

    Right:
    Odd page

    First opening:
    TOC + Page 1
    ======================================================
    */


    function loadSpread(rightPage) {



        if (rightPage < 1) {

            rightPage = 1;

        }



        if (rightPage > TOTAL_PAGES) {

            rightPage = TOTAL_PAGES;

        }



        currentRightPage = rightPage;



        const leftPage = rightPage - 1;




        if (leftPage < 1) {


            leftPageImage.src =
                "assets/Table-of-Contents1.png";


        }

        else {


            leftPageImage.src =
                getPagePath(leftPage);


        }





        rightPageImage.src =
            getPagePath(rightPage);



        saveProgress();



    }







    /*
    ======================================================
    LOCAL SAVE SYSTEM

    Automatically remembers where the reader stopped.
    ======================================================
    */


    function saveProgress() {


        localStorage.setItem(

            BOOK_ID,

            currentRightPage

        );


    }





    function loadProgress() {


        const savedPage =
            localStorage.getItem(BOOK_ID);



        if(savedPage) {


            currentRightPage =
                Number(savedPage);


        }


    }







    /*
    ======================================================
    OPEN COVER

    User action starts:
    - WebM playback
    - Book opening
    - Loading saved page
    ======================================================
    */


    function openCoverBook() {


        if(bookOpened)
            return;



        bookOpened = true;



        cover.style.transform =
            "rotateY(-180deg)";



        backgroundVideo.play()
            .catch(() => {});




        setTimeout(() => {


            cover.style.display = "none";



            loadProgress();



            loadSpread(currentRightPage);



            tocButton.style.display = "block";



        },1000);



    }







    /*
    ======================================================
    FRONT COVER DRAGGING
    ======================================================
    */


    cover.addEventListener(
        "pointerdown",
        event => {


            startX =
                event.clientX;


            cover.setPointerCapture(
                event.pointerId
            );


        }
    );





    cover.addEventListener(
        "pointerup",
        event => {


            const distance =
                event.clientX - startX;



            if(distance < -100) {


                openCoverBook();


            }



        }
    );








    /*
    ======================================================
    PAGE NAVIGATION
    ======================================================
    */


    function nextPage() {


        if(currentRightPage >= TOTAL_PAGES)
            return;



        loadSpread(
            currentRightPage + 2
        );


    }






    function previousPage() {


        if(currentRightPage <= 1)
            return;



        loadSpread(
            currentRightPage - 2
        );


    }








    /*
    ======================================================
    PAGE DRAGGING

    Left drag = forward
    Right drag = backward
    ======================================================
    */


    openBook.addEventListener(
        "pointerdown",
        event => {


            if(!bookOpened)
                return;



            dragging = true;



            startX =
                event.clientX;



            openBook.setPointerCapture(
                event.pointerId
            );



        }
    );





    openBook.addEventListener(
        "pointerup",
        event => {


            if(!dragging)
                return;



            dragging = false;



            const distance =
                event.clientX - startX;



            if(distance < -150) {


                nextPage();


            }



            if(distance > 150) {


                previousPage();


            }



        }
    );








    /*
    ======================================================
    KEYBOARD CONTROLS
    ======================================================
    */


    document.addEventListener(
        "keydown",
        event => {


            if(!bookOpened)
                return;



            if(event.key === "ArrowRight") {


                nextPage();


            }



            if(event.key === "ArrowLeft") {


                previousPage();


            }



        }
    );








    /*
    ======================================================
    TABLE OF CONTENTS BUTTON
    ======================================================
    */


    tocButton.addEventListener(
        "click",
        () => {


            if(bookOpened) {


                loadSpread(1);


            }


        }
    );



});
