// resize top margin to 30% the empty space below.
function resizeTopMargin() {
    const bodyh = document.body.clientHeight;
    const toph = document.getElementById("main-container").clientHeight;
    let mainContainer = document.getElementById("main-container");

    // desktop.
    if (screen && screen.width > 900) {
        mainContainer.style.marginTop = `${0.025 * (bodyh - toph)}em`;
    }
    // mobile.
    else if (screen && screen.width <= 900) {
        mainContainer.style.marginTop = `${0.02 * (bodyh - toph)}em`;
    }
    if (Number(mainContainer.style.marginTop.split("em")[0]) < 2) {
        mainContainer.style.marginTop = "2em";
    }
}

window.addEventListener('load', resizeTopMargin);
window.addEventListener('resize', resizeTopMargin);