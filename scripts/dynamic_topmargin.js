// resize top margin to 30% the empty space below.
function resizeTopMargin() {
    const bodyh = document.body.clientHeight;
    const toph = document.getElementById("main-container").clientHeight;

    // desktop.
    if (screen && screen.width > 900) {
        document.getElementById("main-container").style.marginTop = `${0.25 * (bodyh - toph)}px`;
    }
    // tall mobile.
    else if (screen && screen.width <= 900 && bodyh > 700) {
        document.getElementById("main-container").style.marginTop = `${0.02 * (bodyh - toph)}em`;
    }
    // short mobile.
    else {
        document.getElementById("main-container").style.marginTop = `${0.03 * (bodyh - toph)}em`;
    }
}

window.addEventListener('load', resizeTopMargin);
window.addEventListener('resize', resizeTopMargin);