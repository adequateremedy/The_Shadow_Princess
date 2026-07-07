//////////////////////////////////////////////////////////
// THE SHADOW PRINCESS
// Main Book Engine
// Stage 1: Background + Spine + Cover Transition
//////////////////////////////////////////////////////////


const container = document.getElementById("book-container");

let scene;
let camera;
let renderer;

let spineMesh;
let coverMesh;

let raycaster;
let mouse;

let spineVisible = true;



// ------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------

function init() {


    scene = new THREE.Scene();



    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );


    camera.position.set(
        0,
        0,
        5
    );


    camera.lookAt(
        0,
        0,
        0
    );



    renderer = new THREE.WebGLRenderer({

        alpha: true,
        antialias: true

    });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        window.devicePixelRatio
    );


    container.appendChild(
        renderer.domElement
    );



    raycaster = new THREE.Raycaster();

    mouse = new THREE.Vector2();



    createBackgroundVideo();

    loadSpine();

    loadFrontCover();



    window.addEventListener(
        "resize",
        resize
    );


    window.addEventListener(
        "click",
        checkClick
    );



    animate();

}



// ------------------------------------------------------
// BACKGROUND VIDEO
// ------------------------------------------------------

function createBackgroundVideo() {


    const video =
        document.createElement("video");


    video.id =
        "background-video";


    video.src =
        "assets/background.webm";


    video.loop = true;

    video.muted = true;

    video.autoplay = true;

    video.playsInline = true;



    document.body.appendChild(
        video
    );


    video.play();



}



// ------------------------------------------------------
// LOAD SPINE
// ------------------------------------------------------

function loadSpine() {


    const loader =
        new THREE.TextureLoader();



    loader.load(

        "assets/spine.png",

        function(texture) {


            const material =
                new THREE.MeshBasicMaterial({

                    map: texture,

                    transparent: true,

                    opacity: 1

                });



            const geometry =
                new THREE.PlaneGeometry(
                    1.32,
                    4.46
                );



            spineMesh =
                new THREE.Mesh(
                    geometry,
                    material
                );



            spineMesh.position.set(
                0,
                0,
                0
            );



            scene.add(
                spineMesh
            );


        }

    );


}



// ------------------------------------------------------
// LOAD FRONT COVER
// ------------------------------------------------------

function loadFrontCover() {


    const loader =
        new THREE.TextureLoader();



    loader.load(

        "assets/front-cover.png",

        function(texture) {


            const material =
                new THREE.MeshBasicMaterial({

                    map: texture,

                    transparent: true,

                    opacity: 0

                });



            const geometry =
                new THREE.PlaneGeometry(

                    3.03,

                    4.50

                );



            coverMesh =
                new THREE.Mesh(

                    geometry,

                    material

                );



            coverMesh.position.set(

                0,

                0,

                0.05

            );



            scene.add(

                coverMesh

            );


        }

    );


}



// ------------------------------------------------------
// CLICK DETECTION
// ------------------------------------------------------

function checkClick(event) {


    if (!spineVisible || !spineMesh) {

        return;

    }



    mouse.x =
        (event.clientX / window.innerWidth) * 2 - 1;


    mouse.y =
        -(event.clientY / window.innerHeight) * 2 + 1;



    raycaster.setFromCamera(
        mouse,
        camera
    );



    const intersects =
        raycaster.intersectObject(
            spineMesh
        );



    if (intersects.length > 0) {


        openCover();


    }


}



// ------------------------------------------------------
// SPINE TO COVER CROSSFADE
// ------------------------------------------------------

function openCover() {


    spineVisible = false;



    const duration = 1200;


    const start = performance.now();



    function fade(time) {


        const progress =
            Math.min(
                (time - start) / duration,
                1
            );



        spineMesh.material.opacity =
            1 - progress;



        coverMesh.material.opacity =
            progress;



        if (progress < 1) {


            requestAnimationFrame(
                fade
            );


        }
        else {


            spineMesh.visible =
                false;


        }


    }



    requestAnimationFrame(
        fade
    );


}



// ------------------------------------------------------
// RESIZE
// ------------------------------------------------------

function resize() {


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();



    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


}



// ------------------------------------------------------
// LOOP
// ------------------------------------------------------

function animate() {


    requestAnimationFrame(
        animate
    );


    renderer.render(
        scene,
        camera
    );


}



// START

init();
