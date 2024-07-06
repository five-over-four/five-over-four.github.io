var paras = Array.from(document.querySelectorAll('p'));
const pathRoot = window.location.pathname.split('.')[0];
const button = document.getElementById('main-button');
const pagename = pathRoot.split("/").at(-1);
var currentStyleAdditions = "";
var cookiesExist = document.cookie.indexOf("index") != -1;
var started = false;
var fadein = false;

document.addEventListener("keydown", controlHandler);
button.addEventListener('click', goForward('branch1'), false);

// generate save and load buttons for mobile users (and desktop).
container = "main-container";

var index = 0;
var choices = []; // push(1) for branch1, push(2) for branch2.
var indicesVisited = [0];

selfRedirect = 0;
paras[index].style.display = 'block';
updateValues(index); // get initial setup (color and button prompt etc.)

function makeButton(insideText, id, parent, buttonFunction, className) {
  var btn = document.createElement("button");
  btn.classList.add(className);
  btn.style.backgroundColor = document.getElementById("main-button").style.backgroundColor;
  btn.innerHTML = insideText;
  btn.id = id;
  document.getElementById(parent).appendChild(btn);
  btn.addEventListener('click', buttonFunction, false);
}

// helper function for goFoward.
function onCorrectBranch(index) {
  return !(choices.at(-1) == 1 && paras[index].id == "branch2") &&
         !(choices.at(-1) == 2 && paras[index].id == "branch1");
}

// every time a choice is presented, pressing the left or right button adds a
// 1 or 2 into choices that's used to skip the opposing branch elements.
function goForward(branchToTake = "branch1") {
  
  return function () {

    var currentlyHandlingChoice = false;

    if (index < paras.length - 1) {

      if (!started) {
        // this check is required if the reader loads onto a 'silent', 
        // where no music has been loaded yet.
        if (document.getElementById('play-music').src) {
          document.getElementById('play-music').play();
        }
        document.getElementById('last-update').style.display = 'none';
        started = true;
      }

      // todo: only do this if the branch is right.
      if (paras[index].hasAttribute("prompt2") && onCorrectBranch(index)) {
        if (branchToTake === "branch1") choices.push(1);
        else choices.push(2);
        document.getElementById("button-two").remove();
        currentlyHandlingChoice = true;
      }

      paras[index].style.display = 'none';

      // loop until new choice, always skipping the currently not chosen
      // branch, choices.at(-1). break when finding non-wrong branch items.
      while (!(paras[index].hasAttribute("prompt2") && onCorrectBranch(index)) || currentlyHandlingChoice) { // BROKEN.

        index++;
        if (!onCorrectBranch(index)) continue;
        else {
          paras[index].style.display = 'block';
          indicesVisited.push(index);
          updateValues(index);
          currentlyHandlingChoice = false;
          break;
        }
      }
    }
    resizeTopMargin();
  }
}

// go back along indicesVisited and update the page properties as needed.
function goBack() {

  if (index == 0) return;
  if (!started) {
    // if loading on a 'silent', no music has been loaded yet,
    // so the element is empty and will fail to play.
    if (document.getElementById('play-music').src) {
      document.getElementById('play-music').play();
    }
    document.getElementById("last-update").style.display = 'none';
    started = true;
  }

  paras[index].style.display = 'none';
  previousIndex = indicesVisited.at(-1);
  indicesVisited = indicesVisited.slice(0,-1);
  index = indicesVisited.at(-1);
  paras[index].style.display = 'block';

  if (paras[previousIndex].hasAttribute("prompt2")) {
    choices.pop();
    document.getElementById("button-two").remove();
  }

  getMostRecentItems(); // get any older music changes etc.
  updateValues(index); // get index updates.
  resizeTopMargin();
}

// loops backward to update music, icon, color, background
// to the values they're meant to have at a given point.
function getMostRecentItems() {

  var searchIndex = indicesVisited.length - 1;
  const desiredAttributes = ["music", "icon", "color", "background", "styles"];
  var seenAttributes = [];

  while (searchIndex >= 0) {

    if (seenAttributes.length >= 5) break;

    pathIndex = indicesVisited[searchIndex];
    attributeNames = paras[pathIndex].getAttributeNames();
    newAttributes = attributeNames.filter(e => desiredAttributes.includes(e));
    newAttributes = newAttributes.filter(e => !(seenAttributes.includes(e)));
    newAttributes.forEach(e => seenAttributes.push(e));

    updateValues(pathIndex, newAttributes);
    searchIndex--;
  }

}

