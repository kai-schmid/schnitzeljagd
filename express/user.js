// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const db = require('./dbconnection');
// connect to database
/*mongoose.connect('mongodb://localhost:27017/users',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
*/

db.on('error', console.error.bind(console, 'Verbindung zur Datenbank fehlgeschlagen:'));
  db.once('open', () => {
    console.log('Erfolgreich mit der Datenbank verbunden');
  });
  
// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String
  }
});
// Export Model
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData', User, 'userData');
