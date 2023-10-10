const mongoose = require('mongoose');

const database_name = process.env.DATABASE_NAME || 'users';
const database_url = process.env.DATABASE_URL || 'localhost';
const database_port = process.env.DATABASE_PORT || '27017';
const database_user = process.env.DATABASE_USER || '';
const database_password = process.env.DATABASE_PASSWORD || '';

const database_url_with_credentials = database_user && database_password ? `mongodb://${database_user}:${database_password}@${database_url}:${database_port}/${database_name}` : `mongodb://${database_url}:${database_port}/${database_name}`;

console.log(`Verbinde mit Datenbank ${database_url_with_credentials}`);

mongoose.connect(database_url_with_credentials, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

/*db.on('error', console.error.bind(console, 'Verbindung zur Datenbank fehlgeschlagen:'));
db.once('open', () => {
  console.log('Erfolgreich mit der Datenbank verbunden');
});*/

module.exports = db;