document.addEventListener("DOMContentLoaded", () => {


    /*
    ======================================================
    THE SHADOW PRINCESS
    Interactive Book Engine

    Features:
    - Drag front cover open
    - Start background WebM/audio after opening
    - Load TOC + Page 1
    - Drag pages forward/backward
    - Keyboard page turning
    - Save reading position locally
    ======================================================
    */





    const book = document.getElementById("book");

    const cover = document.getElementById("front-cover");

    const backgroundVideo = document.getElementById("background-video");

    const openBook = document.getElementById("open-book");

    const leftPageImage = document.getElementById("left-page-image");

    const rightPageImage = document.getElementById("right-page-image");

    const turningPage = document.getElementById("turning-page");

    const turningPageImage = document.getElementById("turning-page-image");

    const tocButton = document.getElementById("toc-button");





    /*
    ======================================================
    BOOK DATA
    ======================================================
    */


    const BOOK_ID = "The_Shadow_Princess";


    const TOTAL_PAGES = 311;


    const chapters = [

        {
            folder: "one",
            start: 1,
            end: 18
        },

        {
            folder: "two",
            start: 19,
            end: 39
        },

        {
            folder: "three",
            start: 40,
            end: 59
        },

        {
            folder: "four",
            start: 60,
            end: 79
        },

        {
            folder: "five",
            start: 80,
            end: 104
        },

        {
            folder: "six",
            start: 105,
            end: 130
        },

        {
            folder: "seven",
            start: 131,
            end: 159
        },

        {
            folder: "eight",
            start: 160,
            end: 183
        },

        {
            folder: "nine",
            start: 184,
            end: 209
        },

        {
            folder: "ten",
            start: 210,
            end: 233
        },

        {
            folder: "eleven",
            start: 234,
            end: 256
        },

        {
            folder: "twelve",
            start: 257,
            end: 281
        },

        {
            folder: "thirteen",
            start: 282,
            end: 311
        }

    ];





    let coverOpened = false;

    let currentRightPage = 1;

    let dragging = false;

    let startX = 0;

    let currentX = 0;






    /*
    ======================================================
    PAGE PATH FINDER
    ======================================================
    */


    function getPagePath(pageNumber) {


        for (let chapter of chapters) {


            if (
                pageNumber >= chapter.start &&
                pageNumber <= chapter.end
            ) {


                let chapterName =
                    chapter.folder.charAt(0).toUpperCase() +
                    chapter.folder.slice(1);



                return `chapters/${chapter.folder}/Chapter-${chapterName}-Page-${pageNumber}.png`;

            }


        }


        return "";

    }







    /*
    ======================================================
    LOAD PAGE SPREAD
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



        let leftPage = rightPage - 1;



        if (leftPage <= 0) {


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

    Saves the reader's current location.
    ======================================================
    */


    function saveProgress() {


        localStorage.setItem(

            BOOK_ID,

            currentRightPage

        );


    }






    function loadSavedProgress() {


        let savedPage =
            localStorage.getItem(BOOK_ID);



        if(savedPage) {


            currentRightPage =
                Number(savedPage);


        }


    }







    /*
    ======================================================
    OPEN COVER

    This begins the reading experience.
    ======================================================
    */


    function openCover() {


        if(coverOpened)
            return;



        coverOpened = true;




        cover.style.transform =
            "rotateY(-180deg)";



        setTimeout(() => {


            cover.style.display = "none";

            openBook.style.display = "flex";

            tocButton.style.display = "block";



            backgroundVideo.muted = false;


            backgroundVideo.play()
            .catch(() => {});



            loadSavedProgress();


            loadSpread(currentRightPage);



        },1200);



    }







    /*
    ======================================================
    COVER DRAGGING
    ======================================================
    */


    cover.addEventListener(
        "pointerdown",
        (event)=>{


            startX =
                event.clientX;


            cover.setPointerCapture(
                event.pointerId
            );


        }
    );





    cover.addEventListener(
        "pointermove",
        (event)=>{


            if(coverOpened)
                return;


            currentX =
                event.clientX -
                startX;



            if(currentX < 0) {


                let rotation =
                    Math.max(
                        -160,
                        currentX / 3
                    );


                cover.style.transform =
                    `rotateY(${rotation}deg)`;

            }


        }
    );





    cover.addEventListener(
        "pointerup",
        ()=>{


            if(currentX < -120) {


                openCover();


            }
            else {


                cover.style.transform =
                    "rotateY(0deg)";


            }



            currentX = 0;



        }
    );








    /*
    ======================================================
    PAGE TURNING
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
    DRAG PAGE TURNING
    ======================================================
    */


    openBook.addEventListener(
        "pointerdown",
        (event)=>{


            if(!coverOpened)
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
        (event)=>{


            if(!dragging)
                return;



            let distance =
                event.clientX - startX;



            dragging = false;



            if(distance < -120) {


                nextPage();


            }


            else if(distance > 120) {


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
        (event)=>{


            if(!coverOpened)
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
    RETURN TO TABLE OF CONTENTS
    ======================================================
    */


    tocButton.addEventListener(
        "click",
        ()=>{


            loadSpread(1);


        }
    );



});
