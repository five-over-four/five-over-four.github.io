// resize top margin to 30% the empty space below.
function resizeTopMargin() {

    let body = document.body;
    let html = document.documentElement;
    let screenHeight = Math.max(body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    const toph = document.getElementById("main-container").clientHeight;
    let mainContainer = document.getElementById("main-container");

    // desktop.
    if (screen && screen.width > 900) {
        mainContainer.style.marginTop = `${0.025 * (screenHeight - toph)}em`;
    }
    // mobile.
    else if (screen && screen.width <= 900) {
        mainContainer.style.marginTop = `${0.02 * (screenHeight - toph)}em`;
    }
    // minimum margin.
    if (Number(mainContainer.style.marginTop.split("em")[0]) < 2.2) {
        mainContainer.style.marginTop = "2.2em";
    }
}

window.addEventListener('load', resizeTopMargin);
window.addEventListener('resize', resizeTopMargin);