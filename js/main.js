/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine

   Spine Click:
   Spine -> Closed Book
   WebM + Audio Fade In

   Cover Click:
   Hardcover Opens

========================================== */



const spine = document.getElementById("spine");

const closedBook = document.getElementById("closed-book");

const frontCover = document.getElementById("front-cover");

const backgroundVideo =
    document.getElementById("background-video");

const openBook =
    document.getElementById("open-book");

const hardCover =
    document.getElementById("hard-cover");



let spineClicked = false;

let coverClicked = false;





// ==========================================
// INITIAL SETTINGS
// ==========================================


backgroundVideo.volume = 0;

backgroundVideo.style.opacity = "0";


closedBook.style.display = "none";

openBook.style.display = "none";

hardCover.style.display = "none";






// ==========================================
// SPINE CLICK
// ==========================================


spine.addEventListener("click", function () {


    if (spineClicked) {

        return;

    }


    spineClicked = true;


    startBookReveal();


});







// ==========================================
// SPINE -> CLOSED BOOK
// WEBM + AUDIO FADE
// ==========================================


function startBookReveal() {


    const duration = 5000;



    closedBook.style.display =
        "block";


    closedBook.style.opacity =
        "0";



    backgroundVideo.play()

    .then(() => {



        const start =
            performance.now();





        function fade(time) {



            let progress =
                (time - start) / duration;



            if (progress > 1) {

                progress = 1;

            }





            // Background video

            backgroundVideo.style.opacity =
                progress;



            // Background audio

            backgroundVideo.volume =
                progress;





            // Spine fades away

            spine.style.opacity =
                1 - progress;





            // Closed book fades in

            closedBook.style.opacity =
                progress;







            if (progress < 1) {


                requestAnimationFrame(
                    fade
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
            fade
        );



    })

    .catch(error => {


        console.log(
            "Video could not start:",
            error
        );


    });



}







// ==========================================
// ENABLE HARD COVER CLICK
// ==========================================


function enableCoverOpening() {


    frontCover.addEventListener(
        "click",
        openHardCover
    );


}







// ==========================================
// OPEN HARD COVER
// ==========================================


function openHardCover() {



    if (coverClicked) {

        return;

    }


    coverClicked = true;





    openBook.style.display =
        "block";



    hardCover.style.display =
        "block";






    // Move the closed cover
    // into the open book layer

    hardCover.style.transform =
        "rotateY(0deg)";



    setTimeout(() => {



        hardCover.style.transition =
            "transform 2.5s ease";



        hardCover.style.transform =
            "rotateY(-180deg)";



    }, 50);



}
