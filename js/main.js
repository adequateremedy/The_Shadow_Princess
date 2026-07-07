/* ==========================================
   THE SHADOW PRINCESS
   Main Book Engine

   Stage 1:
   Spine -> Front Cover
   Background Video + Audio Fade

   Synchronized 5 Second Transition
   ========================================== */


const spine = document.getElementById("spine");

const frontCover = document.getElementById("front-cover");

const backgroundVideo = document.getElementById("background-video");


let bookOpened = false;



// ==========================================
// INITIAL VIDEO SETTINGS
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
// MAIN SYNCHRONIZED TRANSITION
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



                /*
                    SAME PROGRESS VALUE
                    CONTROLS EVERYTHING
                */


                // Background video fade

                backgroundVideo.style.opacity =
                    progress;



                // Background audio fade

                backgroundVideo.volume =
                    progress;



                // Spine fade out

                spine.style.opacity =
                    1 - progress;



                // Front cover fade in

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
