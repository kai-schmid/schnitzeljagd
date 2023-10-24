// Initialisieren der Karte
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialisieren der Zeichenfunktion
var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },
    draw: {
      polygon: true,
      circle: false,
      rectangle: false,
      marker: false,
      polyline: false,
      circlemarker: false
    },
    edit: {
        featureGroup: drawnItems,
        remove: false,
    },
    // Hier setzen Sie die maximale Anzahl von Shapes (in diesem Fall 1)
    maxShapes: 1,
  });

map.addControl(drawControl);

var isDrawingEnabled = true; // Variable zur Verfolgung, ob das Zeichnen erlaubt ist

map.on('draw:created', function (e) {
    if (isDrawingEnabled) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        isDrawingEnabled = false; // Deaktivieren Sie das Zeichnen nach dem Zeichnen eines Polygons
    }
});


// Wenn Sie das gespeicherte Polygon löschen möchten, können Sie die 'Clear' -Funktion hinzufügen
//document.getElementById('clearPolygon').addEventListener('click', function () {
//    drawnItems.clearLayers();
//    isDrawingEnabled = true; // Aktivieren Sie das Zeichnen erneut
//});

// Laden von Polygonen
document.getElementById('loadPolygon').addEventListener('click', function () {
    // Hier können Sie Ihren Code zum Laden von Polygonen implementieren
    // Zum Beispiel: Laden Sie die Polygon-Koordinaten und fügen Sie sie als Layer zur Karte hinzu
});

// Speichern von Polygonen
document.getElementById('savePolygon').addEventListener('click', function () {
    var polygons = [];
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            polygons.push(layer.getLatLngs());
        }
    });
    console.log(JSON.stringify(polygons) );
    // Hier können Sie Ihren Code zum Speichern der Polygon-Koordinaten implementieren
    // Zum Beispiel: Senden Sie die Koordinaten an einen Server oder speichern Sie sie lokal
});
