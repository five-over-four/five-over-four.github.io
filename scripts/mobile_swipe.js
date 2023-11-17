let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;

// swipe if swipe motion took less than one second.
function swipeStory(timeDelta) {
    if (Math.abs(startY - endY) >= Math.abs(startX - endX)) return;
    if (startX - endX >= 100 && timeDelta < 1000) {
        goForward()();
    }
    else if (endX - startX >= 100 && timeDelta < 1000) {
        goBack();
    }
}

function swipeFrontpage(timeDelta) {
    if (Math.abs(startY - endY) >= Math.abs(startX - endX)) return;
    if (startX - endX >> 100 && timeDelta < 1000) goToFirstPage();
}

if (window.innerWidth <= 900) {
    document.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
        startTime = performance.now();
    })

    document.addEventListener('touchend', e => {
        endX = e.changedTouches[0].screenX;
        endY = e.changedTouches[0].screenY;
        endTime = performance.now();
        if (pathRoot != "/") swipeStory(endTime - startTime);
        else swipeFrontpage(endTime - startTime);
    })
}