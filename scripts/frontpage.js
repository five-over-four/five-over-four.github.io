var paras = Array.from(document.querySelectorAll('p'));
const cookiesExist = document.cookie.indexOf("index") != -1;
const pathRoot = "/paths/main/";
const button = document.getElementById('main-button');
const saveLoadButton = document.getElementById('load-button');
button.addEventListener('click', goToFirstPage, false);
saveLoadButton.addEventListener('click', loadSave, false);
document.addEventListener("keydown", controlHandler);
updateValues();

function controlHandler(e) {
  key = e["key"];
  switch(key) {
    case "ArrowRight":
      document.getElementById("main-button").click();
      updateValues();
      break;
    case "l":
      loadSave();
      break;
    case "h":
      break;
  }
}

function loadSave() {

  if (!cookiesExist) {
    console.log("you don't have a current save.");
    return;
  }

  document.cookie = "self-redirect=1;sameSite=Strict";
  var cookies = document.cookie.split(";");
  const pagenameIndex = cookies.findIndex(e => e.includes("pagename"));
  const nextPagename = cookies[pagenameIndex].split("=")[1];
  window.location.href = pathRoot + nextPagename; // remove .html when publishing.
}

function goToFirstPage() {
  window.location.href = pathRoot + "quiet"; // remove .html when publishing.
}

function updateValues() {

  const attributeNames = paras[0].getAttributeNames();
  var attributeValues = [];
  attributeNames.forEach(item => attributeValues.push(paras[0].getAttribute(item)));

  for (let i = 0; i < attributeNames.length; i++) {

    attribute = attributeNames[i];
    value = attributeValues[i];

    switch(attribute) {
      case "prompt":
        document.getElementById("main-button").innerHTML = value;
        break;
      case "link":
        window.location.href = pathRoot + value; // remove .html when publishing.
    }
  }
}