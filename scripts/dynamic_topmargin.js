// resize top margin to percentage% the empty space below.
function resizeTopMargin() {
    const bodyh = document.body.clientHeight;
    const toph = document.getElementById("main-container").clientHeight;
    document.getElementById("main-container").style.marginTop = `${0.2 * (bodyh - toph)}px`;
    console.log(document.getElementById("main-container").style.cssText);
}

window.addEventListener('load', resizeTopMargin);
window.addEventListener('resize', resizeTopMargin);