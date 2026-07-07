/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine

   Stage 1:
   Spine -> Front Cover

   Stage 2:
   Front Cover -> Open Book
   ========================================== */


const spine =
    document.getElementById("spine");


const frontCover =
    document.getElementById("front-cover");


const backgroundVideo =
    document.getElementById("background-video");


const openBook =
    document.getElementById("open-book");


const rightPages =
    document.getElementById("right-pages");



let bookOpened = false;

let coverOpened = false;



// ==========================================
// INITIAL VIDEO STATE
// ==========================================

backgroundVideo.style.opacity = "0";

backgroundVideo.volume = 0;



// ==========================================
// CLICK SPINE
// ==========================================

spine.addEventListener("click", function () {


    if (bookOpened) {

        return;

    }


    bookOpened = true;


    beginOpeningTransition();


});




// ==========================================
// SPINE -> FRONT COVER
// ==========================================

function beginOpeningTransition() {


    const duration = 5000;



    frontCover.style.display = "block";

    frontCover.style.opacity = "0";



    backgroundVideo.play()

        .then(() => {



            const start =
                performance.now();



            function animate(time) {



                let progress =
                    (time - start) / duration;



                if (progress > 1) {

                    progress = 1;

                }



                backgroundVideo.style.opacity =
                    progress;



                backgroundVideo.volume =
                    progress;



                spine.style.opacity =
                    1 - progress;



                frontCover.style.opacity =
                    progress;



                if (progress < 1) {


                    requestAnimationFrame(animate);


                }

                else {


                    spine.style.display =
                        "none";


                    backgroundVideo.volume =
                        1;


                    enableCoverOpening();


                }



            }



            requestAnimationFrame(animate);



        });


}




// ==========================================
// ENABLE FRONT COVER CLICK
// ==========================================

function enableCoverOpening() {


    frontCover.addEventListener(
        "click",
        openBook
    );


}




// ==========================================
// FRONT COVER -> OPEN BOOK
// ==========================================

function openBook() {


    if (coverOpened) {

        return;

    }


    coverOpened = true;



    frontCover.style.opacity =
        "0";



    setTimeout(() => {



        frontCover.style.display =
            "none";



        createTOC();



        openBook.style.display =
            "block";



        openBook.style.opacity =
            "0";



        fadeOpenBook();



    }, 1000);



}




// ==========================================
// CREATE TABLE OF CONTENTS PAGE
// ==========================================

function createTOC() {


    rightPages.innerHTML = "";



    const toc =
        document.createElement("img");



    toc.src =
        "assets/Table-of-Contents.png";



    toc.alt =
        "Table of Contents";



    rightPages.appendChild(toc);



}




// ==========================================
// FADE OPEN BOOK IN
// ==========================================

function fadeOpenBook() {


    let opacity = 0;



    const fade =
        setInterval(() => {



            opacity += 0.02;



            openBook.style.opacity =
                opacity;



            if (opacity >= 1) {


                clearInterval(fade);


            }



        }, 20);



}
