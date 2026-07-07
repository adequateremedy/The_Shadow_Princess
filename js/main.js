//////////////////////////////////////////////////////////
// THE SHADOW PRINCESS
// Main 3D Book Engine
//////////////////////////////////////////////////////////


// ------------------------------------------------------
// BASIC THREE.JS SETUP
// ------------------------------------------------------

const container = document.getElementById("book-container");

let scene;
let camera;
let renderer;

let spineMesh;

let clock = new THREE.Clock();


// ------------------------------------------------------
// INITIALIZE SCENE
// ------------------------------------------------------

function init() {

    // Create scene
    scene = new THREE.Scene();


    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );


    // Camera position
    // Looking down at the book from the bed perspective
    camera.position.set(0, 4, 7);

    camera.lookAt(0, 0, 0);



    // Renderer
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


    container.appendChild(renderer.domElement);



    // Add lighting
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1
    );

    scene.add(ambientLight);



    loadBackgroundVideo();

    loadSpine();



    window.addEventListener(
        "resize",
        resize
    );


    animate();

}



// ------------------------------------------------------
// BACKGROUND VIDEO
// ------------------------------------------------------

function loadBackgroundVideo() {


    const video = document.createElement("video");


    video.src = "assets/background.webm";


    video.loop = true;

    video.muted = true;

    video.playsInline = true;


    video.play();



    const videoTexture =
        new THREE.VideoTexture(video);


    videoTexture.minFilter =
        THREE.LinearFilter;


    videoTexture.magFilter =
        THREE.LinearFilter;


    const backgroundMaterial =
        new THREE.MeshBasicMaterial({

            map: videoTexture

        });


    const backgroundGeometry =
        new THREE.PlaneGeometry(
            16,
            9
        );


    const background =
        new THREE.Mesh(
            backgroundGeometry,
            backgroundMaterial
        );


    background.position.z = -5;


    scene.add(background);


}



// ------------------------------------------------------
// LOAD SPINE IMAGE
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

                    transparent: true

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


            scene.add(spineMesh);


        }

    );

}



// ------------------------------------------------------
// RESIZE HANDLER
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
// ANIMATION LOOP
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



// ------------------------------------------------------
// START ENGINE
// ------------------------------------------------------

init();
