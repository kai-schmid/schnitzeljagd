var listDatasets = [
    {
        name: null,
        _id: null
    },
    {
        name: null,
        _id: null
    },
    {
        name: null,
        _id: null
    }
];

init();

function init() {
    listDatasets = JSON.parse(document.getElementById('json-data').textContent);
    generateList();
}
function generateList() {
    var list = document.getElementById("jsonList");
    const urlBase = window.location.href.split("/");
    listDatasets.forEach((element, index) => {
        const url = urlBase[0] + "//" + urlBase[2]+"/play?id="+element._id;
        const div = document.createElement("div");
        div.innerHTML = `
                    <div>
                     Link zum Teilen:  <br><a href="${url}" target="_blank">${url}</a>
                     </div>
                    <div>
                        Name: ${element.name}
                    </div>
                    <button onclick="edit(${index},'${element._id}');">Bearbeiten</button>
                    <button onclick="deleteGame(${index},'${element._id}')">Löschen</button>
                    <button onclick="window.location.href = '/play?id=${element._id}'">Spielen</button>
                    <button onclick="navigator.clipboard.writeText('${url}');">Teilen</button>
                    <button onclick="fetchReset('${element._id}')">Zurücksetzen</button>
                    <input type="number" id="number${index}" value="1">
                    <button onclick="fetchSetTo('${element._id}', document.getElementById('number${index}').value)">Setzen</button>

                `;
        jsonList.appendChild(div);
    });
}
function edit(index, id) {
    console.log("Element wird "+ index +" bearbeitet.");
    window.location.href = "/views/editJSON?id=" + id;
}

function fetchReset(id) {
    fetch('/api/reset?id='+id, {
        method: 'GET'
    }).then((res) => {
        if (res.status === 200) {
            alert("Zurückgesetzt");
        } else {
            alert("Fehler beim Zurücksetzen");
        }
    }).catch((err) => {
        console.log(err);
    });
}

function fetchSetTo(id, number) {
    if(number === "" || number === null || number === undefined || isNaN(number)) {
        alert("Bitte eine Zahl eingeben");
        return;
    }
    fetch('/api/set?id='+id+"&count="+number, {
        method: 'GET'
    }).then((res) => {
        if (res.status === 200) {
            alert("Gesetzt auf "+number);
        } else {
            alert("Fehler beim Setzen");
        }
    }).catch((err) => {
        console.log(err);
    });
}

function deleteGame(index, id) {
    if(!confirm("Soll das Spiel wirklich gelöscht werden?")) {
        return;
    }
    fetch('/api/deleteDataset', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id
        })
    }).then((res) => {
        if (res.status === 200) {
            window.location.href = "/dashboard";
        } else {
            alert("Fehler beim Löschen");
        }
    }).catch((err) => {
        console.log(err);
    });
}

function addElement() {
    const gameName = document.getElementById("gameName").value;
    if (gameName === "" || gameName === null || gameName === undefined) {
        alert("Bitte Namen eingeben");
        return;
    }
    window.location.href = "/api/newDataset?name=" + gameName;
}