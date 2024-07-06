const loadButton = document.getElementById('load-button');
const saveButton = document.getElementById('save-button');

loadButton.addEventListener('click', loadPopup);
saveButton.addEventListener('click', savePopup);
document.addEventListener("keydown", keyboardPopups);

function keyboardPopups(e) {
  key = e["key"];
  switch(key) {
    case "s":
      savePopup();
      break;
    case "l":
      loadPopup();
      break;
  }
}

function loadPopup() {
  var alertText = document.createElement("div");
  if (!cookiesExist) alertText.innerHTML = "You don't have a save!";
  else alertText.innerHTML = "";
  alertText.id = "popup";
  document.body.insertBefore(alertText, document.getElementById("back-button"));
  setTimeout(function() {
    alertText.remove();
  }, 1000);
}

function savePopup() {
    var alertText = document.createElement("div");
    alertText.innerHTML = "Saved!";
    alertText.id = "popup";
    document.body.insertBefore(alertText, document.getElementById("back-button"));
    setTimeout(function() {
      alertText.remove();
    }, 1000);
}