console.log("ENGINE FILE LOADED");

window.addEventListener("load", () => {
    console.log("ENGINE START TRIGGERED");

    const pageA = document.getElementById("pageA");
    const pageB = document.getElementById("pageB");

    if (!pageA || !pageB) {
        console.log("PAGE ELEMENTS NOT FOUND");
        return;
    }

    pageA.innerHTML = "<div style='color:white'>ENGINE TEST A WORKS</div>";
    pageB.innerHTML = "<div style='color:white'>ENGINE TEST B WORKS</div>";
});
