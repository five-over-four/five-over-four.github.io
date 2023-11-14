function asciiAnimation(frames, speed, target) {
    var currentFrame = 0;
    for(var i = 0; i < frames.length; i++) {
        frames[i] = frames[i].replace(/ /g,"&nbsp;");
        frames[i] = "<pre>" + frames[i] + "</pre>";
    }
    target.innerHTML = frames[0];
    currentFrame++;
    this.animation = 
        setInterval(
            function() {
            target.innerHTML = frames[currentFrame];
            currentFrame++;
            if(currentFrame >= frames.length) 
                currentFrame = 0;
            }, speed);
    this.getCurrentFrame = function() {
        return currentFrame
    }
}

asciiAnimation.prototype.stopAnimation = function() {
    clearInterval(this.animation);
}

function makeDiv() { return document.createElement("div"); }
function bodyAppend(element) { document.body.appendChild(element); }

var div1 = makeDiv();
const myAppendTo = document.querySelector('#path-one');
myAppendTo.appendChild(div1);
var animArray = ["A quiet world.", "A sense of stillness.", "Come here."];

var anim1 = new asciiAnimation(animArray, 1000, div1);