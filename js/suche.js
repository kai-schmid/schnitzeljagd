var antwortDiv = document.getElementById("answer-input");
//get the query string from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

var object = null;
init();
function init() {
    object = JSON.parse(document.getElementById('json-data').textContent);
    antwortDiv.style.display = "none";
    document.getElementById("questionPromt").innerText = object.question;
    document.getElementById("positionnoteText").innerText = object.positionnote;
    input(object.type);
    getLocation();
}

function checkAnswer() {
    var cleanedAnswer = cleanInput();
    antwortDiv = document.getElementById("answer-input");
    fetch('/api/answer?id=' + id + "&answer=" + cleanedAnswer, {}).then((res) => {
        if (res.status === 200) {
            try{
                object = JSON.parse(res.jsonData);
                init();
            }catch(err){
                console.log(err);
            }
            
        } else {
            alert("Leider ist die antwort falsch!");
        }
    }).catch((err) => {
        console.log(err);
        document.getElementById("message").innerHTML = "Fehler beim überprüfen!";
    });
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(monitorPosition)
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function monitorPosition(position) {
    var userLatitude = position.coords.latitude;
    var userLongitude = position.coords.longitude;
    var targetLatitude = object.coordinates.latitude;
    var targetLongitude = object.coordinates.longitude;
    var radiusMeters = parseFloat(object.radiusMeters) + parseFloat(position.coords.accuracy);
    if (isWithinRadius(userLatitude, userLongitude, targetLatitude, targetLongitude, radiusMeters)){
        antwortDiv.style.display = "block";
    }
     
}
function cleanInput() {
    const answerInput = document.getElementById("answer");
    const cleanedAnswer = answerInput.value.toLowerCase().replace(/\s+/g, "");
    return cleanedAnswer;
}
function input(type) {
    if (type == "text") {
        document.getElementById("input").innerHTML = '<input type="text" id="answer" oninput="cleanInput()">';
    } else if (type == "number") {
        document.getElementById("input").innerHTML = '<input type="number" id="answer" oninput="cleanInput()">';
    } else if (type == "date") {
        document.getElementById("input").innerHTML = '<input type="date" id="answer" oninput="cleanInput()">';
    } else if (type == "time") {
        document.getElementById("input").innerHTML = '<input type="time" id="answer" oninput="cleanInput()">';
    } else if (type == "datetime-local") {
        document.getElementById("input").innerHTML = '<input type="datetime-local" id="answer" oninput="cleanInput()">';
    }
    else if (type == "email") {
        document.getElementById("input").innerHTML = '<input type="email" id="answer" oninput="cleanInput()">';
    } else if (type == "month") {
        document.getElementById("input").innerHTML = '<input type="month" id="answer" oninput="cleanInput()">';
    } else if (type == "search") {
        document.getElementById("input").innerHTML = '<input type="search" id="answer" oninput="cleanInput()">';
    } else if (type == "tel") {
        document.getElementById("input").innerHTML = '<input type="tel" id="answer" oninput="cleanInput()">';
    } else if (type == "url") {
        document.getElementById("input").innerHTML = '<input type="url" id="answer" oninput="cleanInput()">';
    } else if (type == "week") {
        document.getElementById("input").innerHTML = '<input type="week" id="answer" oninput="cleanInput()">';
    } else if (type == "color") {
        document.getElementById("input").innerHTML = '<input type="color" id="answer" oninput="cleanInput()">';
    } else if (type == "range") {
        document.getElementById("input").innerHTML = '<input type="range" id="answer" oninput="cleanInput()">';
    } else if (type == "password") {
        document.getElementById("input").innerHTML = '<input type="password" id="answer" oninput="cleanInput()">';
    } else if (type == "file") {
        document.getElementById("input").innerHTML = '<input type="file" id="answer" oninput="cleanInput()">';
    } else if (type == "checkbox") {
        document.getElementById("input").innerHTML = '<input type="checkbox" id="answer" oninput="cleanInput()">';
    } else if (type == "radio") {
        document.getElementById("input").innerHTML = '<input type="radio" id="answer" oninput="cleanInput()">';
    } else if (type == "button") {
        document.getElementById("input").innerHTML = '<input type="button" id="answer" oninput="cleanInput()">';
    } else if (type == "submit") {
        document.getElementById("input").innerHTML = '<input type="submit" id="answer" oninput="cleanInput()">';
    } else if (type == "reset") {
        document.getElementById("input").innerHTML = '<input type="reset" id="answer" oninput="cleanInput()">';
    } else {
        throw new Error("Invalid input type");
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // Radius der Erde in Metern

    // Konvertiere Gradmaße in Radian
    const radLat1 = (Math.PI / 180) * lat1;
    const radLon1 = (Math.PI / 180) * lon1;
    const radLat2 = (Math.PI / 180) * lat2;
    const radLon2 = (Math.PI / 180) * lon2;

    // Deltas der Koordinaten
    const deltaLat = radLat2 - radLat1;
    const deltaLon = radLon2 - radLon1;

    // Haversine-Formel zur Berechnung der Entfernung
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c; // Entfernung in Metern
    return distance;
}

// Funktion zur Überprüfung der Entfernung zum Ziel
function isWithinRadius(userLat, userLon, targetLat, targetLon, radiusMeters) {
    const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
    console.log(radiusMeters);
    console.log(distance);
    return distance <= radiusMeters;
}