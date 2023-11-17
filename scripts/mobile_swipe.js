let startX = 0;
let endX = 0;

// swipe if swipe motion took less than one second.
function swipeStory(timeDelta) {
    if (startX - endX >= 100 && timeDelta < 1000) {
        goForward()();
    }
    else if (endX - startX >= 100 && timeDelta < 1000) {
        goBack();
    }
}

function swipeFrontpage(timeDelta) {
    if (startX - endX >> 100 && timeDelta < 1000) goToFirstPage();
}

if (window.innerWidth <= 900) {
    document.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].screenX;
        startTime = performance.now();
    })

    document.addEventListener('touchend', e => {
        endX = e.changedTouches[0].screenX;
        endTime = performance.now();
        if (pathRoot != "/") swipeStory(endTime - startTime);
        else swipeFrontpage(endTime - startTime);
    })
}