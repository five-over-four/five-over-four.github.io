var paras = Array.from(document.querySelectorAll('p'));
const pathRoot = window.location.pathname.split('.')[0];
const button = document.getElementById('main-button');
const pagename = pathRoot.split("/").at(-1);
var cookiesExist = document.cookie.indexOf("index") != -1;
var started = false;

document.addEventListener("keydown", controlHandler);
button.addEventListener('click', goForward('branch1'), false);

// generate save and load buttons for mobile users (and desktop).
container = "main-container";
makeButton("Save", "save-button", container, createCookies, "cookie-button");
makeButton("Load", "load-button", container, loadSave, "cookie-button");

// initialise index, choices, indicesVisited.
if (cookiesExist) {
  readCookies(); // load your saved state.
  if (selfRedirect == 0) { // start at beginning if not loading with 'L'.
    var index = 0;
    var choices = [];
    var indicesVisited = [0];
  }
  else { // we're loading a save.
    indicesVisited = simulateExactPath(index);
    getMostRecentItems()
  } 
}
else {
  var index = 0;
  var choices = []; // push(1) for branch1, push(2) for branch2.
  var indicesVisited = [0];
}

selfRedirect = 0;
document.cookie = "self-redirect=0;sameSite=Strict;Path=/";
paras[index].style.display = 'block';
updateValues(index); // get initial setup (color and button prompt etc.)

function makeButton(insideText, id, parent, func, className) {
  var btn = document.createElement("button");
  btn.classList.add(className);
  btn.style.backgroundColor = document.getElementById("main-button").style.backgroundColor;
  btn.innerHTML = insideText;
  btn.id = id;
  document.getElementById(parent).appendChild(btn);
  btn.addEventListener('click', func, false);
}

// helper function for goFoward.
function onCorrectBranch(index) {
  return !(choices.at(-1) == 1 && paras[index].id == "branch2") &&
         !(choices.at(-1) == 2 && paras[index].id == "branch1");
}

// every time a choice is presented, pressing the left or right button adds a
// 1 or 2 into choices that's used to skip the opposing branch elements.
function goForward(branchToTake) { // todo: do not read prompt two if branching.
  
  return function () {

    var currentlyHandlingChoice = false;

    if (index < paras.length - 1) {

      if (!started) {
        document.getElementById('play-music').play();
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
  }
}

// go back along indicesVisited and update the page properties as needed.
function goBack() {

  if (index == 0) return;
  if (!started) {
    document.getElementById('play-music').play();
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
}

// loops backward to update music, icon, color, background
// to the values they're meant to have at a given point.
function getMostRecentItems() {

  var searchIndex = indicesVisited.length - 1;
  const desiredAttributes = ["music", "icon", "color", "background"];
  var seenAttributes = [];

  while (searchIndex >= 0) {

    if (seenAttributes.length >= 4) break;

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
        document.getElementById("play-music").src = value;
        document.getElementById("play-music").play();
        break;
      case "background":
        document.body.style.backgroundImage = "url(${pathRoot}/{value})";
        break;
      case "color":
        document.getElementById("main-container").style.borderColor = value;
        document.getElementById("main-button").style.backgroundColor = value;
        document.getElementById("save-button").style.backgroundColor = value;
        document.getElementById("load-button").style.backgroundColor = value;
        break;
      case "link":
        window.location.href = pathRoot.replace(pagename, value); // remove .html when publishing.
    }
  }
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
      document.getElementById("main-button").click();
      break;
    case "ArrowLeft":
      goBack();
      break;
    case "1":
      document.getElementById("main-button").click();
      break;
    case "2":
      try {
          document.getElementById("button-two").click();
      }
      catch (err) {
          console.log("no choice presented!");
      }
      break;
    case "s":
      createCookies(0);
      break;
    case "l":
      loadSave();
      break;
    case "d": // debug key.
      console.log(`debug- indices traversed: ${simulateExactPath(index)}`);
      break;
  }
}

/**
 * SAVING / LOADING SECTION: Deals with the creation and reading of cookies.
 * The cookies are *only* used to save your progress on a given page.
 */

// the self-redirect cookie is read at page load to see "oh, we're arriving from elsewhere".
function createCookies(selfRedirect=0) {
  const choicesSaved = choices.join(","); // not defined at start of page somehow.
  const sameSite = ";sameSite=Strict";
  const path = ";Path=/"
  document.cookie = "choices=" + choicesSaved + sameSite + path;
  document.cookie = "index=" + index + sameSite + path;
  document.cookie = "pagename=" + window.location.pathname.split('.')[0].split("/").at(-1) + sameSite + path;
  document.cookie = "self-redirect=" + selfRedirect + sameSite + path;
  cookiesExist = true;
}

// updates index, choices.
function readCookies() {

  var cookies = document.cookie.split(";");

  const indexIndex = cookies.findIndex(e => e.includes("index"));
  const choiceArray = cookies.findIndex(e => e.includes("choices"));
  const redirectIndex = cookies.findIndex(e => e.includes("self-redirect"));

  // in case no choices are made yet.
  if (cookies[choiceArray].split("=")[1].length > 0) {
      choices = cookies[choiceArray].split("=")[1].split(",").map(item => Number(item));
  }
  else choices = [];
  index = Number(cookies[indexIndex].split("=")[1]);
  selfRedirect = Number(cookies[redirectIndex].split("=")[1]);

}

function loadSave() {

  if (!cookiesExist) {
    console.log("you don't have a current save.");
    return;
  }

  document.cookie = "self-redirect=1;sameSite=Strict;Path=/";
  var cookies = document.cookie.split(";");
  const pagenameIndex = cookies.findIndex(e => e.includes("pagename"));
  const nextPagename = cookies[pagenameIndex].split("=")[1];
  window.location.href = pathRoot.replace(pagename, nextPagename); // remove .html when publishing.
  
}