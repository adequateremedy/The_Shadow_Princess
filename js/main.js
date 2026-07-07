/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine
   Stage 1:
   Spine -> Front Cover
   Background Video Activation
   ========================================== */


const spine = document.getElementById("spine");

const frontCover = document.getElementById("front-cover");

const backgroundVideo = document.getElementById("background-video");



let bookOpened = false;



// ==========================================
// SPINE CLICK
// ==========================================

spine.addEventListener("click", function () {


    if (bookOpened) {

        return;

    }


    bookOpened = true;



    startBackground();



    openFrontCover();



});




// ==========================================
// START BACKGROUND VIDEO
// ==========================================

function startBackground() {


    backgroundVideo.style.opacity = "0";



    backgroundVideo.play()

        .then(() => {


            fadeInVideo();


        })

        .catch((error) => {


            console.log(
                "Video autoplay blocked:",
                error
            );


        });


}



// ==========================================
// VIDEO FADE IN
// ==========================================

function fadeInVideo() {


    let opacity = 0;



    backgroundVideo.style.opacity = opacity;



    const fade = setInterval(function () {


        opacity += 0.02;



        backgroundVideo.style.opacity = opacity;



        if (opacity >= 1) {


            clearInterval(fade);


        }


    }, 20);


}



// ==========================================
// SPINE -> FRONT COVER
// ==========================================

function openFrontCover() {


    frontCover.style.display = "block";


    frontCover.style.opacity = "0";



    let opacity = 0;



    const fade = setInterval(function () {


        opacity += 0.02;



        frontCover.style.opacity = opacity;



        spine.style.opacity =
            1 - opacity;



        if (opacity >= 1) {


            clearInterval(fade);



            spine.style.display =
                "none";


        }


    }, 20);


}
