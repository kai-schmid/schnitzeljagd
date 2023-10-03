var json = {
    user: null,
    name: null,
    _id: null,
    jsonArray: []
}
var jsonArray = json.jsonArray;

init();
function init() {
    // JSON-Objekt aus dem DOM abrufen
    json = JSON.parse(document.getElementById('json-data').textContent);
    jsonArray = json.jsonArray;
    document.getElementById("name").innerText = json.name;
}

function addToJsonArray() {
    const question = document.getElementById("question").value;
    const latitudeText = document.getElementById("latitude").value.replace(',', '.'); // Umwandlung des Kommas in einen Punkt
    const longitudeText = document.getElementById("longitude").value.replace(',', '.'); // Umwandlung des Kommas in einen Punkt
    const latitude = parseFloat(latitudeText);
    const longitude = parseFloat(longitudeText);
    const answers = document.getElementById("answers").value.split(",");
    const answerType = document.getElementById("answerType").value;
    const radiusMeters = document.getElementById("radiusMeters").value;

    // Validierung der Eingaben
    if (!validateInputs(question, answers, latitude, longitude, radiusMeters)) {
        return;
    }

    const newElement = {
        question,
        coordinates: { latitude, longitude },
        answers,
        answerType,
        radiusMeters
    };

    jsonArray.push(newElement);

    // Zurücksetzen der Eingabefelder
    document.getElementById("question").value = "";
    document.getElementById("latitude").value = "";
    document.getElementById("longitude").value = "";
    document.getElementById("answers").value = "";
    document.getElementById("errorText").textContent = ""; // Fehlermeldung löschen

    // Aktualisieren der JSON-Anzeige
    displayJsonList();
}


function validateInputs(question, answers, latitude, longitude, radiusMeters) {
    let isValid = true;
    const errorText = document.getElementById("errorText");
    errorText.textContent = "";

    if (!question || !answers || isNaN(latitude) || isNaN(longitude) || isNaN(radiusMeters)) {
        errorText.textContent = "Bitte füllen Sie alle Felder korrekt aus.";
        isValid = false;
    } else if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        errorText.textContent = "Breitengrad muss zwischen -90 und 90 liegen, Längengrad zwischen -180 und 180.";
        isValid = false;
    }

    return isValid;
}


function displayJsonList() {
    generateJson();
    const jsonList = document.getElementById("jsonList");
    jsonList.innerHTML = ""; // Leeren der Anzeige

    jsonArray.forEach((element, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
                    <div>
                     Station ${index + 1}:
                     </div>
                    <div>
                        Frage: ${element.question}
                    </div>
                    <div>
                        Koordinaten: (${element.coordinates.latitude}, ${element.coordinates.longitude})
                    </div>
                    <div>
                        Antworttyp: ${element.answerType}
                    </div>
                    <div>
                        Antworten: ${element.answers.join(", ")}
                    </div>
                    <div>
                        Radius: ${element.radiusMeters} Meter
                    </div>
                    <button onclick="editJson(${index})">Bearbeiten</button>
                    <button onclick="deleteJson(${index})">Löschen</button>
                `;
        jsonList.appendChild(div);
    });
    saveDataset();
}

let editingIndex = -1; // Variable, um den Index des gerade bearbeiteten Elements zu speichern

function editJson(index) {
    editingIndex = index;

    const element = jsonArray[index];
    const questionDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(1)`);
    const latitudeDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(2)`);
    const longitudeDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(3)`);
    const answersDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(4)`);
    const answerTypeDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(5)`);
    const answerRadiusMetersDiv = document.querySelector(`#jsonList div:nth-child(${index + 1}) div:nth-child(6)`);

    questionDiv.innerHTML = `<input type="text" id="editedQuestion" value="${element.question}">`;
    latitudeDiv.innerHTML = `<input type="text" id="editedLatitude" value="${element.coordinates.latitude}">`;
    longitudeDiv.innerHTML = `<input type="text" id="editedLongitude" value="${element.coordinates.longitude}">`;
    answersDiv.innerHTML = `<input type="text" id="editedAnswers" value="${element.answers.join(", ")}">`;
    answerTypeDiv.innerHTML = `
            <select id="editedAnswerType">
                <option value="text" ${element.answerType === "text" ? "selected" : ""}>Text</option>
                <option value="multipleChoice" ${element.answerType === "multipleChoice" ? "selected" : ""}>Multiple Choice</option>
            </select>
        `;
    answerRadiusMetersDiv.innerHTML = `<input type="number" id="editedRadiusMeters" value="${element.radiusMeters}">`;

    const editButton = document.querySelector(`#jsonList div:nth-child(${index + 1}) button:nth-child(7)`);
    editButton.innerHTML = "Speichern";
    editButton.onclick = saveJson;
}

