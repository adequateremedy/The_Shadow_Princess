/*
==========================================================
THE SHADOW PRINCESS
TRUE FLIPBOOK ENGINE
==========================================================
*/


document.addEventListener("DOMContentLoaded", () => {



    const cover =
        document.getElementById("book-cover");


    const backgroundVideo =
        document.getElementById("background-video");


    const book =
        document.getElementById("book");


    const leftPageImage =
        document.getElementById("left-page-image");


    const rightPageImage =
        document.getElementById("right-page-image");


    const turningPage =
        document.getElementById("turning-page");


    const turningPageImage =
        document.getElementById("turning-page-image");


    const tocButton =
        document.getElementById("toc-button");





    const TOTAL_PAGES = 311;

    const STORAGE_KEY =
        "The_Shadow_Princess_current_page";



    let currentRightPage = 1;

    let bookOpened = false;



    let dragging = false;

    let startX = 0;

    let currentRotation = 0;







    /*
    ======================================================
    CHAPTER PATHS
    ======================================================
    */


    const chapters = [

        [1,18,"one","Chapter-One-Page-"],

        [19,39,"two","Chapter-Two-Page-"],

        [40,59,"three","Chapter-Three-Page-"],

        [60,79,"four","Chapter-Four-Page-"],

        [80,104,"five","Chapter-Five-Page-"],

        [105,130,"six","Chapter-Six-Page-"],

        [131,159,"seven","Chapter-Seven-page-"],

        [160,183,"eight","Chapter-Eight-page-"],

        [184,209,"nine","Chapter-Nine-page-"],

        [210,233,"ten","Chapter-Ten-page-"],

        [234,256,"eleven","Chapter-Eleven-page-"],

        [257,281,"twelve","Chapter-Twelve-page-"],

        [282,311,"thirteen","Chapter-Thirteen-page-"]

    ];








    function getPagePath(page) {


        for(let chapter of chapters) {


            if(
                page >= chapter[0] &&
                page <= chapter[1]
            ) {


                return `chapters/${chapter[2]}/${chapter[3]}${page}.png`;


            }


        }


        return "";

    }








    /*
    ======================================================
    LOAD SPREAD
    ======================================================
    */


    function loadSpread(page) {


        if(page < 1)
            page = 1;


        if(page > TOTAL_PAGES)
            page = TOTAL_PAGES;



        currentRightPage = page;



        const leftPage = page - 1;



        if(leftPage < 1) {


            leftPageImage.src =
                "assets/Table-of-Contents1.png";


        }

        else {


            leftPageImage.src =
                getPagePath(leftPage);


        }



        rightPageImage.src =
            getPagePath(page);



        saveProgress();


    }








    /*
    ======================================================
    SAVE LOCATION
    ======================================================
    */


    function saveProgress() {


        localStorage.setItem(

            STORAGE_KEY,

            currentRightPage

        );


    }








    function restoreProgress() {


        const saved =
            localStorage.getItem(STORAGE_KEY);



        if(saved) {


            currentRightPage =
                Number(saved);


        }


    }









    /*
    ======================================================
    OPEN COVER
    ======================================================
    */


    function openCover() {


        if(bookOpened)
            return;



        bookOpened = true;



        backgroundVideo.play();




        cover.style.transform =
            "rotateY(-180deg)";



        setTimeout(() => {


            cover.style.display =
                "none";



            restoreProgress();



            loadSpread(
                currentRightPage
            );



        },1000);


    }







    /*
    ======================================================
    COVER DRAG
    ======================================================
    */


    cover.addEventListener(
        "pointerdown",
        e => {


            startX =
                e.clientX;


            cover.setPointerCapture(
                e.pointerId
            );


        }
    );



    cover.addEventListener(
        "pointerup",
        e => {


            let distance =
                e.clientX - startX;



            if(distance < -100) {


                openCover();


            }


        }
    );








    /*
    ======================================================
    PAGE TURN FUNCTIONS
    ======================================================
    */


    function nextPage() {


        if(currentRightPage >= TOTAL_PAGES)
            return;



        turnPage(
            currentRightPage + 2,
            true
        );


    }






    function previousPage() {


        if(currentRightPage <= 1)
            return;



        turnPage(
            currentRightPage - 2,
            false
        );


    }









    /*
    ======================================================
    PAGE TURN ANIMATION
    ======================================================
    */


    function turnPage(targetPage, forward) {



        const image =
            forward
            ? getPagePath(targetPage - 1)
            : getPagePath(targetPage);



        turningPageImage.src =
            image;



        turningPage.style.display =
            "block";



        if(forward) {


            turningPage.style.right =
                "0";


            turningPage.style.transformOrigin =
                "left center";


            turningPage.style.transform =
                "rotateY(0deg)";



            setTimeout(() => {


                turningPage.style.transform =
                    "rotateY(-180deg)";


            },50);


        }

        else {


            turningPage.style.left =
                "0";


            turningPage.style.transformOrigin =
                "right center";


            turningPage.style.transform =
                "rotateY(0deg)";



            setTimeout(() => {


                turningPage.style.transform =
                    "rotateY(180deg)";


            },50);


        }





        setTimeout(() => {


            turningPage.style.display =
                "none";



            loadSpread(targetPage);



        },700);



    }









    /*
    ======================================================
    DRAG PAGE TURNING
    ======================================================
    */


    book.addEventListener(
        "pointerdown",
        e => {


            if(!bookOpened)
                return;



            dragging = true;


            startX =
                e.clientX;



            book.setPointerCapture(
                e.pointerId
            );



        }
    );





    book.addEventListener(
        "pointermove",
        e => {


            if(!dragging)
                return;



            let distance =
                e.clientX - startX;



            currentRotation =
                distance / 5;



            if(
                currentRotation < 0 &&
                currentRotation > -180
            ) {


                turningPage.style.display =
                    "block";


                turningPage.style.transform =
                    `rotateY(${currentRotation}deg)`;


            }



        }
    );






    book.addEventListener(
        "pointerup",
        e => {


            if(!dragging)
                return;



            dragging = false;



            if(currentRotation < -90) {


                nextPage();


            }

            else {


                turningPage.style.transform =
                    "rotateY(0deg)";



                setTimeout(() => {


                    turningPage.style.display =
                        "none";


                },300);


            }



            currentRotation = 0;



        }
    );









    /*
    ======================================================
    KEYBOARD
    ======================================================
    */


    document.addEventListener(
        "keydown",
        e => {


            if(!bookOpened)
                return;



            if(e.key === "ArrowRight") {


                nextPage();


            }


            if(e.key === "ArrowLeft") {


                previousPage();


            }



        }
    );









    /*
    ======================================================
    TABLE OF CONTENTS
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
