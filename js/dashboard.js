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
    listDatasets.forEach((element, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
                    <div>
                     Link zum Teilen:  ${element._id}:
                     </div>
                    <div>
                        Name: ${element.name}
                    </div>
                    <button onclick="edit(${index},'${element._id}');">Bearbeiten</button>
                    <button onclick="deleteGame(${index},'${element._id}')">Löschen</button>
                `;
        jsonList.appendChild(div);
    });
}
function edit(index, id) {
    console.log("Element wird "+ index +" bearbeitet.");
    window.location.href = "/html/editJSON?id=" + id;
}
function deleteGame(index, id) {
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