function saveJson() {
    if (editingIndex === -1) return;

    const editedQuestion = document.getElementById("editedQuestion").value;
    const editedLatitude = document.getElementById("editedLatitude").value;
    const editedLongitude = document.getElementById("editedLongitude").value;
    const editedAnswers = document.getElementById("editedAnswers").value.split(",");
    const editedAnswerType = document.getElementById("editedAnswerType").value;
    const editedRadiusMeters = document.getElementById("editedRadiusMeters").value;

    const editedElement = {
        question: editedQuestion,
        coordinates: { latitude: editedLatitude, longitude: editedLongitude },
        answers: editedAnswers,
        answerType: editedAnswerType,
        radiusMeters: editedRadiusMeters
    };

    jsonArray[editingIndex] = editedElement;
    editingIndex = -1;

    // Aktualisieren der JSON-Anzeige
    displayJsonList();
}

function deleteJson(index) {
    jsonArray.splice(index, 1);
    // Aktualisieren der JSON-Anzeige nach dem Löschen
    displayJsonList();
}

function generateJson() {
    const jsonOutput = document.getElementById("jsonOutput");
    jsonOutput.textContent = JSON.stringify(jsonArray, null, 2);
}

function loadJson() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const jsonContent = event.target.result;
            try {
                const parsedJson = JSON.parse(jsonContent);
                validateJSON(parsedJson);

                jsonArray.push(...parsedJson);
                displayJsonList();
            } catch (error) {
                errorText.textContent = "Fehler beim Parsen der JSON-Datei." + error;
                alert("Fehler beim Parsen der JSON-Datei.");
            }
        };
        reader.readAsText(file);
    }

    function validateJSON(parsedJson) {
        if (Array.isArray(parsedJson)) {
            parsedJson.forEach(element => {
                if (element.question != undefined && element.coordinates != undefined && element.answers != undefined && element.answerType != undefined &&
                    element.question != null && element.coordinates != null && element.answers != null && element.answerType != null) {
                    if (!element.question || !element.answers || isNaN(element.coordinates.latitude) || isNaN(element.coordinates.longitude)) {
                        throw new Error("JSON-Datei: Nicht alle Felder korrekt ausgefüllt.");
                    } else if (element.coordinates.latitude < -90 || element.coordinates.latitude > 90 || element.coordinates.longitude < -180 || element.coordinates.longitude > 180) {
                        throw new Error("JSON-Datei: Breitengrad muss zwischen -90 und 90 liegen, Längengrad zwischen -180 und 180.");
                    }
                } else throw new Error("JSON-Datei enthält nicht alle benötigten Informationen.");
            });
        } else throw new Error("JSON-Datei enthält kein Array.");
    }
}


function downloadJson() {
    const jsonContent = JSON.stringify(jsonArray, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.style.display = "none";
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
}

function saveDataset() {
    json.jsonArray = jsonArray;
    console.log(json);
    fetch('/api/saveDataset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(json)
    }).then((res) => {
        if (res.status === 200) {
            console.log("Erfolgreich gespeichert");
        } else {
            alert("Fehler beim Speichern");
        }
    }).catch((err) => {
        console.log(err);
        alert("Fehler beim Speichern");
    });
}

function changeAnswerType(value){
    if(value == "multipleChoice"){
        document.getElementById("answers").placeholder = "Antworten durch Komma getrennt";
        value = "text";
    }
    document.getElementById("answers").type = value;
}

// Anzeigen der vorhandenen Informationen beim Laden der Seite
displayJsonList();