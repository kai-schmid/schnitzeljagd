const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

/*db.on('error', console.error.bind(console, 'Verbindung zur Datenbank fehlgeschlagen:'));
db.once('open', () => {
  console.log('Erfolgreich mit der Datenbank verbunden');
});*/

module.exports = db;