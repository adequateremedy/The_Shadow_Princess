/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine

   Stage 1:
   Spine -> Front Cover

   Stage 2:
   Front Cover -> Open Book
   ========================================== */



const spine = document.getElementById("spine");

const frontCover = document.getElementById("front-cover");

const coverContainer = document.getElementById("cover-container");

const backgroundVideo = document.getElementById("background-video");

const bookInterior = document.getElementById("book-interior");

const rightPageStack = document.getElementById("right-page-stack");



let spineOpened = false;

let coverOpened = false;





// ==========================================
// INITIAL SETTINGS
// ==========================================


backgroundVideo.style.opacity = "0";

backgroundVideo.volume = 0;


bookInterior.style.visibility = "hidden";






// ==========================================
// SPINE CLICK
// ==========================================


spine.addEventListener("click", function () {


    if (spineOpened) {

        return;

    }


    spineOpened = true;


    openSpine();


});







// ==========================================
// SPINE -> FRONT COVER
// ==========================================


function openSpine() {


    const duration = 5000;


    frontCover.style.opacity = "0";


    coverContainer.style.display =
        "block";



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



            // Background fade

            backgroundVideo.style.opacity =
                progress;



            // Audio fade

            backgroundVideo.volume =
                progress;



            // Spine fade out

            spine.style.opacity =
                1 - progress;



            // Cover fade in

            frontCover.style.opacity =
                progress;




            if (progress < 1) {



                requestAnimationFrame(
                    animate
                );


            }

            else {



                spine.style.display =
                    "none";


                backgroundVideo.volume =
                    1;



                enableCoverOpening();



            }



        }



        requestAnimationFrame(
            animate
        );



    })

    .catch(error => {


        console.log(
            "Background video could not start:",
            error
        );


    });



}







// ==========================================
// ENABLE FRONT COVER CLICK
// ==========================================


function enableCoverOpening() {


    frontCover.addEventListener(
        "click",
        openFrontCover
    );


}







// ==========================================
// FRONT COVER ROTATION
// ==========================================


function openFrontCover() {



    if (coverOpened) {

        return;

    }



    coverOpened = true;




    loadTableOfContents();




    bookInterior.style.visibility =
        "visible";




    coverContainer.style.transition =
        "transform 2.5s ease";



    coverContainer.style.transform =
        "rotateY(-170deg)";





    setTimeout(() => {



        coverContainer.style.display =
            "none";



    }, 2600);



}







// ==========================================
// LOAD TABLE OF CONTENTS
// ==========================================


function loadTableOfContents() {



    rightPageStack.innerHTML = "";



    const toc =
        document.createElement("img");



    toc.src =
        "assets/Table-of-Contents.png";



    toc.alt =
        "Table of Contents";



    toc.style.width =
        "394px";



    toc.style.height =
        "633px";



    rightPageStack.appendChild(
        toc
    );



}