// pass <p attrName=attrVal> and it'll get updated here.
function updateValues(atIndex, whichAttributes=null) {

  if (whichAttributes) attributeNames = whichAttributes;
  else attributeNames = paras[atIndex].getAttributeNames();
  var attributeValues = [];
  attributeNames.forEach(item => attributeValues.push(paras[atIndex].getAttribute(item)));

  for (let i = 0; i < attributeNames.length; i++) {

    attribute = attributeNames[i];
    value = attributeValues[i];

    switch(attribute) {
      case "id":
      case "class":
        break;
      case "prompt":
        document.getElementById("main-button").innerHTML = value;
        break;
      case "prompt2":
        makeButton(value, "button-two", "main-container", goForward("branch2"), "styled-button");
        break;
      case "icon":
        document.getElementById("main-image").src = pathRoot + "/images/" + value;
        break;
      case "effect":
        new Audio(pathRoot + "/sounds/" + value).play();
        break;
      case "music":
        handleMusic();
        break;
      case "background":
        document.body.style.backgroundImage = `url(${pathRoot + "/images/" + value})`
        break;
      case "color":
        document.getElementById("main-container").style.borderColor = value;
        let allButtons = document.getElementsByTagName("button");
        Array.from(allButtons).forEach(e => e.style.backgroundColor = value);
        break;
      case "styles":
        parseNewStyles(value);
        break;
      case "link":
        window.location.href = "/";
    }
  }
}

// syntax: ID_name1=style1;style2;...;stylen|ID_name2=...
// allows for arbitrary style injection in <p> tags with 'styles' attribute.
// DO NOT put a | or ; at the end if a new element is not coming. will split wrong.
function parseNewStyles(styleString) {

  if (!styleString && !currentStyleAdditions) return;

  removalPhase = false;
  if (!styleString) removalPhase = true;
  else currentStyleAdditions = styleString;
  let styles = currentStyleAdditions.split("|");

  for (const style of styles) {
    let fieldID = style.split("=")[0];
    let additions = style.split("=")[1].split(";");

    for (const addition of additions) {
      let styleName = addition.split(":")[0];
      let styleContent = addition.split(":")[1];

      if (!removalPhase) document.getElementById(fieldID).style[styleName] = styleContent;
      else document.getElementById(fieldID).style[styleName] = "none";
    }
  }
}

// changes musical tracks and deals with fades when silencing.
// if using 'layer' in music title, will remember time so tracks
// can remain synced.
function handleMusic() {
  let musicElement = document.getElementById("play-music");
  let oldMusicName = musicElement.src.split("/").at(-1);
  let newMusicName = value.split("/").at(-1);

  // fading out to silence.
  if (newMusicName == "silent") {
    fadein = false;
    fadeOut(musicElement, timeout=100);
    return;
  }

  else {
    // without this, music reloads each time you go backward.
    if (newMusicName == oldMusicName && musicElement.volume == 1) return;

    let oldMusicTime = musicElement.currentTime;
    musicElement.src = pathRoot + "/sounds/" + value;
    musicElement.currentTime = 0;

    // if 'layer', start at same time so they remain synced.
    if ((oldMusicName.includes("layer") && newMusicName.includes("layer")) &&
        (oldMusicName != newMusicName)) {
      musicElement.currentTime = oldMusicTime;
    }
  }
  fadein = true;
  fadeIn(musicElement, timeout=100); // fadein does nothing when already max vol.
  if (index != 0) musicElement.play();
}

// here 0.01 is the volumeIncrement and timeout the maxSteps to fade.
// 5 is milliseconds per step.
function fadeOut(element, timeout=100) {
  if (timeout == 0) {
    if (!fadein) element.volume = 0; 
    return;
  }
    if (element.volume > 0.01) {
    element.volume -= 0.01;
    setTimeout(() =>  { fadeOut(element, timeout-1) }, 5)
  }
  else element.volume = 0;
}

function fadeIn(element, timeout=100) {
  if (timeout == 0) {
    if (fadein) element.volume = 1;
    return;
  }
  if (element.volume < 0.99) {
    element.volume += 0.01;
    setTimeout(() => { fadeIn(element, timeout-1) }, 5)
  }
  else element.volume = 1;
}

// takes CHOICES and returns the list of visited indices so
// going backward is simpler. only used when loading a save.
function simulateExactPath(stoppingIndex) {

  var path = [];
  var choiceNumber = null;

  function takingCorrectRoute(i) {
    return !(choices.at(choiceNumber) == 1 && paras[i].id == "branch2") &&
           !(choices.at(choiceNumber) == 2 && paras[i].id == "branch1");
  }

  for (let i = 0; i < stoppingIndex; i++) {
    if (takingCorrectRoute(i)) {
      if (paras[i].hasAttribute("prompt2")) {
        if (choiceNumber === null) choiceNumber = 0;
        else choiceNumber++;
      }
      path.push(i);
    }
  }
  path.push(stoppingIndex);
  return path;
}

function controlHandler(e) {
  key = e["key"];
  switch(key) {
    case "ArrowRight":
      //document.getElementById("main-button").click();
      goForward()(); // function inside function for eventListener. looks awful.
      break;
    case "ArrowLeft":
      goBack();
      break;
    case "1":
      goForward()();
      break;
    case "2":
      try {
          document.getElementById("button-two").click();
      }
      catch (err) {
          console.log("no choice presented!");
      }
      break;
    case "d": // debug key.
      console.log(`Steps taken: ${indicesVisited.length}`);
      break;
  }
}