const loadButton = document.getElementById('load-button');
const saveButton = document.getElementById('save-button');

loadButton.addEventListener('click', function() {
    var alertText = document.createElement("div");
    if (!cookiesExist) alertText.innerHTML = "You don't have a save!";
    else alertText.innerHTML = "";
    alertText.id = "popup";
    document.body.insertBefore(alertText, document.getElementById("back-button"));
    setTimeout(function() {
        alertText.remove();
    }, 1000);
});

saveButton.addEventListener('click', function() {
    var alertText = document.createElement("div");
    alertText.innerHTML = "Saved!";
    alertText.id = "popup";
    document.body.appendChild(alertText);
    setTimeout(function() {
        alertText.remove();
    }, 1000);
});

