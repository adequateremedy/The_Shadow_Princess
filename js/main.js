/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine

   Stage 1:
   Spine -> Front Cover
   Background Video + Audio Fade

   Stage 2:
   Front Cover -> Open Book
   ========================================== */


const spine = document.getElementById("spine");

const frontCover = document.getElementById("front-cover");

const backgroundVideo = document.getElementById("background-video");

const openBook = document.getElementById("open-book");

const rightPages = document.getElementById("right-pages");



let spineOpened = false;

let coverOpened = false;



// ==========================================
// INITIAL VIDEO SETTINGS
// ==========================================

backgroundVideo.style.opacity = "0";

backgroundVideo.volume = 0;



// ==========================================
// CLICK SPINE
// ==========================================

spine.addEventListener("click", function () {


    if (spineOpened) {

        return;

    }


    spineOpened = true;


    beginOpeningTransition();


});




// ==========================================
// SPINE -> FRONT COVER
// ==========================================

function beginOpeningTransition() {


    const duration = 5000;


    frontCover.style.display = "block";

    frontCover.style.opacity = "0";



    backgroundVideo.volume = 0;



    backgroundVideo.play()

        .then(() => {


            const startTime =
                performance.now();



            function animate(time) {


                let progress =
                    (time - startTime) / duration;



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



        })

        .catch((error) => {


            console.log(
                "Video playback blocked:",
                error
            );


        });


}




// ==========================================
// ENABLE COVER CLICK
// ==========================================

function enableCoverOpening() {


    frontCover.addEventListener(
        "click",
        openFrontCover
    );


}




// ==========================================
// FRONT COVER OPENS
// ==========================================

function openFrontCover() {


    if (coverOpened) {

        return;

    }


    coverOpened = true;



    createTOC();



    openBook.style.display =
        "block";



    openBook.style.opacity =
        "1";



    frontCover.style.transform =
        "translate(-50%, -50%) rotateY(-160deg)";



    setTimeout(() => {


        frontCover.style.display =
            "none";


    }, 1500);


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
